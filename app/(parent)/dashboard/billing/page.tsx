import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckCircle2, Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getBillingInterval, type SubscriptionTier } from "@/lib/stripe/config";

import { BillingActions } from "./billing-actions";

interface FamilyBilling {
  subscription_tier: string;
  stripe_subscription_status: string | null;
  stripe_price_id: string | null;
  stripe_current_period_end: string | null;
}

export default async function BillingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = await createServerSupabaseClient();

  // Get profile + family billing data
  const { data: profile } = (await supabase
    .from("profiles")
    .select("role, family_id")
    .eq("clerk_id", userId)
    .single()) as { data: { role: string; family_id: string } | null };

  if (!profile || profile.role !== "parent") {
    redirect("/home");
  }

  const { data: family } = (await supabase
    .from("families")
    .select(
      "subscription_tier, stripe_subscription_status, stripe_price_id, stripe_current_period_end",
    )
    .eq("id", profile.family_id)
    .single()) as { data: FamilyBilling | null };

  const tier: SubscriptionTier =
    family?.subscription_tier === "supporter" ? "supporter" : "free";
  const isSupporter = tier === "supporter";
  const interval = family?.stripe_price_id
    ? getBillingInterval(family.stripe_price_id)
    : undefined;
  const periodEnd = family?.stripe_current_period_end
    ? new Date(family.stripe_current_period_end)
    : null;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Heart className="size-6 text-pink-500" />
          <h1 className="text-2xl font-bold tracking-tight">
            Support TinkerSchool
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          TinkerSchool is free and open source. Supporters help keep it running.
        </p>
      </div>

      {/* Current plan status */}
      {isSupporter && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/30">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              You&apos;re a Supporter!
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              {interval === "yearly" ? "Yearly" : "Monthly"} plan
              {periodEnd &&
                ` \u00B7 Renews ${periodEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
            </p>
          </div>
          <Badge className="bg-emerald-600 text-white">Active</Badge>
        </div>
      )}

      {/* Billing actions (client component handles checkout/portal) */}
      <BillingActions tier={tier} />
    </div>
  );
}
