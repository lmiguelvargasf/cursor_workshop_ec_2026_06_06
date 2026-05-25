---
name: marketlab-supabase
description: Use when working on MarketLab features, Supabase schema/RLS, workshop docs, or Cursor demo flow.
---

# MarketLab Supabase Skill

MarketLab is a fake-money prediction market for a 2-hour Cursor workshop.

## Rules

- Keep the app teachable; avoid adding infrastructure that is not used in the workshop.
- Use Supabase client helpers and Server Actions, not Drizzle or direct Postgres drivers.
- Put schema changes in Supabase migrations.
- Use RPC functions for balance-changing operations.
- Keep all market examples fictional and non-political.
- Treat all balances as fake cents.

## Implementation Checklist

- Read `AGENTS.md`.
- Read relevant Next docs under `node_modules/next/dist/docs/`.
- Confirm Server Actions re-check auth and ownership.
- Confirm RLS keeps profile, position, and settlement rows owner-scoped.
- Confirm public market reads still work for signed-out users.
- Run `bun run check`, `bun run typecheck`, and `bun run test:run`.
