import { demoMarkets } from "@/lib/demo-data";
import { calculateMarketStats, STARTING_BALANCE_CENTS } from "@/lib/marketlab";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  MarketRow,
  MarketWithStats,
  PositionRow,
  PositionWithMarket,
  ProfileRow,
  SettlementRow,
  SettlementWithMarket,
  TradeRow,
} from "@/lib/supabase/types";

export type Viewer = {
  email: string | null;
  id: string;
  profile: ProfileRow | null;
};

export type HomeData = {
  configured: boolean;
  markets: MarketWithStats[];
  viewer: Viewer | null;
};

export type MarketDetailData = HomeData & {
  market: MarketWithStats | null;
  position: PositionRow | null;
  recentTrades: TradeRow[];
  settlement: SettlementRow | null;
};

export type PortfolioData = HomeData & {
  positions: PositionWithMarket[];
  settlements: SettlementWithMarket[];
  trades: (TradeRow & { market: MarketWithStats | null })[];
};

export async function getHomeData(): Promise<HomeData> {
  if (!isSupabaseConfigured) {
    return {
      configured: false,
      markets: demoMarkets,
      viewer: null,
    };
  }

  const supabase = await createServerSupabaseClient();
  const viewer = await getViewer();

  const { data: markets } = await supabase
    .from("markets")
    .select("*")
    .order("created_at", { ascending: false });

  const typedMarkets = (markets ?? []) as MarketRow[];
  const marketIds = typedMarkets.map((market) => market.id);

  const { data: trades } = marketIds.length
    ? await supabase.from("trades").select("*").in("market_id", marketIds)
    : { data: [] };

  return {
    configured: true,
    markets: decorateMarkets(typedMarkets, (trades ?? []) as TradeRow[]),
    viewer,
  };
}

export async function getMarketDetail(
  marketId: string,
): Promise<MarketDetailData> {
  const homeData = await getHomeData();

  if (!homeData.configured) {
    const market =
      homeData.markets.find((candidate) => candidate.id === marketId) ??
      homeData.markets[0] ??
      null;

    return {
      ...homeData,
      market,
      position: null,
      recentTrades: [],
      settlement: null,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data: market } = await supabase
    .from("markets")
    .select("*")
    .eq("id", marketId)
    .maybeSingle();

  if (!market) {
    return {
      ...homeData,
      market: null,
      position: null,
      recentTrades: [],
      settlement: null,
    };
  }

  const { data: trades } = await supabase
    .from("trades")
    .select("*")
    .eq("market_id", marketId)
    .order("created_at", { ascending: false });

  const decoratedMarket = decorateMarket(
    market as MarketRow,
    (trades ?? []) as TradeRow[],
  );

  let position: PositionRow | null = null;
  let settlement: SettlementRow | null = null;

  if (homeData.viewer) {
    const { data: positionData } = await supabase
      .from("positions")
      .select("*")
      .eq("market_id", marketId)
      .eq("user_id", homeData.viewer.id)
      .maybeSingle();

    const { data: settlementData } = await supabase
      .from("settlements")
      .select("*")
      .eq("market_id", marketId)
      .eq("user_id", homeData.viewer.id)
      .maybeSingle();

    position = (positionData as PositionRow | null) ?? null;
    settlement = (settlementData as SettlementRow | null) ?? null;
  }

  return {
    ...homeData,
    market: decoratedMarket,
    position,
    recentTrades: ((trades ?? []) as TradeRow[]).slice(0, 8),
    settlement,
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const homeData = await getHomeData();

  if (!homeData.configured || !homeData.viewer) {
    return {
      ...homeData,
      positions: [],
      settlements: [],
      trades: [],
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data: positions } = await supabase
    .from("positions")
    .select("*")
    .eq("user_id", homeData.viewer.id)
    .order("updated_at", { ascending: false });

  const { data: settlements } = await supabase
    .from("settlements")
    .select("*")
    .eq("user_id", homeData.viewer.id)
    .order("created_at", { ascending: false });

  const { data: trades } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", homeData.viewer.id)
    .order("created_at", { ascending: false })
    .limit(25);

  const marketsById = new Map(
    homeData.markets.map((market) => [market.id, market]),
  );

  return {
    ...homeData,
    positions: ((positions ?? []) as PositionRow[])
      .map((position) => {
        const market = marketsById.get(position.market_id);
        return market ? { ...position, market } : null;
      })
      .filter((position): position is PositionWithMarket => Boolean(position)),
    settlements: ((settlements ?? []) as SettlementRow[])
      .map((settlement) => {
        const market = marketsById.get(settlement.market_id);
        return market ? { ...settlement, market } : null;
      })
      .filter((settlement): settlement is SettlementWithMarket =>
        Boolean(settlement),
      ),
    trades: ((trades ?? []) as TradeRow[]).map((trade) => ({
      ...trade,
      market: marketsById.get(trade.market_id) ?? null,
    })),
  };
}

export async function getViewer(): Promise<Viewer | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    email: user.email ?? null,
    id: user.id,
    profile: (profile as ProfileRow | null) ?? null,
  };
}

export function getMarketImageUrl(imagePath: string | null) {
  if (!imagePath || !isSupabaseConfigured) {
    return null;
  }

  const config = {
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  };

  if (!config.url) {
    return null;
  }

  return `${config.url}/storage/v1/object/public/market-images/${imagePath}`;
}

export function decorateMarket(
  market: MarketRow,
  trades: TradeRow[],
): MarketWithStats {
  return {
    ...market,
    imageUrl: getMarketImageUrl(market.image_path),
    stats: calculateMarketStats(
      trades.filter((trade) => trade.market_id === market.id),
    ),
  };
}

export function decorateMarkets(markets: MarketRow[], trades: TradeRow[]) {
  return markets.map((market) => decorateMarket(market, trades));
}

export function getDisplayProfile(viewer: Viewer | null) {
  if (!viewer) {
    return null;
  }

  return {
    balanceCents: viewer.profile?.balance_cents ?? STARTING_BALANCE_CENTS,
    email: viewer.email,
    username:
      viewer.profile?.username ?? viewer.email?.split("@")[0] ?? "Trader",
  };
}
