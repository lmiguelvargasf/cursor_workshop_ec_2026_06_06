import { ArrowRight, Timer } from "lucide-react";
import Link from "next/link";

import { MarketImage } from "@/components/marketlab/market-image";
import { formatCents, formatProbability } from "@/lib/marketlab";
import type { MarketWithStats } from "@/lib/supabase/types";

export function MarketCard({ market }: { market: MarketWithStats }) {
  return (
    <Link
      className="group grid overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm md:grid-cols-[15rem_1fr]"
      href={`/markets/${market.id}`}
    >
      <div className="aspect-[16/10] md:aspect-auto">
        <MarketImage market={market} />
      </div>
      <div className="flex min-w-0 flex-col justify-between gap-5 p-5">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-zinc-700">
              {market.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Timer className="size-3" />
              Closes {formatDate(market.close_at)}
            </span>
          </div>
          <h2 className="text-xl font-semibold leading-snug tracking-tight text-zinc-950">
            {market.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
            {market.description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
          <PriceBar label="YES" price={market.stats.yesPrice} tone="emerald" />
          <PriceBar label="NO" price={market.stats.noPrice} tone="rose" />
          <div className="flex items-center justify-between gap-3 text-sm sm:block sm:text-right">
            <div className="text-zinc-500">Volume</div>
            <div className="font-semibold text-zinc-950">
              {formatCents(market.stats.volumeCents)}
            </div>
          </div>
        </div>

        <div className="flex items-center text-sm font-medium text-zinc-950">
          Open market
          <ArrowRight className="ml-1 size-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function PriceBar({
  label,
  price,
  tone,
}: {
  label: string;
  price: number;
  tone: "emerald" | "rose";
}) {
  const fill = tone === "emerald" ? "bg-emerald-500" : "bg-rose-500";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-600">{label}</span>
        <span className="font-semibold text-zinc-950">
          {formatProbability(price)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full ${fill}`}
          style={{ width: `${price}%` }}
        />
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}
