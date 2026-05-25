"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { parseDollarAmountToCents, validateTradeAmount } from "@/lib/marketlab";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { MarketSide } from "@/lib/supabase/types";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const createMarketSchema = z.object({
  category: z.string().trim().min(2).max(40),
  closeAt: z.string().min(1),
  description: z.string().trim().min(20).max(1000),
  title: z.string().trim().min(8).max(160),
});

export async function signUpAction(formData: FormData) {
  const returnTo = getReturnTo(formData);
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirectWithNotice(
      returnTo,
      "Enter a valid email and 6 character password.",
    );
  }

  const supabase = await requireSupabase(returnTo);
  const username = getString(formData.get("username")) || "MarketLab Trader";
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    options: {
      data: { username },
    },
    password: parsed.data.password,
  });

  if (error) {
    redirectWithNotice(returnTo, error.message);
  }

  revalidatePath("/");
  redirectWithNotice("/", "Account created. You have a starter fake balance.");
}

export async function signInAction(formData: FormData) {
  const returnTo = getReturnTo(formData);
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirectWithNotice(returnTo, "Enter a valid email and password.");
  }

  const supabase = await requireSupabase(returnTo);
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirectWithNotice(returnTo, error.message);
  }

  revalidatePath("/");
  redirectWithNotice("/", "Signed in.");
}

export async function signOutAction(formData: FormData) {
  const returnTo = getReturnTo(formData);
  const supabase = await requireSupabase(returnTo);

  await supabase.auth.signOut();
  revalidatePath("/");
  redirectWithNotice("/", "Signed out.");
}

export async function createMarketAction(formData: FormData) {
  const returnTo = getReturnTo(formData);
  const supabase = await requireSupabase(returnTo);
  const user = await requireUser(returnTo);
  const parsed = createMarketSchema.safeParse({
    category: formData.get("category"),
    closeAt: formData.get("closeAt"),
    description: formData.get("description"),
    title: formData.get("title"),
  });

  if (!parsed.success) {
    redirectWithNotice(
      returnTo,
      "Market needs a title, description, category, and close date.",
    );
  }

  const closeAt = new Date(parsed.data.closeAt);

  if (Number.isNaN(closeAt.getTime()) || closeAt <= new Date()) {
    redirectWithNotice(returnTo, "Choose a close date in the future.");
  }

  const imagePath = await uploadMarketImage(formData, user.id, returnTo);
  const { data, error } = await supabase
    .from("markets")
    .insert({
      category: parsed.data.category,
      close_at: closeAt.toISOString(),
      creator_id: user.id,
      description: parsed.data.description,
      image_path: imagePath,
      title: parsed.data.title,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirectWithNotice(returnTo, error?.message ?? "Could not create market.");
  }

  revalidatePath("/");
  redirectWithNotice(`/markets/${data.id}`, "Market created.");
}

export async function placeTradeAction(formData: FormData) {
  const returnTo = getReturnTo(formData);
  const supabase = await requireSupabase(returnTo);
  await requireUser(returnTo);

  const marketId = getString(formData.get("marketId"));
  const side = getMarketSide(formData.get("side"));
  const amountCents = parseDollarAmountToCents(formData.get("amount"));
  const amountError = validateTradeAmount(amountCents);

  if (!marketId || !side) {
    redirectWithNotice(returnTo, "Choose a market side before trading.");
  }

  if (amountError || amountCents === null) {
    redirectWithNotice(returnTo, amountError ?? "Enter a valid trade amount.");
  }

  const { error } = await supabase.rpc("execute_trade", {
    p_amount_cents: amountCents,
    p_market_id: marketId,
    p_side: side,
  });

  if (error) {
    redirectWithNotice(returnTo, error.message);
  }

  revalidatePath("/");
  revalidatePath(`/markets/${marketId}`);
  revalidatePath("/portfolio");
  redirectWithNotice(
    returnTo,
    `Bought ${side.toUpperCase()} for $${(amountCents / 100).toFixed(2)}.`,
  );
}

export async function resolveMarketAction(formData: FormData) {
  const returnTo = getReturnTo(formData);
  const supabase = await requireSupabase(returnTo);
  await requireUser(returnTo);

  const marketId = getString(formData.get("marketId"));
  const outcome = getMarketSide(formData.get("outcome"));

  if (!marketId || !outcome) {
    redirectWithNotice(returnTo, "Choose an outcome before resolving.");
  }

  const { error } = await supabase.rpc("resolve_market", {
    p_market_id: marketId,
    p_outcome: outcome,
  });

  if (error) {
    redirectWithNotice(returnTo, error.message);
  }

  revalidatePath("/");
  revalidatePath(`/markets/${marketId}`);
  revalidatePath("/portfolio");
  redirectWithNotice(returnTo, `Market resolved ${outcome.toUpperCase()}.`);
}

export async function claimSettlementAction(formData: FormData) {
  const returnTo = getReturnTo(formData);
  const supabase = await requireSupabase(returnTo);
  await requireUser(returnTo);

  const settlementId = getString(formData.get("settlementId"));

  if (!settlementId) {
    redirectWithNotice(returnTo, "Settlement not found.");
  }

  const { error } = await supabase.rpc("claim_settlement", {
    p_settlement_id: settlementId,
  });

  if (error) {
    redirectWithNotice(returnTo, error.message);
  }

  revalidatePath("/");
  revalidatePath("/portfolio");
  redirectWithNotice(returnTo, "Winnings claimed.");
}

async function uploadMarketImage(
  formData: FormData,
  userId: string,
  returnTo: string,
) {
  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0) {
    return null;
  }

  if (!["image/png", "image/jpeg", "image/webp"].includes(image.type)) {
    redirectWithNotice(returnTo, "Upload a PNG, JPEG, or WebP image.");
  }

  if (image.size > 5 * 1024 * 1024) {
    redirectWithNotice(returnTo, "Market images must be under 5 MB.");
  }

  const extension = image.name.split(".").pop()?.toLowerCase() ?? "png";
  const safeExtension = ["png", "jpg", "jpeg", "webp"].includes(extension)
    ? extension
    : "png";
  const imagePath = `${userId}/${crypto.randomUUID()}.${safeExtension}`;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.storage
    .from("market-images")
    .upload(imagePath, image, {
      cacheControl: "3600",
      contentType: image.type,
      upsert: false,
    });

  if (error) {
    redirectWithNotice(returnTo, error.message);
  }

  return imagePath;
}

async function requireUser(returnTo: string) {
  const supabase = await requireSupabase(returnTo);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirectWithNotice(returnTo, "Sign in before making changes.");
  }

  return user;
}

async function requireSupabase(returnTo: string) {
  if (!isSupabaseConfigured) {
    redirectWithNotice(
      returnTo,
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable live data.",
    );
  }

  return createServerSupabaseClient();
}

function getMarketSide(value: FormDataEntryValue | null): MarketSide | null {
  if (value === "yes" || value === "no") {
    return value;
  }

  return null;
}

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getReturnTo(formData: FormData) {
  const returnTo = getString(formData.get("returnTo"));

  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/";
  }

  return returnTo;
}

function redirectWithNotice(returnTo: string, notice: string): never {
  const url = new URL(returnTo, "http://marketlab.local");
  url.searchParams.set("notice", notice);
  redirect(`${url.pathname}${url.search}`);
}
