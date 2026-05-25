insert into public.markets (
  id,
  creator_id,
  title,
  description,
  category,
  close_at
)
values
  (
    '00000000-0000-4000-8000-000000000001',
    null,
    'Will Quito record measurable rain this Saturday?',
    'This demo market resolves YES if a public weather source records measurable rainfall in Quito before midnight local time this Saturday.',
    'Weather',
    now() + interval '12 days'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    null,
    'Will the demo app pass all checks before the workshop ends?',
    'This market resolves YES if the instructor runs the planned lint, typecheck, unit test, and smoke test commands successfully during the workshop.',
    'Workshop',
    now() + interval '2 days'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    null,
    'Will a new local coffee shop open near the venue this month?',
    'This market resolves YES if a new public coffee shop listing appears within walking distance of the workshop venue before month end.',
    'Local',
    now() + interval '20 days'
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    null,
    'Will the next product demo include a storage upload?',
    'This market resolves YES if the final live demo includes an uploaded market image served from Supabase Storage.',
    'Product',
    now() + interval '7 days'
  )
on conflict (id) do nothing;
