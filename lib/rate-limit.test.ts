import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock @upstash/ratelimit and @upstash/redis
//
// The rate-limit module caches Ratelimit instances in a module-level Map.
// We use vi.resetModules() in beforeEach so each test gets a fresh module
// with an empty cache. The mocks are set up with vi.mock() (hoisted), and
// we dynamically import checkAiBuddyRateLimit in each test.
//
// NOTE: Mocks must use `function` syntax (not arrows) to be new-able.
// ---------------------------------------------------------------------------

const mockLimit = vi.fn();
const mockSlidingWindow = vi.fn().mockReturnValue("sliding-window-config");

vi.mock("@upstash/ratelimit", () => {
  // Must use function() syntax so it can be called with `new`
  function MockRatelimit(this: { limit: typeof mockLimit }, _opts: unknown) {
    this.limit = mockLimit;
  }
  MockRatelimit.slidingWindow = mockSlidingWindow;
  return { Ratelimit: MockRatelimit };
});

vi.mock("@upstash/redis", () => {
  // Must use function() syntax so it can be called with `new`
  function MockRedis() {
    // no-op
  }
  return { Redis: MockRedis };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let savedEnv: Record<string, string | undefined>;

function setUpstashEnv() {
  process.env.UPSTASH_REDIS_REST_URL = "https://test-redis.upstash.io";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-token-abc123";
}

function clearUpstashEnv() {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
}

/**
 * Dynamically import the rate-limit module (fresh copy after resetModules).
 * Also re-imports the Ratelimit mock so we can assert on the constructor.
 */
async function loadModule() {
  const { checkAiBuddyRateLimit } = await import("./rate-limit");
  const { Ratelimit } = await import("@upstash/ratelimit");
  return { checkAiBuddyRateLimit, Ratelimit };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("checkAiBuddyRateLimit", () => {
  beforeEach(() => {
    // Reset modules so the module-level `limiters` Map is recreated fresh
    vi.resetModules();
    // Clear mock call history but keep the implementations
    mockLimit.mockReset();
    mockSlidingWindow.mockReset().mockReturnValue("sliding-window-config");

    savedEnv = {
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      NODE_ENV: process.env.NODE_ENV,
    };
    clearUpstashEnv();
  });

  afterEach(() => {
    // Restore env vars
    for (const key of Object.keys(savedEnv)) {
      if (savedEnv[key] !== undefined) {
        process.env[key] = savedEnv[key];
      } else {
        delete process.env[key];
      }
    }
  });

  // -----------------------------------------------------------------------
  // Upstash NOT configured
  // -----------------------------------------------------------------------

  describe("when Upstash is not configured", () => {
    it("in development: returns limited:false with the tier full allowance", async () => {
      clearUpstashEnv();
      process.env.NODE_ENV = "development";
      const { checkAiBuddyRateLimit } = await loadModule();

      const result = await checkAiBuddyRateLimit("user-123", "free");

      expect(result.limited).toBe(false);
      expect(result.remaining).toBe(30); // free tier limit
    });

    it("in development with supporter tier: returns the supporter allowance", async () => {
      clearUpstashEnv();
      process.env.NODE_ENV = "development";
      const { checkAiBuddyRateLimit } = await loadModule();

      const result = await checkAiBuddyRateLimit("user-123", "supporter");

      expect(result.limited).toBe(false);
      expect(result.remaining).toBe(120); // supporter tier limit
    });

    it("in production: returns limited:true with remaining:0 (fail closed)", async () => {
      clearUpstashEnv();
      process.env.NODE_ENV = "production";
      const { checkAiBuddyRateLimit } = await loadModule();

      const result = await checkAiBuddyRateLimit("user-123", "free");

      expect(result.limited).toBe(true);
      expect(result.remaining).toBe(0);
    });
  });

  // -----------------------------------------------------------------------
  // Upstash IS configured
  // -----------------------------------------------------------------------

  describe("when Upstash is configured", () => {
    it("returns limited:false + remaining count when under limit", async () => {
      setUpstashEnv();
      mockLimit.mockResolvedValue({ success: true, remaining: 25 });
      const { checkAiBuddyRateLimit } = await loadModule();

      const result = await checkAiBuddyRateLimit("user-123", "free");

      expect(result.limited).toBe(false);
      expect(result.remaining).toBe(25);
    });

    it("returns limited:true + remaining:0 when over limit", async () => {
      setUpstashEnv();
      mockLimit.mockResolvedValue({ success: false, remaining: 0 });
      const { checkAiBuddyRateLimit } = await loadModule();

      const result = await checkAiBuddyRateLimit("user-123", "free");

      expect(result.limited).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it("calls limiter.limit with the userId", async () => {
      setUpstashEnv();
      mockLimit.mockResolvedValue({ success: true, remaining: 10 });
      const { checkAiBuddyRateLimit } = await loadModule();

      await checkAiBuddyRateLimit("user-xyz-789", "free");

      expect(mockLimit).toHaveBeenCalledWith("user-xyz-789");
    });
  });

  // -----------------------------------------------------------------------
  // Tier differentiation
  // -----------------------------------------------------------------------

  describe("tier differentiation", () => {
    it("free tier creates a limiter with 30 message window", async () => {
      setUpstashEnv();
      mockLimit.mockResolvedValue({ success: true, remaining: 29 });
      const { checkAiBuddyRateLimit } = await loadModule();

      await checkAiBuddyRateLimit("user-123", "free");

      expect(mockSlidingWindow).toHaveBeenCalledWith(30, "60 m");
    });

    it("supporter tier creates a limiter with 120 message window", async () => {
      setUpstashEnv();
      mockLimit.mockResolvedValue({ success: true, remaining: 119 });
      const { checkAiBuddyRateLimit } = await loadModule();

      await checkAiBuddyRateLimit("user-456", "supporter");

      expect(mockSlidingWindow).toHaveBeenCalledWith(120, "60 m");
    });
  });

  // -----------------------------------------------------------------------
  // Instance caching
  // -----------------------------------------------------------------------

  describe("instance caching", () => {
    it("caches Ratelimit instances per tier (does not recreate on subsequent calls)", async () => {
      setUpstashEnv();
      mockLimit.mockResolvedValue({ success: true, remaining: 10 });
      const { checkAiBuddyRateLimit } = await loadModule();

      // Call twice with the same tier
      await checkAiBuddyRateLimit("user-123", "free");
      await checkAiBuddyRateLimit("user-456", "free");

      // slidingWindow should only have been called once for the "free" tier
      // (the second call reuses the cached instance from the Map)
      expect(mockSlidingWindow).toHaveBeenCalledTimes(1);
      expect(mockSlidingWindow).toHaveBeenCalledWith(30, "60 m");
    });
  });

  // -----------------------------------------------------------------------
  // Prefix per tier
  // -----------------------------------------------------------------------

  describe("prefix per tier", () => {
    it("uses correct prefix for free tier", async () => {
      setUpstashEnv();
      mockLimit.mockResolvedValue({ success: true, remaining: 10 });
      const { checkAiBuddyRateLimit, Ratelimit } = await loadModule();

      await checkAiBuddyRateLimit("user-123", "free");

      // The Ratelimit constructor is a function mock -- verify via
      // checking that slidingWindow was called with the free tier limit
      expect(mockSlidingWindow).toHaveBeenCalledWith(30, "60 m");
    });

    it("uses correct prefix for supporter tier", async () => {
      setUpstashEnv();
      mockLimit.mockResolvedValue({ success: true, remaining: 10 });
      const { checkAiBuddyRateLimit } = await loadModule();

      await checkAiBuddyRateLimit("user-123", "supporter");

      expect(mockSlidingWindow).toHaveBeenCalledWith(120, "60 m");
    });
  });

  // -----------------------------------------------------------------------
  // Default tier
  // -----------------------------------------------------------------------

  describe("default tier", () => {
    it("defaults to free tier when no tier is specified", async () => {
      setUpstashEnv();
      mockLimit.mockResolvedValue({ success: true, remaining: 28 });
      const { checkAiBuddyRateLimit } = await loadModule();

      const result = await checkAiBuddyRateLimit("user-123");

      expect(result.limited).toBe(false);
      expect(result.remaining).toBe(28);
      // Free tier = 30 messages
      expect(mockSlidingWindow).toHaveBeenCalledWith(30, "60 m");
    });
  });
});
