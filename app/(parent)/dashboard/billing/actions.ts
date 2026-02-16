"use server";

import { auth } from "@clerk/nextjs/server";

import { createStripeClient } from "@/lib/stripe";
import { getPriceId, type BillingInterval } from "@/lib/stripe/config";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Create a Stripe Checkout Session for the Supporter subscription
// ---------------------------------------------------------------------------

interface CheckoutResult {
  url?: string;
  error?: string;
}

export async function createCheckoutSession(
  interval: BillingInterval,
): Promise<CheckoutResult> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Not authenticated" };
  }

  // Verify the user is a parent
  const supabase = await createServerSupabaseClient();
  const { data: profile } = (await supabase
    .from("profiles")
    .select("role, family_id")
    .eq("clerk_id", userId)
    .single()) as { data: { role: string; family_id: string } | null };

  if (!profile || profile.role !== "parent") {
    return { error: "Only parents can manage billing" };
  }

  // Look up or create a Stripe customer for this family
  const adminSupabase = createAdminSupabaseClient();
  const { data: family } = (await adminSupabase
    .from("families")
    .select("id, stripe_customer_id, name")
    .eq("id", profile.family_id)
    .single()) as {
    data: { id: string; stripe_customer_id: string | null; name: string } | null;
  };

  if (!family) {
    return { error: "Family not found" };
  }

  const stripe = createStripeClient();
  let customerId = family.stripe_customer_id;

  if (!customerId) {
    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      name: family.name,
      metadata: { family_id: family.id },
    });
    customerId = customer.id;

    // Save the customer ID to the family record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminSupabase.from("families") as any)
      .update({ stripe_customer_id: customerId })
      .eq("id", family.id);
  }

  // Guard: reject if the family already has an active subscription
  const { data: existingFamily } = (await adminSupabase
    .from("families")
    .select("stripe_subscription_status")
    .eq("id", family.id)
    .single()) as { data: { stripe_subscription_status: string | null } | null };

  if (
    existingFamily?.stripe_subscription_status === "active" ||
    existingFamily?.stripe_subscription_status === "trialing"
  ) {
    return { error: "You already have an active subscription" };
  }

  // Create the Checkout Session with a stable idempotency key.
  // Using family_id + priceId ensures double-clicks reuse the same session
  // instead of creating duplicates.
  const priceId = getPriceId(interval);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3020";

  const session = await stripe.checkout.sessions.create(
    {
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/billing?success=true`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
      metadata: { family_id: family.id },
    },
    {
      idempotencyKey: `checkout_${family.id}_${priceId}_${Math.floor(Date.now() / 60000)}`,
    },
  );

  return { url: session.url ?? undefined };
}

// ---------------------------------------------------------------------------
// Create a Stripe Customer Portal session for managing subscriptions
// ---------------------------------------------------------------------------

interface PortalResult {
  url?: string;
  error?: string;
}

export async function createPortalSession(): Promise<PortalResult> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Not authenticated" };
  }

  // Verify the user is a parent
  const supabase = await createServerSupabaseClient();
  const { data: profile } = (await supabase
    .from("profiles")
    .select("role, family_id")
    .eq("clerk_id", userId)
    .single()) as { data: { role: string; family_id: string } | null };

  if (!profile || profile.role !== "parent") {
    return { error: "Only parents can manage billing" };
  }

  // Look up the Stripe customer ID
  const adminSupabase = createAdminSupabaseClient();
  const { data: family } = (await adminSupabase
    .from("families")
    .select("stripe_customer_id")
    .eq("id", profile.family_id)
    .single()) as { data: { stripe_customer_id: string | null } | null };

  if (!family?.stripe_customer_id) {
    return { error: "No billing account found" };
  }

  const stripe = createStripeClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3020";

  const session = await stripe.billingPortal.sessions.create({
    customer: family.stripe_customer_id,
    return_url: `${appUrl}/dashboard/billing`,
  });

  return { url: session.url };
}
