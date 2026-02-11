import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import type { SubscriptionTier } from "@/lib/stripe/config";

/**
 * Distributed rate limiter using Upstash Redis.
 *
 * Works correctly across multiple Vercel serverless instances, unlike
 * an in-memory Map which resets per-instance.
 *
 * Configuration:
 *   Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your
 *   environment variables. Get these from https://console.upstash.com
 *
 * If the env vars are not set, falls back to a no-op that always allows
 * requests (with a console warning). This ensures local dev works without
 * Redis, while production enforces limits.
 */

interface RateLimitResult {
  limited: boolean;
  remaining: number;
}

/** Messages per 60-minute window by subscription tier. */
const TIER_LIMITS: Record<SubscriptionTier, number> = {
  free: 30,
  supporter: 120,
};

/**
 * Cache rate limiters by tier so we don't recreate them on every request.
 * Each tier needs its own Ratelimit instance because the sliding window
 * size is baked into the instance.
 */
const limiters = new Map<SubscriptionTier, Ratelimit>();

function getRatelimit(tier: SubscriptionTier): Ratelimit | null {
  const cached = limiters.get(tier);
  if (cached) return cached;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(TIER_LIMITS[tier], "60 m"),
    prefix: `tinkerschool:ai-buddy:${tier}`,
    analytics: true,
  });

  limiters.set(tier, limiter);
  return limiter;
}

/**
 * Check if a user has exceeded the AI buddy rate limit.
 *
 * @param userId - The Clerk user ID to rate limit
 * @param tier - The family's subscription tier (affects message allowance)
 * @returns { limited, remaining } - whether the request is blocked and how many remain
 */
export async function checkAiBuddyRateLimit(
  userId: string,
  tier: SubscriptionTier = "free",
): Promise<RateLimitResult> {
  const limiter = getRatelimit(tier);

  if (!limiter) {
    if (process.env.NODE_ENV === "production") {
      // Fail closed in production: block requests when rate limiting is unavailable
      console.error(
        "[rate-limit] BLOCKING REQUEST: Upstash Redis not configured in production. " +
          "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
      );
      return { limited: true, remaining: 0 };
    }
    // Allow all requests in dev/test with a warning
    console.warn(
      "[rate-limit] Upstash Redis not configured. Rate limiting disabled. " +
        "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for production.",
    );
    return { limited: false, remaining: TIER_LIMITS[tier] };
  }

  const { success, remaining } = await limiter.limit(userId);
  return { limited: !success, remaining };
}
