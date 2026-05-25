create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  username text not null,
  balance_cents integer not null default 10000 check (balance_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.markets (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.profiles (id) on delete set null,
  title text not null check (char_length(title) between 8 and 160),
  description text not null check (char_length(description) between 20 and 1000),
  category text not null default 'General',
  image_path text,
  close_at timestamptz not null,
  resolved_outcome text check (resolved_outcome in ('yes', 'no')),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references public.markets (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  side text not null check (side in ('yes', 'no')),
  amount_cents integer not null check (amount_cents > 0),
  price_cents integer not null check (price_cents between 1 and 99),
  created_at timestamptz not null default now()
);

create table if not exists public.positions (
  market_id uuid not null references public.markets (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  yes_cents integer not null default 0 check (yes_cents >= 0),
  no_cents integer not null default 0 check (no_cents >= 0),
  updated_at timestamptz not null default now(),
  primary key (market_id, user_id)
);

create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references public.markets (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  winning_side text not null check (winning_side in ('yes', 'no')),
  payout_cents integer not null check (payout_cents >= 0),
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (market_id, user_id)
);

create index if not exists markets_close_at_idx on public.markets (close_at);
create index if not exists trades_market_created_idx on public.trades (market_id, created_at desc);
create index if not exists trades_user_created_idx on public.trades (user_id, created_at desc);
create index if not exists settlements_user_idx on public.settlements (user_id, claimed_at);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists positions_touch_updated_at on public.positions;
create trigger positions_touch_updated_at
before update on public.positions
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(new.email, '@', 1), 'marketlab-user')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_market_price(p_market_id uuid, p_side text)
returns integer
language plpgsql
stable
set search_path = public
as $$
declare
  v_yes integer;
  v_no integer;
  v_total integer;
  v_price integer;
begin
  select
    coalesce(sum(amount_cents) filter (where side = 'yes'), 0)::integer,
    coalesce(sum(amount_cents) filter (where side = 'no'), 0)::integer
  into v_yes, v_no
  from public.trades
  where market_id = p_market_id;

  v_total := v_yes + v_no;

  if v_total = 0 then
    return 50;
  end if;

  if p_side = 'yes' then
    v_price := round((v_yes::numeric / v_total::numeric) * 100);
  else
    v_price := round((v_no::numeric / v_total::numeric) * 100);
  end if;

  return greatest(1, least(99, v_price));
end;
$$;

create or replace function public.execute_trade(
  p_market_id uuid,
  p_side text,
  p_amount_cents integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_market public.markets%rowtype;
  v_price integer;
begin
  if v_user is null then
    raise exception 'Authentication is required.';
  end if;

  if p_side not in ('yes', 'no') then
    raise exception 'Side must be yes or no.';
  end if;

  if p_amount_cents < 100 or p_amount_cents > 50000 then
    raise exception 'Trade amount must be between 1 and 500 dollars.';
  end if;

  select *
  into v_market
  from public.markets
  where id = p_market_id
  for update;

  if not found then
    raise exception 'Market not found.';
  end if;

  if v_market.resolved_outcome is not null then
    raise exception 'Market is already resolved.';
  end if;

  if v_market.close_at <= now() then
    raise exception 'Market is closed.';
  end if;

  v_price := public.current_market_price(p_market_id, p_side);

  update public.profiles
  set balance_cents = balance_cents - p_amount_cents
  where id = v_user and balance_cents >= p_amount_cents;

  if not found then
    raise exception 'Insufficient balance.';
  end if;

  insert into public.trades (market_id, user_id, side, amount_cents, price_cents)
  values (p_market_id, v_user, p_side, p_amount_cents, v_price);

  insert into public.positions (market_id, user_id, yes_cents, no_cents)
  values (
    p_market_id,
    v_user,
    case when p_side = 'yes' then p_amount_cents else 0 end,
    case when p_side = 'no' then p_amount_cents else 0 end
  )
  on conflict (market_id, user_id)
  do update set
    yes_cents = public.positions.yes_cents + excluded.yes_cents,
    no_cents = public.positions.no_cents + excluded.no_cents,
    updated_at = now();
end;
$$;

create or replace function public.resolve_market(
  p_market_id uuid,
  p_outcome text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_market public.markets%rowtype;
  v_yes_pool integer;
  v_no_pool integer;
  v_winning_pool integer;
  v_losing_pool integer;
begin
  if v_user is null then
    raise exception 'Authentication is required.';
  end if;

  if p_outcome not in ('yes', 'no') then
    raise exception 'Outcome must be yes or no.';
  end if;

  select *
  into v_market
  from public.markets
  where id = p_market_id
  for update;

  if not found then
    raise exception 'Market not found.';
  end if;

  if v_market.creator_id is distinct from v_user then
    raise exception 'Only the market creator can resolve this market.';
  end if;

  if v_market.resolved_outcome is not null then
    raise exception 'Market is already resolved.';
  end if;

  update public.markets
  set resolved_outcome = p_outcome, resolved_at = now()
  where id = p_market_id;

  select
    coalesce(sum(yes_cents), 0)::integer,
    coalesce(sum(no_cents), 0)::integer
  into v_yes_pool, v_no_pool
  from public.positions
  where market_id = p_market_id;

  if p_outcome = 'yes' then
    v_winning_pool := v_yes_pool;
    v_losing_pool := v_no_pool;
  else
    v_winning_pool := v_no_pool;
    v_losing_pool := v_yes_pool;
  end if;

  if v_winning_pool <= 0 then
    return;
  end if;

  insert into public.settlements (market_id, user_id, winning_side, payout_cents)
  select
    p_market_id,
    user_id,
    p_outcome,
    case
      when p_outcome = 'yes'
        then yes_cents + floor((yes_cents::numeric / v_winning_pool::numeric) * v_losing_pool)::integer
      else no_cents + floor((no_cents::numeric / v_winning_pool::numeric) * v_losing_pool)::integer
    end
  from public.positions
  where market_id = p_market_id
    and case when p_outcome = 'yes' then yes_cents else no_cents end > 0
  on conflict (market_id, user_id) do nothing;
end;
$$;

create or replace function public.claim_settlement(p_settlement_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_payout integer;
begin
  if v_user is null then
    raise exception 'Authentication is required.';
  end if;

  update public.settlements
  set claimed_at = now()
  where id = p_settlement_id
    and user_id = v_user
    and claimed_at is null
  returning payout_cents into v_payout;

  if not found then
    raise exception 'Settlement not found or already claimed.';
  end if;

  update public.profiles
  set balance_cents = balance_cents + v_payout
  where id = v_user;

  return v_payout;
end;
$$;

alter table public.profiles enable row level security;
alter table public.markets enable row level security;
alter table public.trades enable row level security;
alter table public.positions enable row level security;
alter table public.settlements enable row level security;

drop policy if exists "Profiles are owner readable" on public.profiles;
create policy "Profiles are owner readable"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can create their own starter profile" on public.profiles;
create policy "Users can create their own starter profile"
on public.profiles for insert
with check (auth.uid() = id and balance_cents = 10000);

drop policy if exists "Markets are public" on public.markets;
create policy "Markets are public"
on public.markets for select
using (true);

drop policy if exists "Authenticated users can create markets" on public.markets;
create policy "Authenticated users can create markets"
on public.markets for insert
with check (auth.uid() = creator_id);

drop policy if exists "Trades are public" on public.trades;
create policy "Trades are public"
on public.trades for select
using (true);

drop policy if exists "Positions are owner readable" on public.positions;
create policy "Positions are owner readable"
on public.positions for select
using (auth.uid() = user_id);

drop policy if exists "Settlements are owner readable" on public.settlements;
create policy "Settlements are owner readable"
on public.settlements for select
using (auth.uid() = user_id);

revoke execute on function public.execute_trade(uuid, text, integer) from public, anon;
revoke execute on function public.resolve_market(uuid, text) from public, anon;
revoke execute on function public.claim_settlement(uuid) from public, anon;

grant execute on function public.execute_trade(uuid, text, integer) to authenticated;
grant execute on function public.resolve_market(uuid, text) to authenticated;
grant execute on function public.claim_settlement(uuid) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'market-images',
  'market-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Market images are public" on storage.objects;
create policy "Market images are public"
on storage.objects for select
using (bucket_id = 'market-images');

drop policy if exists "Users upload market images to their folder" on storage.objects;
create policy "Users upload market images to their folder"
on storage.objects for insert
with check (
  bucket_id = 'market-images'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users manage market images in their folder" on storage.objects;
create policy "Users manage market images in their folder"
on storage.objects for update
using (
  bucket_id = 'market-images'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'market-images'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);
