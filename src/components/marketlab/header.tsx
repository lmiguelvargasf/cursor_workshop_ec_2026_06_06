import { LogOut, WalletCards } from "lucide-react";
import Link from "next/link";

import { signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { getDisplayProfile, type Viewer } from "@/lib/data";
import { formatCents } from "@/lib/marketlab";

export function Header({
  configured,
  viewer,
}: {
  configured: boolean;
  viewer: Viewer | null;
}) {
  const profile = getDisplayProfile(viewer);

  return (
    <header className="border-b border-zinc-200 bg-white/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            MarketLab
          </Link>
          <p className="mt-1 text-sm text-zinc-500">
            Fake-money prediction markets for the Cursor workshop.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!configured ? (
            <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Demo mode
            </span>
          ) : null}
          {profile ? (
            <>
              <Link
                href="/portfolio"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm font-medium hover:bg-zinc-50"
              >
                <WalletCards className="size-4" />
                {formatCents(profile.balanceCents)}
              </Link>
              <form action={signOutAction}>
                <input name="returnTo" type="hidden" value="/" />
                <Button size="lg" variant="outline">
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <a
              className="inline-flex h-9 items-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800"
              href="#auth"
            >
              Sign in
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
