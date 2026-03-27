import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Hoisted mock helpers (vi.mock factories are hoisted above const declarations)
// ---------------------------------------------------------------------------

const { mockFrom } = vi.hoisted(() => {
  const mockFrom = vi.fn();
  return { mockFrom };
});

function resetMockFrom() {
  mockFrom.mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: { id: "profile-1", role: "kid", family_id: "fam-1" },
      error: null,
    }),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockResolvedValue({ error: null }),
    update: vi.fn().mockReturnThis(),
  });
}

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({ userId: "clerk-user-1" }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn().mockResolvedValue({ from: mockFrom }),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: vi.fn(() => ({ from: mockFrom })),
}));

vi.mock("@/lib/adventures/gather-child-context", () => ({
  gatherChildContext: vi.fn().mockResolvedValue({
    profileId: "profile-1",
    displayName: "Cassidy",
    gradeLevel: 1,
    currentBand: 2,
    learningStyle: {},
    interests: [],
    chipNotes: null,
    skills: [],
    weakSkills: [],
    staleSkills: [],
    recentSessions: [],
    recentAdventureSubjectIds: [],
    subjects: [
      { id: "math-id", slug: "math", displayName: "Math", color: "#3B82F6" },
    ],
  }),
}));

vi.mock("@/lib/adventures/generate-adventure", () => ({
  generateAdventure: vi.fn().mockResolvedValue({
    title: "Test Adventure",
    description: "A test adventure",
    storyText: "Once upon a time...",
    subjectId: "math-id",
    skillIds: ["skill-1"],
    config: { activities: [] },
    subjectColor: "#3B82F6",
  }),
}));

vi.mock("@/lib/adventures/adventure-store", () => ({
  getTodayAdventure: vi.fn().mockResolvedValue(null),
  saveAdventure: vi.fn().mockResolvedValue({
    id: "adventure-1",
    profile_id: "profile-1",
    subject_id: "math-id",
    title: "Test Adventure",
    status: "pending",
  }),
  markAdventureCompleted: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/lib/ai/skill-proficiency-writer", () => ({
  updateSkillProficiencyDirect: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/ai/chip-memory-synthesizer", () => ({
  synthesizeChipNotes: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/badges/evaluate-badges", () => ({
  evaluateBadges: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/gamification/streaks", () => ({
  updateStreak: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/gamification/xp", () => ({
  awardXP: vi.fn().mockResolvedValue({ xpAwarded: 25 }),
}));

vi.mock("@/lib/utils", () => ({
  isValidUUID: vi.fn(
    (id: string) => /^[0-9a-f-]{36}$/.test(id) || id === "adventure-1",
  ),
}));

import { getTodayAdventure, saveAdventure } from "@/lib/adventures/adventure-store";
import { generateAdventure } from "@/lib/adventures/generate-adventure";
import { getOrGenerateAdventure, completeAdventure } from "./actions";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("getOrGenerateAdventure", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockFrom();
  });

  it("returns existing adventure if one exists for today", async () => {
    vi.mocked(getTodayAdventure).mockResolvedValueOnce({
      id: "existing-adventure",
      profile_id: "profile-1",
      subject_id: "math-id",
      skill_ids: [],
      title: "Existing",
      description: "Already exists",
      story_text: null,
      content: {},
      subject_color: "#3B82F6",
      status: "pending",
      score: null,
      generated_at: new Date().toISOString(),
      expires_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    const result = await getOrGenerateAdventure();

    expect(result.success).toBe(true);
    expect(result.adventureId).toBe("existing-adventure");
    expect(generateAdventure).not.toHaveBeenCalled();
  });

  it("generates a new adventure when none exists today", async () => {
    vi.mocked(getTodayAdventure).mockResolvedValueOnce(null);

    const result = await getOrGenerateAdventure();

    expect(result.success).toBe(true);
    expect(result.adventureId).toBe("adventure-1");
    expect(generateAdventure).toHaveBeenCalledOnce();
    expect(saveAdventure).toHaveBeenCalledOnce();
  });
});

describe("completeAdventure", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the from() call for profile resolution + adventure fetch + session insert.
    // The single() mock returns different data on successive calls:
    //   1st call (resolveKidProfileId): profile data
    //   2nd call (adventure fetch): adventure data with profile_id matching the profile
    const singleMock = vi.fn()
      .mockResolvedValueOnce({
        data: { id: "profile-1", role: "kid", family_id: "fam-1" },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { id: "adventure-1", skill_ids: ["skill-1"], profile_id: "profile-1" },
        error: null,
      })
      // Additional calls (e.g., for event tracking profile lookup)
      .mockResolvedValue({
        data: { id: "profile-1", family_id: "fam-1" },
        error: null,
      });

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: singleMock,
      insert: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    });
  });

  it("saves session, marks complete, awards XP on passing score", async () => {
    const result = await completeAdventure({
      adventureId: "adventure-1",
      score: 85,
      totalQuestions: 4,
      correctFirstTry: 4,
      correctTotal: 4,
      timeMs: 120000,
      hintsUsed: 0,
      activityData: [],
    });

    expect(result.success).toBe(true);
    expect(result.xpAwarded).toBe(25);
  });

  it("returns success with 0 XP when score below passing threshold", async () => {
    const result = await completeAdventure({
      adventureId: "adventure-1",
      score: 40,
      totalQuestions: 4,
      correctFirstTry: 1,
      correctTotal: 2,
      timeMs: 180000,
      hintsUsed: 3,
      activityData: [],
    });

    expect(result.success).toBe(true);
    expect(result.xpAwarded).toBe(0);
  });

  it("rejects invalid adventure ID", async () => {
    const result = await completeAdventure({
      adventureId: "not-a-uuid",
      score: 80,
      totalQuestions: 4,
      correctFirstTry: 3,
      correctTotal: 4,
      timeMs: 120000,
      hintsUsed: 0,
      activityData: [],
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid adventure ID");
  });
});
