"use server";

import { redirect } from "next/navigation";

import {
  type AuthActionState,
  parseAuthCredentials,
} from "@/lib/auth/validation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const configurationMessage =
  "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local.";

function validationErrorState(
  parsed: ReturnType<typeof parseAuthCredentials>,
): AuthActionState {
  if (parsed.success) {
    return { status: "idle" };
  }

  return {
    errors: parsed.error.flatten().fieldErrors,
    message: "Check the email and password fields.",
    status: "error",
  };
}

function providerErrorState(message: string): AuthActionState {
  return {
    message,
    status: "error",
  };
}

export async function signIn(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = parseAuthCredentials(formData);

  if (!parsed.success) {
    return validationErrorState(parsed);
  }

  if (!isSupabaseConfigured) {
    return providerErrorState(configurationMessage);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return providerErrorState(error.message);
  }

  redirect("/");
}

export async function signUp(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = parseAuthCredentials(formData);

  if (!parsed.success) {
    return validationErrorState(parsed);
  }

  if (!isSupabaseConfigured) {
    return providerErrorState(configurationMessage);
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    return providerErrorState(error.message);
  }

  if (!data.session) {
    return {
      message: "Check your email to finish creating your MarketLab account.",
      status: "success",
    };
  }

  redirect("/");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
