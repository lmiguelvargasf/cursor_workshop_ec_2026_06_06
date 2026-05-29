import { redirect } from "next/navigation";

import { AuthForm } from "@/components/marketlab/auth-form";
import { Header } from "@/components/marketlab/header";
import { getCurrentUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AuthPageProps = {
  searchParams: Promise<{
    mode?: string | string[];
  }>;
};

function resolveMode(value: string | string[] | undefined) {
  return value === "signup" ? "signup" : "signin";
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  const params = await searchParams;
  const mode = resolveMode(params.mode);

  return (
    <div className="min-h-svh bg-[#080a0d] text-white">
      <Header />

      <main className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#080a0d_0%,#10151d_56%,#08120f_100%)]" />
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 mix-blend-screen"
          style={{ backgroundImage: "url('/hero2-bg.webp')" }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00d395]/60 to-transparent" />

        <section className="relative mx-auto flex min-h-[calc(100svh-6.5rem)] max-w-6xl items-center justify-center px-4 py-12">
          <AuthForm
            isConfigured={isSupabaseConfigured}
            key={mode}
            mode={mode}
          />
        </section>
      </main>
    </div>
  );
}
