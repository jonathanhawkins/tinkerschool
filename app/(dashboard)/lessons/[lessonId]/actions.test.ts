import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock "server-only" to prevent it from throwing in the test environment.
vi.mock("server-only", () => ({}));

// ---------------------------------------------------------------------------
// Chainable Supabase mock factory
// ---------------------------------------------------------------------------

interface ChainableMock {
  from: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  gte: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  upsert: ReturnType<typeof vi.fn>;
}

function createChainableMock(): ChainableMock {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};

  chain.single = vi.fn().mockResolvedValue({ data: null, error: null });
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.gte = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.upsert = vi.fn().mockReturnValue(chain);
  chain.from = vi.fn().mockReturnValue(chain);

  return chain as unknown as ChainableMock;
}

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

const mockAuth = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/badges/evaluate-badges", () => ({
  evaluateBadges: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/gamification/streaks", () => ({
  updateStreak: vi.fn().mockResolvedValue({ currentStreak: 1, longestStreak: 1, isNewDay: true }),
}));

vi.mock("@/lib/gamification/xp", () => ({
  awardXP: vi.fn().mockResolvedValue({ xp: 50, level: 1, levelName: "Beginner", leveledUp: false, xpAwarded: 50 }),
}));

vi.mock("@/lib/notifications/send-parent-notification", () => ({
  sendLessonCompletionNotification: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/ai/skill-proficiency-writer", () => ({
  updateSkillProficiency: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/ai/chip-memory-synthesizer", () => ({
  synthesizeChipNotes: vi.fn().mockResolvedValue(undefined),
}));

let mockServerSupabase: ChainableMock;

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() => Promise.resolve(mockServerSupabase)),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: vi.fn(() => mockServerSupabase),
}));

// Import after mocks
import { startLesson, completeActivity } from "./actions";
import { evaluateBadges } from "@/lib/badges/evaluate-badges";
import { awardXP } from "@/lib/gamification/xp";
import { updateSkillProficiency } from "@/lib/ai/skill-proficiency-writer";
import { synthesizeChipNotes } from "@/lib/ai/chip-memory-synthesizer";
import { sendLessonCompletionNotification } from "@/lib/notifications/send-parent-notification";

// ---------------------------------------------------------------------------
// startLesson
// ---------------------------------------------------------------------------

describe("startLesson", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_123" });
  });

  it("returns false for invalid UUID", async () => {
    const result = await startLesson("not-a-uuid");
    expect(result.success).toBe(false);
  });

  it("returns false when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await startLesson("00000000-0000-4000-8000-000000000001");
    expect(result.success).toBe(false);
  });

  it("returns false when profile is not found", async () => {
    // Mock profile lookup returns null
    mockServerSupabase.from.mockImplementation(() => {
      const chain = createChainableMock();
      chain.single.mockResolvedValue({ data: null });
      return chain;
    });

    const result = await startLesson("00000000-0000-4000-8000-000000000001");
    expect(result.success).toBe(false);
  });

  it("returns success when kid profile is found and progress is upserted", async () => {
    let fromCallCount = 0;
    mockServerSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        // Profile lookup - kid profile
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "kid-001", role: "kid", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }

      // progress upsert
      return {
        upsert: vi.fn().mockResolvedValue({ error: null }),
      };
    });

    const result = await startLesson("00000000-0000-4000-8000-000000000001");
    expect(result.success).toBe(true);
  });

  it("resolves to first kid when authenticated user is a parent", async () => {
    let fromCallCount = 0;
    mockServerSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        // Parent profile lookup
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "parent-001", role: "parent", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }

      if (fromCallCount === 2) {
        // Kid profiles lookup
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({
                    data: [{ id: "kid-001" }],
                  }),
                }),
              }),
            }),
          }),
        };
      }

      // progress upsert
      return {
        upsert: vi.fn().mockResolvedValue({ error: null }),
      };
    });

    const result = await startLesson("00000000-0000-4000-8000-000000000001");
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// completeActivity
// ---------------------------------------------------------------------------

describe("completeActivity", () => {
  const validInput = {
    lessonId: "00000000-0000-4000-8000-000000000001",
    score: 80,
    totalQuestions: 10,
    correctFirstTry: 7,
    correctTotal: 8,
    timeMs: 120000,
    hintsUsed: 1,
    activityData: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_123" });
  });

  it("returns error for invalid lesson ID", async () => {
    const result = await completeActivity({ ...validInput, lessonId: "bad" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid lesson ID");
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await completeActivity(validInput);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });

  it("returns error when profile is not found", async () => {
    mockServerSupabase.from.mockImplementation(() => {
      const chain = createChainableMock();
      chain.single.mockResolvedValue({ data: null });
      return chain;
    });

    const result = await completeActivity(validInput);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Profile not found");
  });

  // Helper: mock for the progress attempts fetch added by the attempts fix.
  // Returns { data: { attempts: N } } via .select().eq().eq().maybeSingle().
  function progressFetchMock(attempts = 0) {
    return {
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { attempts },
            }),
          }),
        }),
      }),
    };
  }

  it("marks lesson as completed and awards XP when score >= 60", async () => {
    let fromCallCount = 0;
    mockServerSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        // Profile lookup - kid
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "kid-001", role: "kid", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }

      if (fromCallCount === 2) {
        // activity_sessions insert
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      }

      if (fromCallCount === 3) {
        // Fetch existing progress attempts
        return progressFetchMock(2);
      }

      if (fromCallCount === 4) {
        // progress upsert (completed)
        return {
          upsert: vi.fn().mockResolvedValue({ error: null }),
        };
      }

      // Remaining calls: milestone checks (progress count, profile info, family)
      const chain = createChainableMock();
      chain.single.mockResolvedValue({ data: null });
      return chain;
    });

    const result = await completeActivity({ ...validInput, score: 80 });

    expect(result.success).toBe(true);
    expect(result.xpAwarded).toBe(50);
    expect(awardXP).toHaveBeenCalled();
    expect(evaluateBadges).toHaveBeenCalled();
    // Fire-and-forget calls should be triggered
    expect(updateSkillProficiency).toHaveBeenCalledWith(
      expect.anything(), // admin client
      "kid-001",
      validInput.lessonId,
      expect.objectContaining({
        score: 80,
        hintsUsed: 1,
        correctFirstTry: 7,
        totalQuestions: 10,
      }),
    );
    expect(synthesizeChipNotes).toHaveBeenCalledWith(expect.anything(), "kid-001");
    expect(sendLessonCompletionNotification).toHaveBeenCalledWith(
      expect.anything(),
      "kid-001",
      validInput.lessonId,
      80,
    );
  });

  it("does not award XP when score < 60 (not passed)", async () => {
    let fromCallCount = 0;
    mockServerSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "kid-001", role: "kid", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }

      if (fromCallCount === 2) {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }

      if (fromCallCount === 3) {
        // Fetch existing progress attempts
        return progressFetchMock(1);
      }

      // progress upsert (in_progress)
      return { upsert: vi.fn().mockResolvedValue({ error: null }) };
    });

    const result = await completeActivity({ ...validInput, score: 40 });

    expect(result.success).toBe(true);
    expect(result.xpAwarded).toBe(0);
    // Skill proficiency still runs on failed attempts
    expect(updateSkillProficiency).toHaveBeenCalledWith(
      expect.anything(),
      "kid-001",
      validInput.lessonId,
      expect.objectContaining({ score: 40 }),
    );
    // Chip notes and parent notification should NOT run on failures
    expect(synthesizeChipNotes).not.toHaveBeenCalled();
    expect(sendLessonCompletionNotification).not.toHaveBeenCalled();
  });

  it("passes exactly at 60% threshold", async () => {
    let fromCallCount = 0;
    mockServerSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "kid-001", role: "kid", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }

      if (fromCallCount === 2) {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }

      if (fromCallCount === 3) {
        return progressFetchMock(0);
      }

      if (fromCallCount === 4) {
        return { upsert: vi.fn().mockResolvedValue({ error: null }) };
      }

      const chain = createChainableMock();
      chain.single.mockResolvedValue({ data: null });
      return chain;
    });

    const result = await completeActivity({ ...validInput, score: 60 });

    expect(result.success).toBe(true);
    expect(result.xpAwarded).toBe(50);
  });

  it("continues even if activity session insert fails", async () => {
    let fromCallCount = 0;
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockServerSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "kid-001", role: "kid", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }

      if (fromCallCount === 2) {
        // activity_sessions insert fails
        return { insert: vi.fn().mockResolvedValue({ error: new Error("Insert failed") }) };
      }

      if (fromCallCount === 3) {
        return progressFetchMock(0);
      }

      // Still processes the rest
      return { upsert: vi.fn().mockResolvedValue({ error: null }) };
    });

    const result = await completeActivity({ ...validInput, score: 40 });

    // Should still succeed (activity session failure is non-blocking)
    expect(result.success).toBe(true);

    consoleSpy.mockRestore();
  });

  it("returns milestone info at milestone count for free families", async () => {
    let fromCallCount = 0;
    mockServerSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "kid-001", role: "kid", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }

      if (fromCallCount === 2) {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }

      if (fromCallCount === 3) {
        return progressFetchMock(4);
      }

      if (fromCallCount === 4) {
        return { upsert: vi.fn().mockResolvedValue({ error: null }) };
      }

      // Milestone: progress count = 5
      if (fromCallCount === 5) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 5 }),
            }),
          }),
        };
      }

      // Profile for kid name
      if (fromCallCount === 6) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { display_name: "Cassidy", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }

      // Family for subscription tier
      if (fromCallCount === 7) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { subscription_tier: "free" },
              }),
            }),
          }),
        };
      }

      return createChainableMock();
    });

    const result = await completeActivity({ ...validInput, score: 80 });

    expect(result.success).toBe(true);
    expect(result.milestone).toBeDefined();
    expect(result.milestone!.totalCompleted).toBe(5);
    expect(result.milestone!.kidName).toBe("Cassidy");
    expect(result.milestone!.isFree).toBe(true);
  });
});
