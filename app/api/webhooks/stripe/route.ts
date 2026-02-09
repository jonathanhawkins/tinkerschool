import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { createStripeClient } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// POST /api/webhooks/stripe
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[stripe-webhook] Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  // 1. Verify the Stripe signature
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    const stripe = createStripeClient();
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error(
      "[stripe-webhook] Signature verification failed:",
      err instanceof Error ? err.message : "unknown error",
    );
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 },
    );
  }

  // 2. Handle events
  const supabase = createAdminSupabaseClient();

  try {
    switch (event.type) {
      // -- Checkout completed: activate supporter tier --
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const familyId = session.metadata?.family_id;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!familyId || !customerId) {
          console.error(
            "[stripe-webhook] checkout.session.completed missing family_id or customer",
          );
          break;
        }

        // Fetch the subscription to get price and period info
        if (subscriptionId) {
          const stripe = createStripeClient();
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);
          const firstItem = subscription.items.data[0];
          const priceId = firstItem?.price?.id ?? null;
          const periodEnd = firstItem?.current_period_end
            ? new Date(firstItem.current_period_end * 1000).toISOString()
            : null;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from("families") as any)
            .update({
              stripe_customer_id: customerId,
              subscription_tier: "supporter",
              stripe_subscription_id: subscriptionId,
              stripe_subscription_status: subscription.status,
              stripe_price_id: priceId,
              stripe_current_period_end: periodEnd,
            })
            .eq("id", familyId);
        }

        console.log(
          `[stripe-webhook] checkout.session.completed: family=${familyId} subscription=${subscriptionId}`,
        );
        break;
      }

      // -- Subscription updated: sync status --
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (!customerId) break;

        const firstItem = subscription.items.data[0];
        const priceId = firstItem?.price?.id ?? null;
        const periodEnd = firstItem?.current_period_end
          ? new Date(firstItem.current_period_end * 1000).toISOString()
          : null;

        // Determine tier based on subscription status
        const activeTier =
          subscription.status === "active" ||
          subscription.status === "trialing"
            ? "supporter"
            : "free";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("families") as any)
          .update({
            subscription_tier: activeTier,
            stripe_subscription_status: subscription.status,
            stripe_price_id: priceId,
            stripe_current_period_end: periodEnd,
          })
          .eq("stripe_customer_id", customerId);

        console.log(
          `[stripe-webhook] customer.subscription.updated: customer=${customerId} status=${subscription.status} tier=${activeTier}`,
        );
        break;
      }

      // -- Subscription deleted: revert to free --
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (!customerId) break;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("families") as any)
          .update({
            subscription_tier: "free",
            stripe_subscription_id: null,
            stripe_subscription_status: "canceled",
            stripe_price_id: null,
            stripe_current_period_end: null,
          })
          .eq("stripe_customer_id", customerId);

        console.log(
          `[stripe-webhook] customer.subscription.deleted: customer=${customerId} -> free tier`,
        );
        break;
      }

      default:
        console.log(
          `[stripe-webhook] Unhandled event type: ${event.type}`,
        );
    }
  } catch (err) {
    console.error(
      `[stripe-webhook] Error handling ${event.type}:`,
      err instanceof Error ? err.message : "unknown error",
    );
    return NextResponse.json(
      { error: "Internal error processing webhook" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
