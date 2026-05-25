import { KeyRound, UserPlus } from "lucide-react";

import { signInAction, signUpAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function AuthPanel({ configured }: { configured: boolean }) {
  return (
    <section
      className="border-t border-zinc-200 bg-zinc-950 px-4 py-10 text-white"
      id="auth"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            Supabase Auth
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Create a trader account with a fake starter balance.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300">
            Email/password auth keeps the live workshop setup fast while still
            showing protected Server Actions, RLS, and owner-scoped data.
          </p>
          {!configured ? (
            <p className="mt-4 rounded-md border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">
              Add Supabase environment variables to enable auth forms.
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <form
            action={signInAction}
            className="rounded-lg bg-white p-4 text-zinc-950"
          >
            <input name="returnTo" type="hidden" value="/" />
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <KeyRound className="size-4" />
              Sign in
            </div>
            <AuthFields idPrefix="signin" />
            <Button className="mt-4 w-full" disabled={!configured} size="lg">
              Sign in
            </Button>
          </form>

          <form
            action={signUpAction}
            className="rounded-lg bg-white p-4 text-zinc-950"
          >
            <input name="returnTo" type="hidden" value="/" />
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <UserPlus className="size-4" />
              Create account
            </div>
            <label className="block text-sm font-medium" htmlFor="username">
              Display name
            </label>
            <input
              className="mt-1 h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-950"
              id="username"
              name="username"
              placeholder="Workshop trader"
            />
            <AuthFields idPrefix="signup" />
            <Button className="mt-4 w-full" disabled={!configured} size="lg">
              Create account
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function AuthFields({ idPrefix }: { idPrefix: string }) {
  return (
    <div className="mt-3 grid gap-3">
      <label
        className="block text-sm font-medium"
        htmlFor={`${idPrefix}-email`}
      >
        Email
      </label>
      <input
        autoComplete="email"
        className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-950"
        id={`${idPrefix}-email`}
        name="email"
        placeholder="you@example.com"
        required
        type="email"
      />
      <label
        className="block text-sm font-medium"
        htmlFor={`${idPrefix}-password`}
      >
        Password
      </label>
      <input
        autoComplete="current-password"
        className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-950"
        id={`${idPrefix}-password`}
        minLength={6}
        name="password"
        placeholder="At least 6 characters"
        required
        type="password"
      />
    </div>
  );
}
