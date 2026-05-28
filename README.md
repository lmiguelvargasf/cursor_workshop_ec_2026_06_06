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

### macOS / Linux

A setup script automates the steps above:

```bash
bash ./scripts/unix-setup.sh
```

### Windows (PowerShell)

A setup script automates the steps above:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows-setup.ps1
```

If a Group Policy enforces a signed-script execution policy, the command above
fails with `... is not digitally signed` even with `-ExecutionPolicy Bypass`
(policy scope overrides the command line). Pipe the script through stdin
instead, which runs it as commands rather than a file:

```powershell
Get-Content .\scripts\windows-setup.ps1 -Raw | powershell -NoProfile -Command -
```

After it finishes, open a new PowerShell window (so `mise` activation loads) and
run `task dev`.

In your Supabase project dashboard, click **Connect**, select **Next.js**, and copy the `.env.local` values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_PROJECT_REF=
```

Add `SUPABASE_PROJECT_REF` from your Supabase project URL: `https://supabase.com/dashboard/project/<project-ref>`.

For workshop speed, go to **Authentication > Sign In / Providers > Email** and turn off **Confirm email**.

Authenticate the Supabase CLI, link this repo to your hosted project, and generate local TypeScript types:

```bash
task db:login
task db:link
task db:types
```

Start the app:

```bash
task dev
```

Open [http://localhost:3000](http://localhost:3000).

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
