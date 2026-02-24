import { describe, it, expect, vi, beforeEach } from "vitest";

import { computeLevel, updateSkillProficiency } from "./skill-proficiency-writer";

// ---------------------------------------------------------------------------
// computeLevel (pure function — no mocks needed)
// ---------------------------------------------------------------------------

describe("computeLevel", () => {
  it("returns mastered for high score, 0 hints, high first-try rate", () => {
    expect(
      computeLevel({ score: 90, hintsUsed: 0, correctFirstTry: 9, totalQuestions: 10 }),
    ).toBe("mastered");
  });

  it("returns mastered at exact thresholds (85, 0, 80%)", () => {
    expect(
      computeLevel({ score: 85, hintsUsed: 0, correctFirstTry: 8, totalQuestions: 10 }),
    ).toBe("mastered");
  });

  it("does not return mastered if hints were used", () => {
    expect(
      computeLevel({ score: 90, hintsUsed: 1, correctFirstTry: 9, totalQuestions: 10 }),
    ).toBe("proficient");
  });

  it("does not return mastered if first-try rate is below 80%", () => {
    expect(
      computeLevel({ score: 90, hintsUsed: 0, correctFirstTry: 7, totalQuestions: 10 }),
    ).toBe("proficient");
  });

  it("returns proficient for score >= 70 with <= 1 hint", () => {
    expect(
      computeLevel({ score: 75, hintsUsed: 1, correctFirstTry: 5, totalQuestions: 10 }),
    ).toBe("proficient");
  });

  it("returns developing for score 50-69 even with many hints", () => {
    expect(
      computeLevel({ score: 55, hintsUsed: 5, correctFirstTry: 3, totalQuestions: 10 }),
    ).toBe("developing");
  });

  it("returns beginning for score below 50", () => {
    expect(
      computeLevel({ score: 30, hintsUsed: 3, correctFirstTry: 2, totalQuestions: 10 }),
    ).toBe("beginning");
  });

  it("handles 0 total questions without crashing", () => {
    expect(
      computeLevel({ score: 100, hintsUsed: 0, correctFirstTry: 0, totalQuestions: 0 }),
    ).toBe("proficient"); // score >= 70, 0 hints, but firstTryRate = 0 so not mastered
  });
});

// ---------------------------------------------------------------------------
// updateSkillProficiency (Supabase interactions)
// ---------------------------------------------------------------------------

function createMockSupabase({
  lessonSkills = [] as string[],
  existingRows = [] as { id: string; skill_id: string; level: string; attempts: number; correct: number }[],
}: {
  lessonSkills?: string[];
  existingRows?: { id: string; skill_id: string; level: string; attempts: number; correct: number }[];
} = {}) {
  const insertFn = vi.fn().mockResolvedValue({ error: null });
  const updateEqFn = vi.fn().mockResolvedValue({ error: null });
  const updateFn = vi.fn().mockReturnValue({ eq: updateEqFn });

  const fromFn = vi.fn().mockImplementation((table: string) => {
    if (table === "lessons") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { skills_covered: lessonSkills },
            }),
          }),
        }),
      };
    }
    if (table === "skill_proficiencies") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ data: existingRows }),
          }),
        }),
        insert: insertFn,
        update: updateFn,
      };
    }
    return {};
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { client: { from: fromFn } as any, fromFn, insertFn, updateFn, updateEqFn };
}

describe("updateSkillProficiency", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("does nothing when lesson has no skills_covered", async () => {
    const { client, insertFn, updateFn } = createMockSupabase({
      lessonSkills: [],
    });

    await updateSkillProficiency(client, "profile-1", "lesson-1", {
      score: 90,
      hintsUsed: 0,
      correctFirstTry: 9,
      totalQuestions: 10,
    });

    expect(insertFn).not.toHaveBeenCalled();
    expect(updateFn).not.toHaveBeenCalled();
  });

  it("inserts new skill proficiency when none exists", async () => {
    const { client, insertFn } = createMockSupabase({
      lessonSkills: ["skill-uuid-1"],
      existingRows: [],
    });

    await updateSkillProficiency(client, "profile-1", "lesson-1", {
      score: 90,
      hintsUsed: 0,
      correctFirstTry: 9,
      totalQuestions: 10,
    });

    expect(insertFn).toHaveBeenCalledWith(
      expect.objectContaining({
        profile_id: "profile-1",
        skill_id: "skill-uuid-1",
        level: "mastered",
        attempts: 1,
        correct: 1,
      }),
    );
  });

  it("upgrades level when new performance is better", async () => {
    const { client, updateFn } = createMockSupabase({
      lessonSkills: ["skill-uuid-1"],
      existingRows: [
        { id: "sp-1", skill_id: "skill-uuid-1", level: "developing", attempts: 2, correct: 1 },
      ],
    });

    await updateSkillProficiency(client, "profile-1", "lesson-1", {
      score: 90,
      hintsUsed: 0,
      correctFirstTry: 9,
      totalQuestions: 10,
    });

    expect(updateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "mastered",
        attempts: 3,
        correct: 2,
      }),
    );
  });

  it("never downgrades level", async () => {
    const { client, updateFn } = createMockSupabase({
      lessonSkills: ["skill-uuid-1"],
      existingRows: [
        { id: "sp-1", skill_id: "skill-uuid-1", level: "mastered", attempts: 5, correct: 4 },
      ],
    });

    // Poor performance this time
    await updateSkillProficiency(client, "profile-1", "lesson-1", {
      score: 30,
      hintsUsed: 5,
      correctFirstTry: 1,
      totalQuestions: 10,
    });

    expect(updateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "mastered", // not downgraded
        attempts: 6,
        correct: 4, // score 30 = not passed, so correct stays at 4
      }),
    );
  });

  it("handles multiple skills in one lesson", async () => {
    const { client, insertFn } = createMockSupabase({
      lessonSkills: ["skill-a", "skill-b", "skill-c"],
      existingRows: [],
    });

    await updateSkillProficiency(client, "profile-1", "lesson-1", {
      score: 60,
      hintsUsed: 2,
      correctFirstTry: 4,
      totalQuestions: 10,
    });

    // Should insert one row per skill
    expect(insertFn).toHaveBeenCalledTimes(3);
  });
});
