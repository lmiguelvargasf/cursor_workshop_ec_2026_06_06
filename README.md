# MarketLab

MarketLab is a Cursor workshop starter for building a fake-money prediction market with Next.js, Tailwind CSS, shadcn-style primitives, and hosted Supabase.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS and shadcn-style UI primitives
- Supabase Auth, Postgres, Storage, RLS, and RPC
- Zod, Vitest, Playwright, Biome, Bun

## Prerequisites

Install `mise` before starting: [Installing Mise](https://mise.jdx.dev/installing-mise.html).

This project uses `mise` to install the pinned workshop tools. Task is the workshop command runner; see the official [Task docs](https://taskfile.dev/docs/installation) for reference, but you do not need to install it separately when using `mise`.

## Setup

Clone the repo, trust the project `mise` config, install tools, and set up dependencies:

```bash
mise trust
mise install
task setup
task hooks:install
```

Create a hosted Supabase project for the workshop. In the Supabase dashboard, copy the project URL, anon key, and project ref into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_PROJECT_REF=
```

For workshop speed, go to **Authentication > Sign In / Providers > Email** and turn off **Confirm email**.

Start the app and open [http://localhost:3000](http://localhost:3000):

```bash
task dev
```

You should see the MarketLab workshop start screen.

## Workshop Build

Workshop prompts live on the `prompts` branch. Use that branch when you are ready to run the Supabase MCP build prompt for Auth, Database, Storage, RLS, RPC, and Server Actions.

If the Supabase CLI asks you to authenticate first, run:

```bash
task db:login
```

After the prompt creates the Supabase artifacts, link the repo and apply the generated migrations and seed data:

```bash
task db:link
task db:push
task db:types
```

Verify the finished workshop app:

```bash
task verify
task e2e
```

## Commands

Run project commands through Task:

```bash
task --list
```
