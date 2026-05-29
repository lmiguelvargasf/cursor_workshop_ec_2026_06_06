"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signIn, signUp } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { initialAuthActionState } from "@/lib/auth/validation";

type AuthFormProps = {
  isConfigured: boolean;
  mode: "signin" | "signup";
};

const configurationMessage =
  "Supabase is not configured. Add your workshop Supabase values to .env.local before signing in.";

export function AuthForm({ isConfigured, mode }: AuthFormProps) {
  const isSignUp = mode === "signup";
  const action = isSignUp ? signUp : signIn;
  const [state, formAction, pending] = useActionState(
    action,
    initialAuthActionState,
  );

  return (
    <div className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-7">
      <div className="mb-6">
        <p className="text-sm font-medium text-[#00d395]">MarketLab account</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          {isSignUp ? "Create account" : "Sign in"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          {isSignUp
            ? "Create a workshop account with email and password."
            : "Use your workshop account to trade with fake money."}
        </p>
      </div>

      {!isConfigured ? (
        <p className="mb-4 rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm leading-6 text-amber-100">
          {configurationMessage}
        </p>
      ) : null}

      <form action={formAction} className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-100" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="h-11 rounded-md border border-white/15 bg-black/30 px-3 text-base text-white outline-none transition placeholder:text-zinc-500 focus:border-[#00d395]/70 focus:ring-3 focus:ring-[#00d395]/20"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
          {state.errors?.email ? (
            <p className="text-sm text-red-200">{state.errors.email[0]}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <label
            className="text-sm font-medium text-zinc-100"
            htmlFor="password"
          >
            Password
          </label>
          <input
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className="h-11 rounded-md border border-white/15 bg-black/30 px-3 text-base text-white outline-none transition placeholder:text-zinc-500 focus:border-[#00d395]/70 focus:ring-3 focus:ring-[#00d395]/20"
            id="password"
            minLength={6}
            name="password"
            placeholder="At least 6 characters"
            required
            type="password"
          />
          {state.errors?.password ? (
            <p className="text-sm text-red-200">{state.errors.password[0]}</p>
          ) : null}
        </div>

        {state.message ? (
          <p
            aria-live="polite"
            className={
              state.status === "success"
                ? "rounded-md border border-[#00d395]/30 bg-[#00d395]/10 px-3 py-2 text-sm leading-6 text-emerald-100"
                : "rounded-md border border-red-300/30 bg-red-300/10 px-3 py-2 text-sm leading-6 text-red-100"
            }
          >
            {state.message}
          </p>
        ) : null}

        <Button
          className="mt-1 h-11 bg-[#00d395] text-zinc-950 hover:bg-[#00d395]/90"
          disabled={pending || !isConfigured}
          type="submit"
        >
          {pending
            ? isSignUp
              ? "Creating account..."
              : "Signing in..."
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-300">
        {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          className="font-medium text-[#00d395] underline-offset-4 hover:underline"
          href={isSignUp ? "/auth" : "/auth?mode=signup"}
        >
          {isSignUp ? "Sign in" : "Create account"}
        </Link>
      </p>
    </div>
  );
}
