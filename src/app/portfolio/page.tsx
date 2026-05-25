import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/marketlab/header";
import { Notice } from "@/components/marketlab/notice";
import { Button } from "@/components/ui/button";
import { getDisplayProfile, getPortfolioData } from "@/lib/data";
import { formatCents } from "@/lib/marketlab";

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const [{ notice }, data] = await Promise.all([
    searchParams,
    getPortfolioData(),
  ]);
  const profile = getDisplayProfile(data.viewer);

  return (
    <div className="min-h-svh bg-zinc-50 text-zinc-950">
      <Header configured={data.configured} viewer={data.viewer} />
      <Notice message={notice} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Button asChild size="sm" variant="ghost">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Markets
          </Link>
        </Button>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 md:col-span-1">
            <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
            {profile ? (
              <>
                <div className="mt-6 text-sm text-zinc-500">
                  Available balance
                </div>
                <div className="mt-1 text-4xl font-semibold tracking-tight">
                  {formatCents(profile.balanceCents)}
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-500">
                  Signed in as {profile.username}
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm leading-6 text-zinc-500">
                Sign in to see positions and claim winnings.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 md:col-span-2">
            <h2 className="text-lg font-semibold tracking-tight">
              Open positions
            </h2>
            <div className="mt-4 divide-y divide-zinc-100">
              {data.positions.length ? (
                data.positions.map((position) => (
                  <Link
                    className="grid gap-2 py-4 text-sm hover:bg-zinc-50 sm:grid-cols-[1fr_auto_auto]"
                    href={`/markets/${position.market_id}`}
                    key={position.market_id}
                  >
                    <span className="font-medium">{position.market.title}</span>
                    <span>YES {formatCents(position.yes_cents)}</span>
                    <span>NO {formatCents(position.no_cents)}</span>
                  </Link>
                ))
              ) : (
                <p className="py-4 text-sm text-zinc-500">No positions yet.</p>
              )}
            </div>
          </section>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">
              Settlements
            </h2>
            <div className="mt-4 divide-y divide-zinc-100">
              {data.settlements.length ? (
                data.settlements.map((settlement) => (
                  <div className="grid gap-2 py-4 text-sm" key={settlement.id}>
                    <Link
                      className="font-medium hover:underline"
                      href={`/markets/${settlement.market_id}`}
                    >
                      {settlement.market.title}
                    </Link>
                    <div className="flex items-center justify-between gap-3 text-zinc-600">
                      <span>{settlement.winning_side.toUpperCase()} won</span>
                      <span>{formatCents(settlement.payout_cents)}</span>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {settlement.claimed_at ? "Claimed" : "Ready to claim"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-zinc-500">
                  No settlements yet.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">
              Trade history
            </h2>
            <div className="mt-4 divide-y divide-zinc-100">
              {data.trades.length ? (
                data.trades.map((trade) => (
                  <div className="grid gap-2 py-4 text-sm" key={trade.id}>
                    <Link
                      className="font-medium hover:underline"
                      href={`/markets/${trade.market_id}`}
                    >
                      {trade.market?.title ?? "Deleted market"}
                    </Link>
                    <div className="flex items-center justify-between gap-3 text-zinc-600">
                      <span>{trade.side.toUpperCase()}</span>
                      <span>{formatCents(trade.amount_cents)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-zinc-500">No trades yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
