import Image from "next/image";
import Link from "next/link";

import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-white/10 bg-[#080a0d] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="block">
            <Image
              src="/logo/logo-marketlab.webp"
              alt="MarketLab"
              width={677}
              height={369}
              className="h-16 w-auto object-contain sm:h-20 lg:h-24"
              style={{ width: "auto" }}
              priority
            />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div className="flex items-center gap-2 rounded-full border border-[#00d395]/30 bg-[#00d395]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_0_15px_rgba(0,211,149,0.15)] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d395] animate-pulse" />
            Cursor Workshop / Quito
          </div>

          {user ? (
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 pl-3 text-sm text-zinc-200">
              <span className="max-w-44 truncate">{user.email}</span>
              <form action={signOut}>
                <Button
                  className="rounded-full border-white/10 bg-white/10 text-white hover:bg-white/15"
                  size="sm"
                  type="submit"
                  variant="outline"
                >
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <Button
              asChild
              className="rounded-full border-white/10 bg-white/10 text-white hover:bg-white/15"
              size="sm"
              variant="outline"
            >
              <Link href="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
