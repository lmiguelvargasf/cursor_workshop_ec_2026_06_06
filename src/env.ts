import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SUPABASE_PROJECT_REF: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_PROJECT_REF: process.env.SUPABASE_PROJECT_REF,
  },
  emptyStringAsUndefined: true,
});
