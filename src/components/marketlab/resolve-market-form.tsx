import { CheckCircle2 } from "lucide-react";

import { claimSettlementAction, resolveMarketAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/lib/marketlab";
import type { MarketWithStats, SettlementRow } from "@/lib/supabase/types";

export function ResolveMarketForm({
  canResolve,
  market,
  settlement,
}: {
  canResolve: boolean;
  market: MarketWithStats;
  settlement: SettlementRow | null;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 size-5 text-zinc-400" />
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Resolution</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            Creator-only resolution creates claimable fake-money settlements.
          </p>
        </div>
      </div>

      {market.resolved_outcome ? (
        <div className="rounded-md bg-zinc-50 p-3 text-sm">
          Resolved{" "}
          <span className="font-semibold uppercase">
            {market.resolved_outcome}
          </span>
          {market.resolved_at ? ` on ${formatDate(market.resolved_at)}` : null}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <ResolutionButton
            canResolve={canResolve}
            market={market}
            outcome="yes"
          />
          <ResolutionButton
            canResolve={canResolve}
            market={market}
            outcome="no"
          />
        </div>
      )}

      {settlement ? (
        <form
          action={claimSettlementAction}
          className="mt-4 rounded-md bg-emerald-50 p-3"
        >
          <input
            name="returnTo"
            type="hidden"
            value={`/markets/${market.id}`}
          />
          <input name="settlementId" type="hidden" value={settlement.id} />
          <div className="mb-3 text-sm text-emerald-950">
            Claimable payout:{" "}
            <span className="font-semibold">
              {formatCents(settlement.payout_cents)}
            </span>
          </div>
          <Button disabled={Boolean(settlement.claimed_at)} size="lg">
            {settlement.claimed_at ? "Already claimed" : "Claim winnings"}
          </Button>
        </form>
      ) : null}

      {!canResolve && !market.resolved_outcome ? (
        <p className="mt-4 text-sm text-zinc-500">
          Only the creator can resolve this market.
        </p>
      ) : null}
    </section>
  );
}

function ResolutionButton({
  canResolve,
  market,
  outcome,
}: {
  canResolve: boolean;
  market: MarketWithStats;
  outcome: "yes" | "no";
}) {
  return (
    <form action={resolveMarketAction}>
      <input name="marketId" type="hidden" value={market.id} />
      <input name="outcome" type="hidden" value={outcome} />
      <input name="returnTo" type="hidden" value={`/markets/${market.id}`} />
      <Button
        className="w-full"
        disabled={!canResolve}
        size="lg"
        variant={outcome === "yes" ? "default" : "outline"}
      >
        Resolve {outcome.toUpperCase()}
      </Button>
    </form>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
