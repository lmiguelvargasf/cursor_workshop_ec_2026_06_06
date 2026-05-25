# Cursor PR Review Automation Prompt

Use this prompt for a Cursor Automation attached to workshop PRs:

```text
Review this MarketLab workshop PR.

Focus on:
- Unused or reintroduced technologies that AGENTS.md forbids.
- Supabase RLS policies that allow users to mutate balances, positions, settlements, or trades outside approved RPC functions.
- Auth regressions in Server Actions.
- Storage uploads that do not stay inside the authenticated user's folder.
- Next.js 16 App Router mistakes, especially synchronous params/searchParams usage.
- Broken workshop flow: sign up, create market with image, trade YES/NO, resolve, claim, portfolio.

Leave concise findings with file and line references. If there are no blocking findings, summarize residual test gaps.
```

Recommended schedule: run on PR opened, PR synchronized, and once daily while the PR is open.
