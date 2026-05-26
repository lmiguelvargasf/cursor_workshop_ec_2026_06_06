import { env } from "@/env";

export const isSupabaseConfigured = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export function getSupabaseConfig() {
  if (!isSupabaseConfigured) {
    return null;
  }

  return {
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    url: env.NEXT_PUBLIC_SUPABASE_URL as string,
  };
}
