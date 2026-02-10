import { describe, it, expect, vi } from "vitest";

// We test the internal classification logic by importing the module
// and calling computeDifficulty with a mocked Supabase client.

// Since the function uses SupabaseClient, we mock it
function createMockSupabase(sessions: Array<{
  score: number;
  hints_used: number;
  total_questions: number;
  time_seconds: number;
  created_at: string;
}>) {
  const mockQuery = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data: sessions, error: null }),
  };

  const mockLessonsQuery = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({
      data: [{ id: "lesson-1" }, { id: "lesson-2" }],
      error: null,
    }),
  };

  return {
    from: vi.fn((table: string) => {
      if (table === "activity_sessions") return mockQuery;
      if (table === "lessons") return mockLessonsQuery;
      return mockQuery;
    }),
  };
}

// Dynamic import to avoid module loading issues
async function getComputeDifficulty() {
  const mod = await import("./adaptive-difficulty");
  return mod.computeDifficulty;
}

describe("adaptive-difficulty", () => {
  it("returns standard difficulty when no sessions exist", async () => {
    const computeDifficulty = await getComputeDifficulty();
    const supabase = createMockSupabase([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await computeDifficulty(supabase as any, "profile-1", null);

    expect(result.level).toBe("standard");
    expect(result.passingScore).toBe(60);
    expect(result.sessionsAnalyzed).toBe(0);
  });

  it("returns supportive difficulty for low average scores", async () => {
    const computeDifficulty = await getComputeDifficulty();
    const sessions = [
      { score: 30, hints_used: 3, total_questions: 5, time_seconds: 120, created_at: "2026-02-01" },
      { score: 40, hints_used: 2, total_questions: 5, time_seconds: 100, created_at: "2026-02-02" },
      { score: 45, hints_used: 4, total_questions: 5, time_seconds: 150, created_at: "2026-02-03" },
    ];
    const supabase = createMockSupabase(sessions);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await computeDifficulty(supabase as any, "profile-1", null);

    expect(result.level).toBe("supportive");
    expect(result.passingScore).toBe(50);
    expect(result.showHintsEarly).toBe(true);
    expect(result.sessionsAnalyzed).toBe(3);
  });

  it("returns challenge difficulty for high average scores with few hints", async () => {
    const computeDifficulty = await getComputeDifficulty();
    const sessions = [
      { score: 90, hints_used: 0, total_questions: 5, time_seconds: 60, created_at: "2026-02-01" },
      { score: 95, hints_used: 0, total_questions: 5, time_seconds: 50, created_at: "2026-02-02" },
      { score: 88, hints_used: 1, total_questions: 5, time_seconds: 70, created_at: "2026-02-03" },
    ];
    const supabase = createMockSupabase(sessions);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await computeDifficulty(supabase as any, "profile-1", null);

    expect(result.level).toBe("challenge");
    expect(result.passingScore).toBe(70);
    expect(result.showHintsEarly).toBe(false);
  });

  it("returns standard difficulty for mid-range scores", async () => {
    const computeDifficulty = await getComputeDifficulty();
    const sessions = [
      { score: 65, hints_used: 1, total_questions: 5, time_seconds: 80, created_at: "2026-02-01" },
      { score: 70, hints_used: 1, total_questions: 5, time_seconds: 90, created_at: "2026-02-02" },
      { score: 75, hints_used: 0, total_questions: 5, time_seconds: 85, created_at: "2026-02-03" },
    ];
    const supabase = createMockSupabase(sessions);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await computeDifficulty(supabase as any, "profile-1", null);

    expect(result.level).toBe("standard");
    expect(result.passingScore).toBe(60);
  });

  it("classifies as supportive when hint rate is high even with OK scores", async () => {
    const computeDifficulty = await getComputeDifficulty();
    const sessions = [
      { score: 60, hints_used: 4, total_questions: 5, time_seconds: 100, created_at: "2026-02-01" },
      { score: 65, hints_used: 3, total_questions: 5, time_seconds: 110, created_at: "2026-02-02" },
      { score: 55, hints_used: 4, total_questions: 5, time_seconds: 120, created_at: "2026-02-03" },
    ];
    const supabase = createMockSupabase(sessions);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await computeDifficulty(supabase as any, "profile-1", null);

    // hint rate = 11/15 = 0.73 > 0.5 threshold
    expect(result.level).toBe("supportive");
  });

  it("provides appropriate encouragement messages", async () => {
    const computeDifficulty = await getComputeDifficulty();

    // Supportive
    const lowSessions = [
      { score: 30, hints_used: 3, total_questions: 5, time_seconds: 120, created_at: "2026-02-01" },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supportive = await computeDifficulty(createMockSupabase(lowSessions) as any, "p1", null);
    expect(supportive.encouragementMessage).toContain("Take your time");

    // Challenge
    const highSessions = [
      { score: 95, hints_used: 0, total_questions: 5, time_seconds: 40, created_at: "2026-02-01" },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const challenge = await computeDifficulty(createMockSupabase(highSessions) as any, "p1", null);
    expect(challenge.encouragementMessage).toContain("challenge");
  });
});
