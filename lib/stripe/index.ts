import Stripe from "stripe";

/**
 * Create a Stripe client for server-side use.
 *
 * This mirrors the `createAdminSupabaseClient()` pattern in
 * `lib/supabase/admin.ts`. NEVER expose this on the client.
 */
export function createStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing environment variable: STRIPE_SECRET_KEY");
  }

  return new Stripe(secretKey, {
    typescript: true,
  });
}
