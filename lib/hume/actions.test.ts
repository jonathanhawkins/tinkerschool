import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock "server-only" to prevent it from throwing in the test environment.
vi.mock("server-only", () => ({}));

// ---------------------------------------------------------------------------
// Chainable Supabase mock factory
// ---------------------------------------------------------------------------

function createChainableMock() {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};

  chain.single = vi.fn().mockResolvedValue({ data: null, error: null });
  chain.limit = vi.fn().mockReturnValue({ data: null, error: null });
  chain.order = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockResolvedValue({ data: null, error: null });
  chain.from = vi.fn().mockReturnValue(chain);
  chain.rpc = vi.fn().mockResolvedValue({ data: 0, error: null });

  return chain;
}

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

const mockProfile = {
  id: "kid-profile-001",
  clerk_id: "clerk-user-001",
  family_id: "family-001",
  display_name: "Cassidy",
  avatar_id: "robot-1",
  role: "kid" as const,
  grade_level: 1,
  current_band: 2,
  device_mode: "none" as const,
  pin_hash: null,
  current_streak: 3,
  longest_streak: 5,
  last_activity_date: null,
  xp: 250,
  level: 2,
  created_at: "2026-01-01T00:00:00Z",
};

const mockParentProfile = {
  ...mockProfile,
  id: "parent-profile-001",
  role: "parent" as const,
  display_name: "Parent",
};

let mockSupabase: ReturnType<typeof createChainableMock>;

vi.mock("@/lib/auth/require-auth", () => ({
  requireAuth: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: vi.fn(),
}));

vi.mock("@/lib/hume/access-token", () => ({
  getHumeAccessToken: vi.fn(),
}));

import { requireAuth } from "@/lib/auth/require-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getHumeAccessToken } from "@/lib/hume/access-token";
import {
  checkVoiceBudget,
  logVoiceSession,
  refreshHumeAccessToken,
  getChipVoiceInitialData,
} from "./actions";

const mockRequireAuth = vi.mocked(requireAuth);
const mockCreateAdmin = vi.mocked(createAdminSupabaseClient);
const mockGetHumeAccessToken = vi.mocked(getHumeAccessToken);

// ---------------------------------------------------------------------------
// Helper to configure the Supabase mock for checkVoiceBudget
// ---------------------------------------------------------------------------

function setupBudgetMocks(opts: {
  tier?: string | null;
  usedToday?: number;
  usedMonth?: number;
  role?: "kid" | "parent";
  kidId?: string;
}) {
  const profile = opts.role === "parent" ? { ...mockParentProfile } : { ...mockProfile };
  if (opts.kidId && opts.role !== "parent") {
    profile.id = opts.kidId;
  }

  mockRequireAuth.mockResolvedValue({
    userId: profile.clerk_id,
    profile,
    supabase: mockSupabase as never,
  });

  // Track call count for .from() to differentiate family vs kids queries
  let fromCallCount = 0;
  // Track call count for .eq() within each .from() chain to differentiate the chained .eq() calls
  let eqCallCount = 0;
  let currentLimitValue: { data: unknown } = { data: null };

  mockSupabase.from.mockImplementation((table: string) => {
    fromCallCount++;
    eqCallCount = 0; // reset eq count per .from() call

    if (table === "families") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "family-001", subscription_tier: opts.tier ?? null },
              error: null,
            }),
          }),
        }),
      };
    }

    if (table === "profiles") {
      // This is used when role === "parent" to resolve kid profile
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  data: opts.kidId
                    ? [{ id: opts.kidId }]
                    : [{ id: "kid-profile-001" }],
                  error: null,
                }),
              }),
            }),
          }),
        }),
      };
    }

    // voice_sessions table (for logVoiceSession)
    if (table === ("voice_sessions" as never)) {
      return {
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
    }

    return mockSupabase;
  });

  mockSupabase.rpc.mockImplementation((fnName: string) => {
    if (fnName === ("get_voice_seconds_today" as never)) {
      return Promise.resolve({ data: opts.usedToday ?? 0, error: null });
    }
    if (fnName === ("get_voice_seconds_month" as never)) {
      return Promise.resolve({ data: opts.usedMonth ?? 0, error: null });
    }
    return Promise.resolve({ data: 0, error: null });
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("checkVoiceBudget", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockSupabase = createChainableMock();
    mockCreateAdmin.mockReturnValue(mockSupabase as never);
  });

  it("returns allowed:true with correct remaining seconds for free tier", async () => {
    setupBudgetMocks({ tier: "free", usedToday: 120, usedMonth: 600 });

    const result = await checkVoiceBudget();

    expect(result.allowed).toBe(true);
    expect(result.tier).toBe("free");
    expect(result.dailyLimitSeconds).toBe(10 * 60); // 600
    expect(result.monthlyLimitSeconds).toBe(60 * 60); // 3600
    expect(result.remainingSecondsToday).toBe(600 - 120); // 480
    expect(result.remainingSecondsMonth).toBe(3600 - 600); // 3000
    expect(result.remainingSeconds).toBe(Math.min(480, 3000)); // 480
  });

  it("returns allowed:true with supporter tier limits", async () => {
    setupBudgetMocks({ tier: "supporter", usedToday: 300, usedMonth: 1000 });

    const result = await checkVoiceBudget();

    expect(result.allowed).toBe(true);
    expect(result.tier).toBe("supporter");
    expect(result.dailyLimitSeconds).toBe(30 * 60); // 1800
    expect(result.monthlyLimitSeconds).toBe(300 * 60); // 18000
    expect(result.remainingSecondsToday).toBe(1800 - 300); // 1500
    expect(result.remainingSecondsMonth).toBe(18000 - 1000); // 17000
    expect(result.remainingSeconds).toBe(Math.min(1500, 17000)); // 1500
  });

  it("returns allowed:false with reason when daily limit is exceeded", async () => {
    // Daily used = 600 (full), monthly still has room
    setupBudgetMocks({ tier: "free", usedToday: 600, usedMonth: 600 });

    const result = await checkVoiceBudget();

    expect(result.allowed).toBe(false);
    expect(result.remainingSeconds).toBe(0);
    expect(result.remainingSecondsToday).toBe(0);
    expect(result.remainingSecondsMonth).toBe(3000); // 3600 - 600
    expect(result.reason).toContain("today");
  });

  it("returns allowed:false with reason when monthly limit is exceeded", async () => {
    // Monthly used = 3600 (full), daily also 0 because monthly is the bottleneck
    setupBudgetMocks({ tier: "free", usedToday: 0, usedMonth: 3600 });

    const result = await checkVoiceBudget();

    expect(result.allowed).toBe(false);
    expect(result.remainingSeconds).toBe(0);
    expect(result.remainingSecondsMonth).toBe(0);
    expect(result.reason).toContain("month");
  });

  it("returns the minimum of daily and monthly remaining as remainingSeconds", async () => {
    // Daily remaining: 600 - 500 = 100, Monthly remaining: 3600 - 3550 = 50
    setupBudgetMocks({ tier: "free", usedToday: 500, usedMonth: 3550 });

    const result = await checkVoiceBudget();

    expect(result.allowed).toBe(true);
    expect(result.remainingSecondsToday).toBe(100);
    expect(result.remainingSecondsMonth).toBe(50);
    expect(result.remainingSeconds).toBe(50); // min(100, 50)
  });

  it('falls back to "free" tier when family has no subscription_tier', async () => {
    setupBudgetMocks({ tier: null, usedToday: 0, usedMonth: 0 });

    const result = await checkVoiceBudget();

    expect(result.tier).toBe("free");
    expect(result.dailyLimitSeconds).toBe(10 * 60);
    expect(result.monthlyLimitSeconds).toBe(60 * 60);
  });

  it('falls back to "free" tier for unknown tier values', async () => {
    setupBudgetMocks({ tier: "enterprise", usedToday: 0, usedMonth: 0 });

    const result = await checkVoiceBudget();

    // Unknown tier -> DAILY_LIMIT[tier] is undefined -> falls back to DAILY_LIMIT.free
    expect(result.dailyLimitSeconds).toBe(10 * 60);
    expect(result.monthlyLimitSeconds).toBe(60 * 60);
  });

  it("when profile is a parent, resolves the first kid's profile ID for the daily budget query", async () => {
    setupBudgetMocks({ role: "parent", tier: "free", usedToday: 0, usedMonth: 0, kidId: "kid-resolved-001" });

    const result = await checkVoiceBudget();

    expect(result.allowed).toBe(true);
    // Verify rpc was called with the kid profile ID, not the parent's
    expect(mockSupabase.rpc).toHaveBeenCalledWith(
      "get_voice_seconds_today",
      { p_profile_id: "kid-resolved-001" },
    );
  });

  it("when profile is a kid, uses the kid's own profile ID", async () => {
    setupBudgetMocks({ role: "kid", tier: "free", usedToday: 0, usedMonth: 0 });

    const result = await checkVoiceBudget();

    expect(result.allowed).toBe(true);
    expect(mockSupabase.rpc).toHaveBeenCalledWith(
      "get_voice_seconds_today",
      { p_profile_id: "kid-profile-001" },
    );
  });

  it("returns allowed:false with safe defaults when requireAuth() throws", async () => {
    mockRequireAuth.mockRejectedValue(new Error("Not authenticated"));

    const result = await checkVoiceBudget();

    expect(result.allowed).toBe(false);
    expect(result.remainingSeconds).toBe(0);
    expect(result.remainingSecondsToday).toBe(0);
    expect(result.remainingSecondsMonth).toBe(0);
    expect(result.dailyLimitSeconds).toBe(0);
    expect(result.monthlyLimitSeconds).toBe(0);
    expect(result.tier).toBe("free");
    expect(result.reason).toContain("Unable to check voice budget");
  });

  it("returns allowed:false with safe defaults when Supabase query fails", async () => {
    mockRequireAuth.mockResolvedValue({
      userId: "clerk-user-001",
      profile: mockProfile,
      supabase: mockSupabase as never,
    });

    // Make the family query throw
    mockSupabase.from.mockImplementation(() => {
      throw new Error("Database connection failed");
    });

    const result = await checkVoiceBudget();

    expect(result.allowed).toBe(false);
    expect(result.remainingSeconds).toBe(0);
    expect(result.tier).toBe("free");
    expect(result.reason).toContain("Unable to check voice budget");
  });
});

// ---------------------------------------------------------------------------
// logVoiceSession
// ---------------------------------------------------------------------------

describe("logVoiceSession", () => {
  let insertMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetAllMocks();
    mockSupabase = createChainableMock();
    mockCreateAdmin.mockReturnValue(mockSupabase as never);
    insertMock = vi.fn().mockResolvedValue({ data: null, error: null });

    mockRequireAuth.mockResolvedValue({
      userId: mockProfile.clerk_id,
      profile: mockProfile,
      supabase: mockSupabase as never,
    });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === ("voice_sessions" as never)) {
        return { insert: insertMock };
      }
      // profiles query (for parent role resolution)
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  data: [{ id: "kid-profile-001" }],
                  error: null,
                }),
              }),
            }),
          }),
        }),
      };
    });
  });

  it("inserts a row into voice_sessions with correct fields", async () => {
    await logVoiceSession("chat-group-abc", 60);

    expect(insertMock).toHaveBeenCalledTimes(1);
    const insertedRow = insertMock.mock.calls[0][0];
    expect(insertedRow.profile_id).toBe("kid-profile-001");
    expect(insertedRow.family_id).toBe("family-001");
    expect(insertedRow.chat_group_id).toBe("chat-group-abc");
    expect(insertedRow.duration_seconds).toBe(60);
  });

  it("calculates cost correctly: 60 seconds = 7 cents", async () => {
    await logVoiceSession("chat-group-abc", 60);

    const insertedRow = insertMock.mock.calls[0][0];
    // 60 * (0.07 / 60 * 100) = 60 * 0.11666... = 7.0 -> rounds to 7
    expect(insertedRow.estimated_cost_cents).toBe(7);
  });

  it("calculates cost correctly: 5 seconds = 1 cent", async () => {
    await logVoiceSession("chat-group-abc", 5);

    const insertedRow = insertMock.mock.calls[0][0];
    // 5 * 0.11666... = 0.5833... -> rounds to 1
    expect(insertedRow.estimated_cost_cents).toBe(1);
  });

  it("calculates cost correctly: 1 second = 0 cents (rounds down)", async () => {
    await logVoiceSession("chat-group-abc", 1);

    const insertedRow = insertMock.mock.calls[0][0];
    // 1 * 0.11666... = 0.11666... -> rounds to 0
    expect(insertedRow.estimated_cost_cents).toBe(0);
  });

  it("does nothing when durationSeconds <= 0", async () => {
    await logVoiceSession("chat-group-abc", 0);
    expect(mockRequireAuth).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();

    await logVoiceSession("chat-group-abc", -10);
    expect(mockRequireAuth).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("when profile is a parent, resolves the first kid's profile ID", async () => {
    mockRequireAuth.mockResolvedValue({
      userId: mockParentProfile.clerk_id,
      profile: mockParentProfile,
      supabase: mockSupabase as never,
    });

    await logVoiceSession("chat-group-abc", 30);

    const insertedRow = insertMock.mock.calls[0][0];
    expect(insertedRow.profile_id).toBe("kid-profile-001");
  });

  it("does not throw when Supabase insert fails", async () => {
    insertMock.mockRejectedValue(new Error("Insert failed"));

    // Should not throw
    await expect(logVoiceSession("chat-group-abc", 30)).resolves.toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// refreshHumeAccessToken
// ---------------------------------------------------------------------------

describe("refreshHumeAccessToken", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("calls getHumeAccessToken and returns the result", async () => {
    mockGetHumeAccessToken.mockResolvedValue("fresh-token-xyz");

    const result = await refreshHumeAccessToken();

    expect(mockGetHumeAccessToken).toHaveBeenCalledTimes(1);
    expect(result).toBe("fresh-token-xyz");
  });

  it("returns null when getHumeAccessToken returns null", async () => {
    mockGetHumeAccessToken.mockResolvedValue(null);

    const result = await refreshHumeAccessToken();

    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getChipVoiceInitialData
// ---------------------------------------------------------------------------

describe("getChipVoiceInitialData", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockSupabase = createChainableMock();
    mockCreateAdmin.mockReturnValue(mockSupabase as never);
  });

  it("returns null when access token is null", async () => {
    mockGetHumeAccessToken.mockResolvedValue(null);

    const result = await getChipVoiceInitialData();

    expect(result).toBeNull();
  });

  it("returns accessToken, configId, and pageContext when token is available", async () => {
    mockGetHumeAccessToken.mockResolvedValue("test-access-token");
    process.env.NEXT_PUBLIC_HUME_CONFIG_ID = "config-abc";

    // Set up requireAuth for the fetchVoicePageContext inner call
    mockRequireAuth.mockResolvedValue({
      userId: mockProfile.clerk_id,
      profile: mockProfile,
      supabase: mockSupabase as never,
    });

    // Set up supabase mocks for fetchVoicePageContext queries
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "subjects") {
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: [{ id: "s1", display_name: "Math", slug: "math", sort_order: 1 }],
              error: null,
            }),
          }),
        };
      }
      if (table === "progress") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        };
      }
      return mockSupabase;
    });

    const result = await getChipVoiceInitialData();

    expect(result).not.toBeNull();
    expect(result!.accessToken).toBe("test-access-token");
    expect(result!.configId).toBe("config-abc");
    expect(result!.pageContext).toBeDefined();

    // Clean up
    delete process.env.NEXT_PUBLIC_HUME_CONFIG_ID;
  });
});
