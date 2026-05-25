import Image from "next/image";

import type { MarketWithStats } from "@/lib/supabase/types";

const palette = [
  "from-emerald-500 via-cyan-500 to-zinc-950",
  "from-amber-400 via-rose-500 to-zinc-950",
  "from-sky-500 via-indigo-500 to-zinc-950",
  "from-lime-400 via-emerald-500 to-zinc-950",
];

export function MarketImage({
  market,
  priority = false,
}: {
  market: MarketWithStats;
  priority?: boolean;
}) {
  if (market.imageUrl) {
    return (
      <Image
        alt=""
        className="h-full w-full object-cover"
        height={420}
        priority={priority}
        src={market.imageUrl}
        unoptimized
        width={720}
      />
    );
  }

  const color = palette[market.id.charCodeAt(0) % palette.length];

  return (
    <div
      className={`flex h-full min-h-44 w-full items-end bg-gradient-to-br ${color} p-5`}
    >
      <div className="max-w-[12rem] text-lg font-semibold leading-tight text-white">
        {market.category}
      </div>
    </div>
  );
}
