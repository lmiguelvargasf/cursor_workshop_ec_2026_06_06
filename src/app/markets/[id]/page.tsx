import { ArrowLeft, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/marketlab/header";
import { MarketImage } from "@/components/marketlab/market-image";
import { Notice } from "@/components/marketlab/notice";
import { ResolveMarketForm } from "@/components/marketlab/resolve-market-form";
import { TradeTicket } from "@/components/marketlab/trade-ticket";
import { Button } from "@/components/ui/button";
import { getMarketDetail } from "@/lib/data";
import { formatCents, formatProbability } from "@/lib/marketlab";

export default async function MarketPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const [{ id }, { notice }] = await Promise.all([params, searchParams]);
  const data = await getMarketDetail(id);

  if (!data.market) {
    return (
      <div className="min-h-svh bg-zinc-50">
        <Header configured={data.configured} viewer={data.viewer} />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-semibold tracking-tight">
            Market not found
          </h1>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/">Back to markets</Link>
          </Button>
        </main>
      </div>
    );
  }

  const market = data.market;
  const canResolve = data.viewer?.id === market.creator_id;

  return (
    <div className="min-h-svh bg-zinc-50 text-zinc-950">
      <Header configured={data.configured} viewer={data.viewer} />
      <Notice message={notice} />

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_22rem]">
        <section className="min-w-0">
          <Button asChild size="sm" variant="ghost">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Markets
            </Link>
          </Button>

          <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <div className="aspect-[16/7] min-h-56">
              <MarketImage market={market} priority />
            </div>
            <div className="p-6">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                <span className="rounded-md bg-zinc-100 px-2 py-1 text-zinc-700">
                  {market.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  Closes {formatDate(market.close_at)}
                </span>
                {market.resolved_outcome ? (
                  <span className="rounded-md bg-emerald-100 px-2 py-1 text-emerald-800">
                    Resolved {market.resolved_outcome.toUpperCase()}
                  </span>
                ) : null}
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight">
                {market.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
                {market.description}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Stat
              label="YES price"
              value={formatProbability(market.stats.yesPrice)}
            />
            <Stat
              label="NO price"
              value={formatProbability(market.stats.noPrice)}
            />
            <Stat
              label="Volume"
              value={formatCents(market.stats.volumeCents)}
            />
          </div>

          <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="size-5 text-zinc-400" />
              <h2 className="text-lg font-semibold tracking-tight">
                Recent trades
              </h2>
            </div>
            {data.recentTrades.length ? (
              <div className="divide-y divide-zinc-100">
                {data.recentTrades.map((trade) => (
                  <div
                    className="grid grid-cols-[1fr_auto_auto] gap-3 py-3 text-sm"
                    key={trade.id}
                  >
                    <span className="font-medium uppercase">{trade.side}</span>
                    <span>{formatCents(trade.amount_cents)}</span>
                    <span className="text-zinc-500">
                      {formatProbability(trade.price_cents)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No trades yet.</p>
            )}
          </section>
        </section>

        <aside className="grid content-start gap-4">
          <TradeTicket
            market={market}
            position={data.position}
            signedIn={Boolean(data.viewer)}
          />
          <ResolveMarketForm
            canResolve={canResolve}
            market={market}
            settlement={data.settlement}
          />
        </aside>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
