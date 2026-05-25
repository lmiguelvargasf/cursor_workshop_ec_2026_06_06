import { Database } from "lucide-react";

export function ConfigCallout({ configured }: { configured: boolean }) {
  if (configured) {
    return null;
  }

  return (
    <section className="border-b border-amber-200 bg-amber-50 px-4 py-4">
      <div className="mx-auto flex max-w-6xl gap-3 text-sm text-amber-950">
        <Database className="mt-0.5 size-4 shrink-0" />
        <div>
          <strong>Demo mode:</strong> MarketLab is rendering seeded example
          data. Add `NEXT_PUBLIC_SUPABASE_URL` and
          `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then apply the Supabase migration to
          enable auth, trading, storage, and portfolio data.
        </div>
      </div>
    </section>
  );
}
