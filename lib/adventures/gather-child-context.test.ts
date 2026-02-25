import { describe, it, expect, vi, beforeEach } from "vitest";

import { gatherChildContext } from "./gather-child-context";

// ---------------------------------------------------------------------------
// Supabase mock
// ---------------------------------------------------------------------------

function createMockQueryBuilder(data: unknown = null, error: unknown = null) {
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain = (): any =>
    new Proxy(
      {},
      {
        get(_target, prop) {
          if (prop === "then") {
            // Make it thenable so await resolves
            return (resolve: (v: unknown) => void) =>
              resolve({ data, error });
          }
          if (!builder[prop as string]) {
            builder[prop as string] = vi.fn().mockReturnValue(chain());
          }
          return builder[prop as string];
        },
      },
    );

  return chain();
}

function createMockSupabase(overrides: Record<string, { data?: unknown; error?: unknown }> = {}) {
  const tableData: Record<string, { data: unknown; error: unknown }> = {
    profiles: {
      data: {
        id: "profile-1",
        display_name: "Cassidy",
        grade_level: 1,
        current_band: 2,
      },
      error: null,
    },
    learning_profiles: {
      data: {
        learning_style: { visual: 0.8 },
        interests: ["dinosaurs"],
        chip_notes: "Loves counting",
      },
      error: null,
    },
    skill_proficiencies: {
      data: [
        {
          skill_id: "skill-1",
          level: "developing",
          attempts: 5,
          last_practiced: new Date().toISOString(),
          skills: {
            id: "skill-1",
            name: "Addition",
            subject_id: "math-id",
            subjects: { id: "math-id", slug: "math", display_name: "Math" },
          },
        },
      ],
      error: null,
    },
    activity_sessions: {
      data: [
        {
          score: 85,
          hints_used: 0,
          correct_first_try: 4,
          total_questions: 4,
          time_seconds: 90,
          created_at: new Date().toISOString(),
          lesson_id: "lesson-1",
        },
      ],
      error: null,
    },
    daily_adventures: { data: [{ subject_id: "reading-id" }], error: null },
    subjects: {
      data: [
        { id: "math-id", slug: "math", display_name: "Math", color: "#3B82F6" },
        { id: "reading-id", slug: "reading", display_name: "Reading", color: "#22C55E" },
      ],
      error: null,
    },
    ...overrides,
  };

  return {
    from: vi.fn((table: string) => {
      const td = tableData[table] ?? { data: null, error: null };
      return createMockQueryBuilder(td.data, td.error);
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("gatherChildContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gathers all data in parallel and returns a ChildContext", async () => {
    const supabase = createMockSupabase();
    const result = await gatherChildContext(supabase, "profile-1");

    expect(result).not.toBeNull();
    expect(result!.displayName).toBe("Cassidy");
    expect(result!.gradeLevel).toBe(1);
    expect(result!.interests).toEqual(["dinosaurs"]);
    expect(result!.chipNotes).toBe("Loves counting");
    expect(result!.skills).toHaveLength(1);
    expect(result!.skills[0].skillName).toBe("Addition");
    expect(result!.recentSessions).toHaveLength(1);
    expect(result!.recentAdventureSubjectIds).toEqual(["reading-id"]);
    expect(result!.subjects).toHaveLength(2);
  });

  it("returns null when profile is not found", async () => {
    const supabase = createMockSupabase({
      profiles: { data: null, error: null },
    });

    const result = await gatherChildContext(supabase, "missing-profile");
    expect(result).toBeNull();
  });

  it("handles missing learning profile gracefully", async () => {
    const supabase = createMockSupabase({
      learning_profiles: { data: null, error: null },
    });

    const result = await gatherChildContext(supabase, "profile-1");

    expect(result).not.toBeNull();
    expect(result!.learningStyle).toEqual({});
    expect(result!.interests).toEqual([]);
    expect(result!.chipNotes).toBeNull();
  });

  it("handles empty skill proficiencies", async () => {
    const supabase = createMockSupabase({
      skill_proficiencies: { data: [], error: null },
    });

    const result = await gatherChildContext(supabase, "profile-1");

    expect(result).not.toBeNull();
    expect(result!.skills).toEqual([]);
    expect(result!.weakSkills).toEqual([]);
    expect(result!.staleSkills).toEqual([]);
  });

  it("handles empty recent sessions", async () => {
    const supabase = createMockSupabase({
      activity_sessions: { data: [], error: null },
    });

    const result = await gatherChildContext(supabase, "profile-1");

    expect(result).not.toBeNull();
    expect(result!.recentSessions).toEqual([]);
  });
});
