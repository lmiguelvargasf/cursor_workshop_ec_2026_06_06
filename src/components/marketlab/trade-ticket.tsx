import { CircleDollarSign } from "lucide-react";

import { placeTradeAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { formatProbability, isMarketClosed } from "@/lib/marketlab";
import type { MarketWithStats, PositionRow } from "@/lib/supabase/types";

export function TradeTicket({
  market,
  position,
  signedIn,
}: {
  market: MarketWithStats;
  position: PositionRow | null;
  signedIn: boolean;
}) {
  const disabled =
    !signedIn ||
    Boolean(market.resolved_outcome) ||
    isMarketClosed(market.close_at);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Trade</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Buy YES or NO with fake dollars.
          </p>
        </div>
        <CircleDollarSign className="size-5 text-zinc-400" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <TradeForm
          disabled={disabled}
          market={market}
          price={market.stats.yesPrice}
          side="yes"
        />
        <TradeForm
          disabled={disabled}
          market={market}
          price={market.stats.noPrice}
          side="no"
        />
      </div>

      {position ? (
        <div className="mt-5 rounded-md bg-zinc-50 p-3 text-sm text-zinc-700">
          Your position: YES ${(position.yes_cents / 100).toFixed(2)} / NO $
          {(position.no_cents / 100).toFixed(2)}
        </div>
      ) : null}

      {!signedIn ? (
        <p className="mt-4 text-sm text-zinc-500">Sign in to place trades.</p>
      ) : null}
    </section>
  );
}

function TradeForm({
  disabled,
  market,
  price,
  side,
}: {
  disabled: boolean;
  market: MarketWithStats;
  price: number;
  side: "yes" | "no";
}) {
  const tone =
    side === "yes"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : "border-rose-200 bg-rose-50 text-rose-950";

  return (
    <form action={placeTradeAction} className={`rounded-lg border p-4 ${tone}`}>
      <input name="marketId" type="hidden" value={market.id} />
      <input name="returnTo" type="hidden" value={`/markets/${market.id}`} />
      <input name="side" type="hidden" value={side} />
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold uppercase">{side}</div>
        <div className="text-sm font-medium">{formatProbability(price)}</div>
      </div>
      <label className="mt-4 grid gap-1 text-sm font-medium">
        Amount
        <input
          className="h-10 rounded-md border border-white/70 bg-white px-3 text-sm font-normal text-zinc-950 outline-none focus:border-zinc-950"
          inputMode="decimal"
          min="1"
          name="amount"
          placeholder="25.00"
          step="0.01"
          type="number"
        />
      </label>
      <Button className="mt-3 w-full" disabled={disabled} size="lg">
        Buy {side.toUpperCase()}
      </Button>
    </form>
  );
}
