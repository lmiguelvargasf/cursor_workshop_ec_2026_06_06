import type { MarketSide, MarketStats, TradeRow } from "@/lib/supabase/types";

export const STARTING_BALANCE_CENTS = 10000;
export const MIN_TRADE_CENTS = 100;
export const MAX_TRADE_CENTS = 50000;

export function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(cents / 100);
}

export function formatProbability(price: number) {
  return `${Math.round(price)}%`;
}

export function calculateMarketStats(
  trades: Pick<TradeRow, "side" | "amount_cents">[],
): MarketStats {
  const yesPoolCents = trades
    .filter((trade) => trade.side === "yes")
    .reduce((sum, trade) => sum + trade.amount_cents, 0);
  const noPoolCents = trades
    .filter((trade) => trade.side === "no")
    .reduce((sum, trade) => sum + trade.amount_cents, 0);
  const volumeCents = yesPoolCents + noPoolCents;

  if (volumeCents === 0) {
    return {
      noPoolCents,
      noPrice: 50,
      volumeCents,
      yesPoolCents,
      yesPrice: 50,
    };
  }

  const yesPrice = clampProbability(
    Math.round((yesPoolCents / volumeCents) * 100),
  );

  return {
    noPoolCents,
    noPrice: 100 - yesPrice,
    volumeCents,
    yesPoolCents,
    yesPrice,
  };
}

export function parseDollarAmountToCents(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  return Math.round(Number(normalized) * 100);
}

export function validateTradeAmount(cents: number | null) {
  if (cents === null || Number.isNaN(cents)) {
    return "Enter a valid dollar amount.";
  }

  if (cents < MIN_TRADE_CENTS) {
    return "Minimum trade is $1.00.";
  }

  if (cents > MAX_TRADE_CENTS) {
    return "Maximum trade is $500.00.";
  }

  return null;
}

export function calculateSettlementPayout({
  noPoolCents,
  side,
  stakeCents,
  yesPoolCents,
}: {
  noPoolCents: number;
  side: MarketSide;
  stakeCents: number;
  yesPoolCents: number;
}) {
  const winningPool = side === "yes" ? yesPoolCents : noPoolCents;
  const losingPool = side === "yes" ? noPoolCents : yesPoolCents;

  if (stakeCents <= 0 || winningPool <= 0) {
    return 0;
  }

  return stakeCents + Math.floor((stakeCents / winningPool) * losingPool);
}

export function isMarketClosed(closeAt: string) {
  return new Date(closeAt).getTime() <= Date.now();
}

function clampProbability(value: number) {
  return Math.max(1, Math.min(99, value));
}
