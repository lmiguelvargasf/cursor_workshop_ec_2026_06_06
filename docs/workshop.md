# MarketLab Workshop Runbook

## Live Build Flow

1. Create or open a Linear issue for the MarketLab feature slice.
2. Ask Cursor Composer 2.5 to implement the issue using `AGENTS.md` and the MarketLab skill.
3. Use Multitask to split independent work:
   - dependency cleanup
   - Supabase migration and RLS review
   - app UI and Server Actions
   - tests and docs
4. Use Supabase MCP to inspect migrations, policies, the `market-images` bucket, and seeded rows.
5. Use Linear MCP to update the issue with implementation notes.
6. Run validation and open a PR.
7. Attach the PR review helper automation prompt.

## Supabase Checklist

- Create a hosted dev project.
- Apply `supabase/migrations/20260525000000_marketlab.sql`.
- Confirm the `market-images` bucket is public with 5 MB file limit.
- Disable email confirmations for workshop speed.
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
- Seed demo markets with `supabase/seed.sql` or Supabase SQL editor.

## Demo Script

1. Show demo mode without Supabase env vars.
2. Add env vars and reload to show live mode.
3. Sign up with email/password and starter fake balance.
4. Create a market with an uploaded image.
5. Buy YES and NO from separate accounts or one account.
6. Resolve a creator-owned market.
7. Claim winnings and inspect the balance change.
8. Show the same state in Supabase tables and Storage.

## Linear MCP Ideas

- Create one issue called `Build MarketLab workshop app`.
- Add acceptance criteria for auth, market creation, trading, resolution, and portfolio.
- During the workshop, ask Cursor to summarize the completed work back into the Linear issue.

## Supabase MCP Ideas

- Ask for a schema summary after the migration.
- Ask which RLS policies protect owner-scoped data.
- Ask for the rows in `markets`, `trades`, `positions`, and `settlements`.
- Ask it to verify that `market-images` exists and is public.
