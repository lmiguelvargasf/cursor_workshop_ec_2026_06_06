import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getDisplayProfile, type Viewer } from "@/lib/data";
import { formatCents } from "@/lib/marketlab";

export function PortfolioSummary({ viewer }: { viewer: Viewer | null }) {
  const profile = getDisplayProfile(viewer);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Portfolio</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            Balances and positions are owner-scoped through Supabase RLS.
          </p>
        </div>
        <BriefcaseBusiness className="size-5 text-zinc-400" />
      </div>

      {profile ? (
        <>
          <div className="text-sm text-zinc-500">Available balance</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight">
            {formatCents(profile.balanceCents)}
          </div>
          <Button asChild className="mt-5 w-full" size="lg" variant="outline">
            <Link href="/portfolio">View portfolio</Link>
          </Button>
        </>
      ) : (
        <div className="rounded-md bg-zinc-50 p-3 text-sm text-zinc-600">
          Sign in to see positions, trade history, and claimable winnings.
        </div>
      )}
    </section>
  );
}
