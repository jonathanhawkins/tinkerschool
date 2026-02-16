import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("server-only", () => ({}));

const mockRequireAuth = vi.fn();
vi.mock("@/lib/auth/require-auth", () => ({
  requireAuth: () => mockRequireAuth(),
}));

const mockGenerateText = vi.fn();
vi.mock("ai", () => ({
  generateText: (...args: unknown[]) => mockGenerateText(...args),
}));

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn().mockReturnValue("mock-model"),
}));

// Stub unstable_cache to just call the function directly (no caching in tests)
vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => unknown) => fn,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------

import { getWeeklySummaries } from "./actions";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildChainMock() {
  const chain: Record<string, unknown> = {};
  chain.from = vi.fn().mockReturnValue(chain);
  chain.select = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.gte = vi.fn().mockReturnValue(chain);
  chain.in = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn().mockResolvedValue({ data: null, error: null });
  return chain;
}

const PARENT_PROFILE = {
  id: "parent-1",
  clerk_id: "clerk-parent-1",
  family_id: "family-1",
  display_name: "Parent",
  role: "parent",
};

const KID_PROFILE = {
  id: "kid-1",
  clerk_id: "clerk-kid-1",
  family_id: "family-1",
  display_name: "Cassidy",
  role: "kid",
  current_streak: 3,
};

const SUBJECTS = [
  { id: "s1", display_name: "Math", color: "#3B82F6", icon: "calculator", slug: "math", name: "math", sort_order: 1 },
  { id: "s2", display_name: "Reading", color: "#22C55E", icon: "book", slug: "reading", name: "reading", sort_order: 2 },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("getWeeklySummaries", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns empty array when no kid profiles in family", async () => {
    const supabase = {
      from: vi.fn().mockImplementation((table: string) => {
        const c: Record<string, unknown> = {};
        c.select = vi.fn().mockReturnValue(c);
        // Each .eq() call returns the chain, so the final await resolves
        c.eq = vi.fn().mockReturnValue(c);
        // .then makes the chain thenable — resolves to empty kids
        c.then = (resolve: (v: unknown) => void) =>
          resolve({ data: [], error: null });
        return c;
      }),
    };

    mockRequireAuth.mockResolvedValue({
      profile: PARENT_PROFILE,
      supabase,
    });

    const results = await getWeeklySummaries();
    expect(results).toEqual([]);
  });

  it("returns fallback message when kid has no activity this week", async () => {
    // Build a supabase mock that handles multiple table queries
    const supabase = {
      from: vi.fn().mockImplementation((table: string) => {
        const c: Record<string, unknown> = {};
        c.select = vi.fn().mockReturnValue(c);
        c.eq = vi.fn().mockReturnValue(c);
        c.gte = vi.fn().mockReturnValue(c);
        c.in = vi.fn().mockReturnValue(c);
        c.order = vi.fn().mockReturnValue(c);
        c.limit = vi.fn().mockReturnValue(c);

        if (table === "profiles") {
          // Return kids on the second eq (role=kid)
          let eqCalls = 0;
          c.eq = vi.fn().mockImplementation(() => {
            eqCalls++;
            if (eqCalls >= 2) {
              // resolve chain
              return { data: [KID_PROFILE], error: null };
            }
            return c;
          });
        } else if (table === "subjects") {
          c.select = vi.fn().mockReturnValue({ data: SUBJECTS, error: null });
        } else if (table === "progress") {
          // No progress this week
          c.gte = vi.fn().mockReturnValue({ data: [], error: null });
        } else if (table === "user_badges") {
          c.gte = vi.fn().mockReturnValue({ data: [], error: null });
        }

        return c;
      }),
    };

    mockRequireAuth.mockResolvedValue({
      profile: PARENT_PROFILE,
      supabase,
    });

    const results = await getWeeklySummaries();

    expect(results).toHaveLength(1);
    expect(results[0].kidName).toBe("Cassidy");
    expect(results[0].hasActivity).toBe(false);
    expect(results[0].text).toContain("Start learning");
  });

  it("generates AI summary when kid has completed lessons", async () => {
    const progressRows = [
      {
        lesson_id: "lesson-1",
        status: "completed",
        completed_at: new Date().toISOString(),
        lessons: { title: "Counting to 10", subject_id: "s1" },
      },
    ];

    const supabase = {
      from: vi.fn().mockImplementation((table: string) => {
        const c: Record<string, unknown> = {};
        c.select = vi.fn().mockReturnValue(c);
        c.eq = vi.fn().mockReturnValue(c);
        c.gte = vi.fn().mockReturnValue(c);
        c.in = vi.fn().mockReturnValue(c);

        if (table === "profiles") {
          let eqCalls = 0;
          c.eq = vi.fn().mockImplementation(() => {
            eqCalls++;
            if (eqCalls >= 2) {
              return { data: [KID_PROFILE], error: null };
            }
            return c;
          });
        } else if (table === "subjects") {
          c.select = vi.fn().mockReturnValue({ data: SUBJECTS, error: null });
        } else if (table === "progress") {
          c.gte = vi.fn().mockReturnValue({
            data: progressRows,
            error: null,
          });
        } else if (table === "activity_sessions") {
          c.in = vi.fn().mockReturnValue({
            data: [{ lesson_id: "lesson-1", score: 85 }],
            error: null,
          });
        } else if (table === "user_badges") {
          c.gte = vi.fn().mockReturnValue({
            data: [{ badges: { name: "Math Star" } }],
            error: null,
          });
        }

        return c;
      }),
    };

    mockRequireAuth.mockResolvedValue({
      profile: PARENT_PROFILE,
      supabase,
    });

    mockGenerateText.mockResolvedValue({
      text: "Cassidy had a great week! She completed Counting to 10 in Math.",
    });

    const results = await getWeeklySummaries();

    expect(results).toHaveLength(1);
    expect(results[0].kidName).toBe("Cassidy");
    expect(results[0].hasActivity).toBe(true);
    expect(results[0].text).toContain("Cassidy");
    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringContaining("weekly learning summary"),
        prompt: expect.stringContaining("Cassidy"),
      }),
    );
  });

  it("returns fallback on AI generation error", async () => {
    const progressRows = [
      {
        lesson_id: "lesson-1",
        status: "completed",
        completed_at: new Date().toISOString(),
        lessons: { title: "Counting to 10", subject_id: "s1" },
      },
    ];

    const supabase = {
      from: vi.fn().mockImplementation((table: string) => {
        const c: Record<string, unknown> = {};
        c.select = vi.fn().mockReturnValue(c);
        c.eq = vi.fn().mockReturnValue(c);
        c.gte = vi.fn().mockReturnValue(c);
        c.in = vi.fn().mockReturnValue(c);

        if (table === "profiles") {
          let eqCalls = 0;
          c.eq = vi.fn().mockImplementation(() => {
            eqCalls++;
            if (eqCalls >= 2) {
              return { data: [KID_PROFILE], error: null };
            }
            return c;
          });
        } else if (table === "subjects") {
          c.select = vi.fn().mockReturnValue({ data: SUBJECTS, error: null });
        } else if (table === "progress") {
          c.gte = vi.fn().mockReturnValue({
            data: progressRows,
            error: null,
          });
        } else if (table === "activity_sessions") {
          c.in = vi.fn().mockReturnValue({
            data: [{ lesson_id: "lesson-1", score: 85 }],
            error: null,
          });
        } else if (table === "user_badges") {
          c.gte = vi.fn().mockReturnValue({ data: [], error: null });
        }

        return c;
      }),
    };

    mockRequireAuth.mockResolvedValue({
      profile: PARENT_PROFILE,
      supabase,
    });

    mockGenerateText.mockRejectedValue(new Error("API error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const results = await getWeeklySummaries();

    expect(results).toHaveLength(1);
    expect(results[0].hasActivity).toBe(false);
    expect(results[0].text).toContain("Start learning");

    consoleSpy.mockRestore();
  });
});
