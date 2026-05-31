<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MarketLab Workshop Rules

This repository is a focused Cursor workshop app. Keep implementation choices small, teachable, and aligned with the 2-hour workshop flow.

## Stack

- Use Next.js App Router, React Server Components by default, and Server Actions for mutations.
- Use Supabase Auth, Database, and Storage through `@supabase/ssr` and `@supabase/supabase-js`.
- Use Supabase migrations as the schema source of truth.
- When adding Supabase migrations or seed data, run `task db:push` and `task db:types` after the repo is linked to the hosted project.
- Do not reintroduce Drizzle, Postgres drivers, Stripe, email, analytics, Sentry, React Hook Form, TanStack Query, or AI SDK dependencies.
- Run project commands through `task` unless the needed command is not available in `Taskfile.yml`.
- If mise-managed tools are missing in the current shell, use `mise exec -- task <task-name>` as a fallback.
- For hook changes, run `task hooks:validate` and `task hooks:run`.

## Product

- The app is named MarketLab, a fake-money prediction market for workshop demos.
- Keep markets fictional and non-political.
- Treat balances as fake cents. Never add real payments or financial claims.
- Use email/password auth for the workshop path.

## Data Safety

- Every Server Action must verify authentication and authorization before mutation.
- Prefer RLS and Supabase RPC functions for balance-changing operations.
- Public market data can be readable; profiles, positions, and settlements are owner-scoped.
