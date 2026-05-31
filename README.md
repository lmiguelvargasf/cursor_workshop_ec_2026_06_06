# MarketLab

MarketLab is a fake-money prediction market app for the Cursor workshop.

## Setup

Clone the repo, open a terminal in the project folder, and run the setup script
for your operating system.

### macOS / Linux

```bash
bash ./scripts/unix-setup.sh
```

### Windows

Open PowerShell and run this command first:

```powershell
pwsh -ExecutionPolicy Bypass -File .\scripts\windows-setup.ps1
```

If Windows says `pwsh` is not recognized, run this command instead:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows-setup.ps1
```

After the script finishes, close that PowerShell window and open a new one of
the same kind before running `task dev`.

## Supabase

Create a hosted Supabase project, then copy the Next.js environment values into
`.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_PROJECT_REF=
```

You can find `SUPABASE_PROJECT_REF` in your project URL:

```text
https://supabase.com/dashboard/project/<project-ref>
```

For the workshop, go to **Authentication > Sign In / Providers > Email** and
turn off **Confirm email**.

Then link the repo and generate types:

```bash
task db:login
task db:link
task db:types
```

## Run

```bash
task dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
task verify
task e2e
task --list
```
