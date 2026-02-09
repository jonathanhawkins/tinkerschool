import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    // 30 messages per 60-minute sliding window
    limiter: Ratelimit.slidingWindow(30, "60 m"),
    prefix: "tinkerschool:ai-buddy",
    analytics: true,
  });

  return ratelimit;
}

/**
 * Check if a user has exceeded the AI buddy rate limit.
 *
 * @param userId - The Clerk user ID to rate limit
 * @returns { limited, remaining } - whether the request is blocked and how many remain
 */
export async function checkAiBuddyRateLimit(
  userId: string,
): Promise<RateLimitResult> {
  const limiter = getRatelimit();

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
    return { limited: false, remaining: 30 };
  }

  const { success, remaining } = await limiter.limit(userId);
  return { limited: !success, remaining };
}
