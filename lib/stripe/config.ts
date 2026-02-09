// ---------------------------------------------------------------------------
// Stripe billing configuration for TinkerSchool Supporter subscriptions
// ---------------------------------------------------------------------------

export type SubscriptionTier = "free" | "supporter";

export type BillingInterval = "monthly" | "yearly";

/**
 * Price IDs from Stripe, configured via environment variables.
 * These are set in `.env.local` (dev) and Vercel env vars (prod).
 */
export function getPriceId(interval: BillingInterval): string {
  const envKey =
    interval === "monthly"
      ? "STRIPE_PRICE_SUPPORTER_MONTHLY"
      : "STRIPE_PRICE_SUPPORTER_YEARLY";

  const priceId = process.env[envKey];

  if (!priceId) {
    throw new Error(`Missing environment variable: ${envKey}`);
  }

  return priceId;
}

/**
 * Determine the billing interval from a Stripe price ID.
 * Returns undefined if the price ID doesn't match either known price.
 */
export function getBillingInterval(priceId: string): BillingInterval | undefined {
  if (priceId === process.env.STRIPE_PRICE_SUPPORTER_MONTHLY) return "monthly";
  if (priceId === process.env.STRIPE_PRICE_SUPPORTER_YEARLY) return "yearly";
  return undefined;
}
