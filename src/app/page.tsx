import { AuthPanel } from "@/components/marketlab/auth-panel";
import { ConfigCallout } from "@/components/marketlab/config-callout";
import { CreateMarketForm } from "@/components/marketlab/create-market-form";
import { Header } from "@/components/marketlab/header";
import { MarketCard } from "@/components/marketlab/market-card";
import { Notice } from "@/components/marketlab/notice";
import { PortfolioSummary } from "@/components/marketlab/portfolio-summary";
import { getHomeData } from "@/lib/data";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const [{ notice }, data] = await Promise.all([searchParams, getHomeData()]);
  const signedIn = Boolean(data.viewer);

  return (
    <div className="min-h-svh bg-zinc-50 text-zinc-950">
      <Header configured={data.configured} viewer={data.viewer} />
      <Notice message={notice} />
      <ConfigCallout configured={data.configured} />

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_22rem]">
        <section className="min-w-0">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
                Live markets
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                Trade the workshop outcome.
              </h1>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-600">
              A compact prediction market that demonstrates Supabase Auth,
              Database, Storage, RLS, Server Actions, and Cursor workflows.
            </p>
          </div>

          <div className="grid gap-4">
            {data.markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </section>

        <aside className="grid content-start gap-4">
          <PortfolioSummary viewer={data.viewer} />
          <CreateMarketForm enabled={data.configured && signedIn} />
        </aside>
      </main>

      {!signedIn ? <AuthPanel configured={data.configured} /> : null}
    </div>
  );
}
