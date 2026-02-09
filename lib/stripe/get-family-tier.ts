import type { SupabaseClient } from "@supabase/supabase-js";

import type { SubscriptionTier } from "@/lib/stripe/config";

/**
 * Look up a family's subscription tier from Supabase.
 * Returns "free" if the family is not found or has no active subscription.
 */
export async function getFamilyTier(
  supabase: SupabaseClient,
  familyId: string,
): Promise<SubscriptionTier> {
  const { data } = (await supabase
    .from("families")
    .select("subscription_tier")
    .eq("id", familyId)
    .single()) as { data: { subscription_tier: string } | null };

  if (data?.subscription_tier === "supporter") {
    return "supporter";
  }

  return "free";
}
