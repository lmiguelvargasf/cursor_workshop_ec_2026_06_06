# MarketLab

MarketLab is a focused Cursor workshop app: a fake-money prediction market built with Next.js 16, React 19, Tailwind CSS, shadcn/ui primitives, and Supabase Auth, Database, and Storage.

The app is intentionally small so a 2-hour workshop can show:

- Composer 2.5 for the main implementation pass.
- Multitask for dependency cleanup, schema/RLS, UI, and tests.
- Skills and `AGENTS.md` for persistent project guidance.
- Cursor Automations as a PR review helper.
- Linear MCP for real issue context.
- Supabase MCP for schema, auth, storage, and SQL visibility.

## Stack

| Layer | Technology |
| --- | --- |
| App | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui-owned primitives |
| Backend | Supabase Auth, Postgres, Storage, RLS, RPC |
| Validation | Zod and small domain helpers |
| Tests | Vitest, Testing Library, Playwright |
| Tooling | Bun, Biome, Supabase CLI |

Removed from the scaffold for workshop focus: Drizzle, direct Postgres driver, AI SDK, Stripe, email, analytics, Sentry, React Hook Form, and TanStack Query.

## Setup

```bash
mise install
bun install
cp .env.example .env.local
```

Create a hosted Supabase dev project, apply `supabase/migrations/20260525000000_marketlab.sql`, and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_PROJECT_REF=
```

For the smoothest workshop auth flow, disable email confirmations in the Supabase project Auth settings.

Start the app:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase environment variables, the app renders demo market data and disables mutations.

## Commands

| Command | Description |
| --- | --- |
| `bun run dev` | Start Next.js locally. |
| `bun run check` | Run Biome formatting and lint checks. |
| `bun run typecheck` | Generate Next route types and run TypeScript. |
| `bun run test:run` | Run unit tests once. |
| `bun run e2e` | Run Playwright smoke tests. |
| `bun run db:types` | Generate Supabase types for the configured hosted project. |

## Workshop Docs

- [Workshop runbook](./docs/workshop.md)
- [PR review automation prompt](./docs/pr-review-automation.md)
- Cursor skill: [`.cursor/skills/marketlab-supabase/SKILL.md`](./.cursor/skills/marketlab-supabase/SKILL.md)
