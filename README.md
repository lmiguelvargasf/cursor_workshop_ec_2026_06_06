# MarketLab

MarketLab is a Cursor workshop starter for building a fake-money prediction market.

## Stack

- Next.js with TypeScript
- Tailwind CSS with shadcn-style UI primitives
- Supabase Auth, Database, and Storage
- Zod for validation
- Bun, Task, Biome, Vitest, and Playwright for local workflow

## Prerequisites

Before starting, make sure you have:

- A [Supabase](https://supabase.com/) account
- A hosted Supabase project for this workshop
- `mise` installed: [Installing Mise](https://mise.jdx.dev/installing-mise.html)

This project uses `mise` to install the required tools.

## Setup

After cloning your repository, run:

```bash
mise trust
mise install
task setup
task hooks:install
```

In your Supabase project dashboard, copy the project URL, anon key, and project ref into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_PROJECT_REF=
```

You can find the URL and anon key under **Project Settings > API**. The project ref is the short project id in your Supabase project URL.

For workshop speed, go to **Authentication > Sign In / Providers > Email** and turn off **Confirm email**.

Authenticate the Supabase CLI, link this repo to your hosted project, and generate local TypeScript types:

```bash
task db:login
task db:link
task db:types
```

Start the app and open [http://localhost:3000](http://localhost:3000):

```bash
task dev
```

You should see the MarketLab workshop start screen.

## Verify

```bash
task verify
task e2e
```

## Commands

Run project commands through Task:

```bash
task --list
```
