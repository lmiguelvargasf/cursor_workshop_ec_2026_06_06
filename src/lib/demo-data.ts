import { calculateMarketStats } from "@/lib/marketlab";
import type { MarketWithStats, TradeRow } from "@/lib/supabase/types";

const now = Date.now();

const demoTrades: TradeRow[] = [
  {
    amount_cents: 2400,
    created_at: new Date(now - 1000 * 60 * 42).toISOString(),
    id: "demo-trade-1",
    market_id: "demo-1",
    price_cents: 50,
    side: "yes",
    user_id: "demo-user",
  },
  {
    amount_cents: 1500,
    created_at: new Date(now - 1000 * 60 * 18).toISOString(),
    id: "demo-trade-2",
    market_id: "demo-1",
    price_cents: 62,
    side: "no",
    user_id: "demo-user",
  },
  {
    amount_cents: 4200,
    created_at: new Date(now - 1000 * 60 * 61).toISOString(),
    id: "demo-trade-3",
    market_id: "demo-2",
    price_cents: 50,
    side: "yes",
    user_id: "demo-user",
  },
];

export const demoMarkets: MarketWithStats[] = [
  {
    category: "Weather",
    close_at: new Date(now + 1000 * 60 * 60 * 24 * 12).toISOString(),
    created_at: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
    creator_id: null,
    description:
      "Resolves YES if a public weather source records measurable rainfall in Quito before midnight local time this Saturday.",
    id: "demo-1",
    imageUrl: null,
    image_path: null,
    resolved_at: null,
    resolved_outcome: null,
    stats: calculateMarketStats(
      demoTrades.filter((trade) => trade.market_id === "demo-1"),
    ),
    title: "Will Quito record measurable rain this Saturday?",
  },
  {
    category: "Workshop",
    close_at: new Date(now + 1000 * 60 * 60 * 24 * 2).toISOString(),
    created_at: new Date(now - 1000 * 60 * 60 * 9).toISOString(),
    creator_id: null,
    description:
      "Resolves YES if the instructor runs the planned lint, typecheck, unit test, and smoke test commands successfully during the workshop.",
    id: "demo-2",
    imageUrl: null,
    image_path: null,
    resolved_at: null,
    resolved_outcome: null,
    stats: calculateMarketStats(
      demoTrades.filter((trade) => trade.market_id === "demo-2"),
    ),
    title: "Will the demo app pass all checks before the workshop ends?",
  },
  {
    category: "Product",
    close_at: new Date(now + 1000 * 60 * 60 * 24 * 7).toISOString(),
    created_at: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
    creator_id: null,
    description:
      "Resolves YES if the final live demo includes an uploaded market image served from Supabase Storage.",
    id: "demo-3",
    imageUrl: null,
    image_path: null,
    resolved_at: null,
    resolved_outcome: null,
    stats: calculateMarketStats([]),
    title: "Will the next product demo include a storage upload?",
  },
];
