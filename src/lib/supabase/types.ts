export type MarketSide = "yes" | "no";

export type ResolvedOutcome = MarketSide | null;

export type ProfileRow = {
  id: string;
  email: string | null;
  username: string;
  balance_cents: number;
  created_at: string;
  updated_at: string;
};

export type MarketRow = {
  id: string;
  creator_id: string | null;
  title: string;
  description: string;
  category: string;
  image_path: string | null;
  close_at: string;
  resolved_outcome: ResolvedOutcome;
  resolved_at: string | null;
  created_at: string;
};

export type TradeRow = {
  id: string;
  market_id: string;
  user_id: string;
  side: MarketSide;
  amount_cents: number;
  price_cents: number;
  created_at: string;
};

export type PositionRow = {
  market_id: string;
  user_id: string;
  yes_cents: number;
  no_cents: number;
  updated_at: string;
};

export type SettlementRow = {
  id: string;
  market_id: string;
  user_id: string;
  winning_side: MarketSide;
  payout_cents: number;
  claimed_at: string | null;
  created_at: string;
};

export type MarketStats = {
  yesPoolCents: number;
  noPoolCents: number;
  volumeCents: number;
  yesPrice: number;
  noPrice: number;
};

export type MarketWithStats = MarketRow & {
  imageUrl: string | null;
  stats: MarketStats;
};

export type PositionWithMarket = PositionRow & {
  market: MarketWithStats;
};

export type SettlementWithMarket = SettlementRow & {
  market: MarketWithStats;
};
