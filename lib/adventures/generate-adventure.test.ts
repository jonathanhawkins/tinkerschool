import { describe, it, expect, vi, beforeEach } from "vitest";

import type { ChildContext } from "./gather-child-context";

// Mock AI SDK
vi.mock("ai", () => ({
  generateText: vi.fn(),
}));

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn(() => "mock-model"),
}));

import { generateText } from "ai";
import { generateAdventure } from "./generate-adventure";

// ---------------------------------------------------------------------------
// Test context
// ---------------------------------------------------------------------------

function makeContext(overrides: Partial<ChildContext> = {}): ChildContext {
  return {
    profileId: "test-profile-id",
    displayName: "Cassidy",
    gradeLevel: 1,
    currentBand: 2,
    learningStyle: { visual: 0.8, kinesthetic: 0.6 },
    interests: ["dinosaurs", "space"],
    chipNotes: "Loves counting games, struggles with subtraction.",
    skills: [
      {
        skillId: "skill-1",
        skillName: "Addition to 20",
        subjectId: "math-id",
        subjectName: "Math",
        subjectSlug: "math",
        level: "developing",
        attempts: 5,
        lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        skillId: "skill-2",
        skillName: "Subtraction to 10",
        subjectId: "math-id",
        subjectName: "Math",
        subjectSlug: "math",
        level: "beginning",
        attempts: 2,
        lastPracticed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        skillId: "skill-3",
        skillName: "Letter Sounds",
        subjectId: "reading-id",
        subjectName: "Reading",
        subjectSlug: "reading",
        level: "proficient",
        attempts: 10,
        lastPracticed: new Date().toISOString(),
      },
    ],
    weakSkills: [
      {
        skillId: "skill-2",
        skillName: "Subtraction to 10",
        subjectId: "math-id",
        subjectName: "Math",
        subjectSlug: "math",
        level: "beginning",
        attempts: 2,
        lastPracticed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    staleSkills: [
      {
        skillId: "skill-2",
        skillName: "Subtraction to 10",
        subjectId: "math-id",
        subjectName: "Math",
        subjectSlug: "math",
        level: "beginning",
        attempts: 2,
        lastPracticed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    recentSessions: [
      {
        score: 80,
        hintsUsed: 1,
        correctFirstTry: 3,
        totalQuestions: 4,
        timeSeconds: 120,
        subjectId: "math-id",
        createdAt: new Date().toISOString(),
      },
    ],
    recentAdventureSubjectIds: ["reading-id"],
    subjects: [
      { id: "math-id", slug: "math", displayName: "Math", color: "#3B82F6" },
      { id: "reading-id", slug: "reading", displayName: "Reading", color: "#22C55E" },
      { id: "science-id", slug: "science", displayName: "Science", color: "#F97316" },
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("generateAdventure", () => {
  const mockGenerateText = vi.mocked(generateText);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls generateText and validates the JSON response with Zod", async () => {
    const mockConfig = {
      activities: [
        {
          type: "multiple_choice",
          questions: [
            {
              id: "q1",
              prompt: "What is 5 - 2?",
              options: [
                { id: "a", text: "2" },
                { id: "b", text: "3" },
              ],
              correctOptionId: "b",
            },
          ],
        },
      ],
      estimatedMinutes: 5,
      passingScore: 60,
    };

    mockGenerateText.mockResolvedValueOnce({
      text: JSON.stringify(mockConfig),
    } as Awaited<ReturnType<typeof generateText>>);

    const context = makeContext();
    const result = await generateAdventure(context);

    expect(mockGenerateText).toHaveBeenCalledOnce();

    // Verify the prompt includes child context
    const callArgs = mockGenerateText.mock.calls[0][0];
    expect(callArgs.prompt).toContain("Cassidy");
    expect(callArgs.prompt).toContain("Math");
    expect(callArgs.prompt).toContain("grade 1");

    // Verify returned structure
    expect(result.title).toBeTruthy();
    expect(result.description).toContain("Cassidy");
    expect(result.subjectId).toBe("math-id");
    expect(result.skillIds).toContain("skill-2"); // weak skill prioritized
    expect(result.config).toEqual(mockConfig);
    expect(result.subjectColor).toBe("#3B82F6");
  });

  it("favors subjects not recently used in adventures (rotation)", async () => {
    const mockConfig = {
      activities: [{ type: "flash_card", prompt: "Learn!", cards: [{ id: "fc1", front: "A", back: "a" }] }],
    };

    mockGenerateText.mockResolvedValueOnce({
      text: JSON.stringify(mockConfig),
    } as Awaited<ReturnType<typeof generateText>>);

    // All subjects recently covered except science
    const context = makeContext({
      recentAdventureSubjectIds: ["math-id", "reading-id"],
      weakSkills: [], // no weak skills to bias selection
      staleSkills: [],
    });

    const result = await generateAdventure(context);

    // Science should be picked (rotation bonus + not recently covered)
    expect(result.subjectId).toBe("science-id");
  });

  it("retries on failure and succeeds on second attempt", async () => {
    const mockConfig = {
      activities: [{ type: "counting", questions: [{ id: "q1", prompt: "Count!", emoji: "🍎", correctCount: 3, displayCount: 3 }] }],
    };

    mockGenerateText
      .mockRejectedValueOnce(new Error("API timeout"))
      .mockResolvedValueOnce({
        text: JSON.stringify(mockConfig),
      } as Awaited<ReturnType<typeof generateText>>);

    const result = await generateAdventure(makeContext());

    expect(mockGenerateText).toHaveBeenCalledTimes(2);
    expect(result.config).toEqual(mockConfig);
  });

  it("throws after exhausting all retries", async () => {
    mockGenerateText
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockRejectedValueOnce(new Error("Fail 2"))
      .mockRejectedValueOnce(new Error("Fail 3"));

    await expect(generateAdventure(makeContext())).rejects.toThrow(
      "Failed to generate adventure after 3 attempts",
    );
  });

  it("throws if no subjects are available", async () => {
    const context = makeContext({ subjects: [] });

    await expect(generateAdventure(context)).rejects.toThrow(
      "No subjects available",
    );
  });
});
