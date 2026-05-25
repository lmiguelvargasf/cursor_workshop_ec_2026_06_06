# MarketLab

MarketLab is a Cursor workshop app: a fake-money prediction market built with Next.js, Tailwind CSS, shadcn-style primitives, and hosted Supabase.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS and shadcn-style UI primitives
- Supabase Auth, Postgres, Storage, RLS, and RPC
- Zod, Vitest, Playwright, Biome, Bun

## Prerequisite

Install `mise` before starting: [Installing Mise](https://mise.jdx.dev/installing-mise.html).

This project uses `mise` to install the pinned workshop tools, including Node.js, Bun, the GitHub CLI, and Task. Task is the workshop command runner; see the official [Task installation docs](https://taskfile.dev/docs/installation) for reference, but you do not need to install it separately when using `mise`.

## Setup

Clone the repo, trust the project `mise` config, install tools, and set up dependencies:

```bash
mise trust
mise install
task setup
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
task db:link
task db:push
```

If the Supabase CLI asks you to authenticate first, run:

```bash
task db:login
```

Start the app and open [http://localhost:3000](http://localhost:3000):

```bash
task dev
```

You should see seeded demo markets, be able to create an email/password account, create a market with an image, trade, resolve, and claim fake winnings.

## Commands

- `task setup` - install dependencies and create `.env.local` if needed.
- `task dev` - start the app.
- `task build` - build the app for production.
- `task db:login` - authenticate the Supabase CLI.
- `task db:link` - link this repo to the hosted Supabase project.
- `task db:push` - apply migrations and seed demo markets.
- `task db:types` - generate Supabase TypeScript types.
- `task check` - run Biome checks.
- `task check:write` - run Biome checks and apply safe fixes.
- `task typecheck` - generate Next route types and run TypeScript.
- `task test:run` - run unit tests once.
- `task test:watch` - run unit tests in watch mode.
- `task e2e` - run the Playwright smoke test.
- `task e2e:ui` - run Playwright in UI mode.
- `task verify` - run checks, typecheck, and unit tests.
