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

Start the app and open [http://localhost:3000](http://localhost:3000):

```bash
task dev
```

You should see the MarketLab workshop start screen.

## Commands

Run project commands through Task:

```bash
task --list
```
