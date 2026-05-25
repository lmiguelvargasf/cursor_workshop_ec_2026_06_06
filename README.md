# MarketLab

MarketLab is a Cursor workshop app: a fake-money prediction market built with Next.js, Tailwind CSS, shadcn-style primitives, and hosted Supabase.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS and shadcn-style UI primitives
- Supabase Auth, Postgres, Storage, RLS, and RPC
- Zod, Vitest, Playwright, Biome, Bun

## Setup

Clone the repo, install tools, and create a local env file:

```bash
mise install
bun install
cp .env.example .env.local
```

Create a hosted Supabase project for the workshop. In the Supabase dashboard, copy the project URL, anon key, and project ref into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_PROJECT_REF=
```

For workshop speed, go to **Authentication > Sign In / Providers > Email** and turn off **Confirm email**.

Link the repo to the hosted project, then apply migrations and seed demo markets:

```bash
bun run db:link
bun run db:push
```

If the Supabase CLI asks you to authenticate first, run:

```bash
bunx supabase login
```

Start the app and open [http://localhost:3000](http://localhost:3000):

```bash
bun run dev
```

You should see seeded demo markets, be able to create an email/password account, create a market with an image, trade, resolve, and claim fake winnings.

## Commands

- `bun run dev` - start the app.
- `bun run db:link` - link this repo to the hosted Supabase project.
- `bun run db:push` - apply migrations and seed demo markets.
- `bun run db:types` - generate Supabase TypeScript types.
- `bun run check` - run Biome checks.
- `bun run typecheck` - generate Next route types and run TypeScript.
- `bun run test:run` - run unit tests.
- `bun run e2e` - run the Playwright smoke test.
