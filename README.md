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

After the script finishes, open a new terminal window before running the
remaining commands. The setup script adds mise activation to your shell so the
tools pinned in `mise.toml` are available through normal `task ...` commands.

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
task --list
```

## Tool Troubleshooting

If `task` is missing, the current shell probably has not loaded mise yet. Open
a new terminal, or use the one-off fallback:

```bash
mise exec -- task dev
```

On macOS or Linux, if `mise` itself is not on `PATH`, use:

```bash
~/.local/bin/mise exec -- task dev
```
