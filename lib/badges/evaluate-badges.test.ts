import { describe, it, expect, vi, beforeEach } from "vitest";

import { evaluateBadges } from "./evaluate-badges";
import type { EarnedBadgeInfo } from "./evaluate-badges";

// ---------------------------------------------------------------------------
// Mock Supabase factory
// ---------------------------------------------------------------------------

interface MockBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  criteria: { type: string; threshold: number; subject?: string; week?: number };
}

interface SetupOptions {
  /** All badge definitions in the system */
  badges: MockBadge[];
  /** IDs of badges the profile already earned */
  earnedBadgeIds: string[];
  /** Stat query return values (count-based) */
  stats: {
    lessonsCompleted?: number;
    projectsSaved?: number;
    deviceFlashes?: number;
    simulatorRuns?: number;
    chatSessions?: number;
  };
  /** Rows returned for completion dates query */
  completionDates?: Array<{ completed_at: string }>;
  /** Rows returned for subject progress query */
  subjectProgress?: Array<{
    lesson_id: string;
    lessons: {
      subject_id: string | null;
      subjects: { slug: string } | null;
    } | null;
  }>;
  /** Whether the insert should return an error */
  insertError?: boolean;
}

function createMockSupabase(opts: SetupOptions) {
  const insertFn = vi.fn().mockResolvedValue({
    error: opts.insertError ? { message: "insert failed" } : null,
  });

  // Track cross-call state for tables called multiple times
  let deviceSessionCallCount = 0;

  // Build the from() router that returns different chains depending on the table
  const fromFn = vi.fn().mockImplementation((table: string) => {
    switch (table) {
      case "badges":
        return {
          select: vi.fn().mockResolvedValue({ data: opts.badges }),
        };

      case "user_badges": {
        // .select().eq() chain for fetching earned badges
        const selectChain = {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: opts.earnedBadgeIds.map((id) => ({ badge_id: id })),
            }),
          }),
          insert: insertFn,
        };
        return selectChain;
      }

      case "progress": {
        // Multiple queries hit this table; differentiate by the select call args
        return {
          select: vi.fn().mockImplementation((selectArg: string, selectOpts?: unknown) => {
            const chain = {
              eq: vi.fn().mockReturnThis(),
              not: vi.fn().mockReturnThis(),
            } as Record<string, unknown>;

            if (selectOpts && (selectOpts as Record<string, unknown>).head) {
              // Count query — return count
              chain.eq = vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  count: opts.stats.lessonsCompleted ?? 0,
                }),
              });
            } else if (selectArg === "completed_at") {
              chain.eq = vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  not: vi.fn().mockResolvedValue({
                    data: opts.completionDates ?? [],
                  }),
                }),
              });
            } else if (selectArg.includes("lessons(")) {
              chain.eq = vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: opts.subjectProgress ?? [],
                }),
              });
            }

            return chain;
          }),
        };
      }

      case "projects":
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              count: opts.stats.projectsSaved ?? 0,
            }),
          }),
        };

      case "device_sessions": {
        // Each call to from("device_sessions") is a separate query.
        // Counter is hoisted above the switch so it persists across calls.
        deviceSessionCallCount++;
        const isFirstDeviceCall = deviceSessionCallCount === 1;

        // First call chain: .select(...).eq("profile_id", id) => { count }
        // Second call chain: .select(...).eq("profile_id", id).eq("device_type", "simulator") => { count }
        //
        // Both chains start with .select().eq(). The first call's .eq() is the
        // terminal awaitable, while the second call chains a second .eq() that
        // is the terminal awaitable.
        const countValue = isFirstDeviceCall
          ? (opts.stats.deviceFlashes ?? 0)
          : (opts.stats.simulatorRuns ?? 0);

        // Build a chainable object where .eq() always returns itself AND is
        // awaitable (thenable) with the correct count.
        const eqResult: Record<string, unknown> = {};
        eqResult.eq = vi.fn().mockReturnValue(eqResult);
        // Make it thenable so `await chain.eq(...)` resolves to { count }
        eqResult.then = (resolve: (v: unknown) => void) =>
          resolve({ count: countValue });

        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue(eqResult),
          }),
        };
      }

      case "chat_sessions":
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              count: opts.stats.chatSessions ?? 0,
            }),
          }),
        };

      default:
        return {
          select: vi.fn().mockResolvedValue({ data: [] }),
        };
    }
  });

  return {
    client: { from: fromFn } as unknown as Parameters<
      typeof evaluateBadges
    >[0],
    fromFn,
    insertFn,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("evaluateBadges", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // ---- No badges to earn ----

  it("returns empty array when no badges exist", async () => {
    const { client } = createMockSupabase({
      badges: [],
      earnedBadgeIds: [],
      stats: {},
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toEqual([]);
  });

  it("returns empty array when all badges are already earned", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-1",
          name: "First Steps",
          icon: "rocket",
          description: "Complete 1 lesson",
          criteria: { type: "lessons_completed", threshold: 1 },
        },
      ],
      earnedBadgeIds: ["badge-1"],
      stats: { lessonsCompleted: 5 },
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toEqual([]);
  });

  // ---- Criteria: lessons_completed ----

  it("awards lessons_completed badge when threshold is met", async () => {
    const { client, insertFn } = createMockSupabase({
      badges: [
        {
          id: "badge-1",
          name: "Scholar",
          icon: "book",
          description: "Complete 5 lessons",
          criteria: { type: "lessons_completed", threshold: 5 },
        },
      ],
      earnedBadgeIds: [],
      stats: { lessonsCompleted: 5 },
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toEqual<EarnedBadgeInfo[]>([
      { name: "Scholar", icon: "book", description: "Complete 5 lessons" },
    ]);
    expect(insertFn).toHaveBeenCalledWith({
      profile_id: "profile-1",
      badge_id: "badge-1",
    });
  });

  it("does not award lessons_completed badge when below threshold", async () => {
    const { client, insertFn } = createMockSupabase({
      badges: [
        {
          id: "badge-1",
          name: "Scholar",
          icon: "book",
          description: "Complete 5 lessons",
          criteria: { type: "lessons_completed", threshold: 5 },
        },
      ],
      earnedBadgeIds: [],
      stats: { lessonsCompleted: 4 },
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toEqual([]);
    expect(insertFn).not.toHaveBeenCalled();
  });

  // ---- Criteria: simulator_runs ----

  it("awards simulator_runs badge when threshold is met", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-sim",
          name: "Simulator Pro",
          icon: "monitor",
          description: "Run simulator 10 times",
          criteria: { type: "simulator_runs", threshold: 10 },
        },
      ],
      earnedBadgeIds: [],
      stats: { simulatorRuns: 15 },
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Simulator Pro");
  });

  // ---- Criteria: chat_sessions ----

  it("awards chat_sessions badge when threshold is met", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-chat",
          name: "Chatty",
          icon: "message-circle",
          description: "Chat with Chip 5 times",
          criteria: { type: "chat_sessions", threshold: 5 },
        },
      ],
      earnedBadgeIds: [],
      stats: { chatSessions: 5 },
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Chatty");
  });

  // ---- Criteria: unique_days_with_completions ----

  it("awards unique_days badge based on completion date data", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-days",
          name: "Consistent",
          icon: "calendar",
          description: "Complete lessons on 3 different days",
          criteria: { type: "unique_days_with_completions", threshold: 3 },
        },
      ],
      earnedBadgeIds: [],
      stats: { lessonsCompleted: 5 },
      completionDates: [
        { completed_at: "2026-02-08T10:00:00Z" },
        { completed_at: "2026-02-09T14:00:00Z" },
        { completed_at: "2026-02-09T15:00:00Z" }, // same day as above
        { completed_at: "2026-02-10T09:00:00Z" },
      ],
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Consistent");
  });

  // ---- Criteria: unique_subjects_attempted / cross_subject ----

  it("awards cross_subject badge based on unique subjects", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-cross",
          name: "Explorer",
          icon: "compass",
          description: "Try 3 different subjects",
          criteria: { type: "cross_subject", threshold: 3 },
        },
      ],
      earnedBadgeIds: [],
      stats: { lessonsCompleted: 4 },
      subjectProgress: [
        {
          lesson_id: "l1",
          lessons: { subject_id: "s1", subjects: { slug: "math" } },
        },
        {
          lesson_id: "l2",
          lessons: { subject_id: "s2", subjects: { slug: "reading" } },
        },
        {
          lesson_id: "l3",
          lessons: { subject_id: "s3", subjects: { slug: "science" } },
        },
      ],
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Explorer");
  });

  // ---- Criteria: subject_lesson_complete ----

  it("awards subject_lesson_complete badge for specific subject", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-math",
          name: "Math Whiz",
          icon: "calculator",
          description: "Complete 3 math lessons",
          criteria: { type: "subject_lesson_complete", threshold: 3, subject: "math" },
        },
      ],
      earnedBadgeIds: [],
      stats: { lessonsCompleted: 5 },
      subjectProgress: [
        {
          lesson_id: "l1",
          lessons: { subject_id: "s1", subjects: { slug: "math" } },
        },
        {
          lesson_id: "l2",
          lessons: { subject_id: "s1", subjects: { slug: "math" } },
        },
        {
          lesson_id: "l3",
          lessons: { subject_id: "s1", subjects: { slug: "math" } },
        },
        {
          lesson_id: "l4",
          lessons: { subject_id: "s2", subjects: { slug: "reading" } },
        },
      ],
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Math Whiz");
  });

  it("does not award subject_lesson_complete when subject criteria is missing", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-no-subject",
          name: "Bad Badge",
          icon: "x",
          description: "Broken criteria",
          criteria: { type: "subject_lesson_complete", threshold: 1 },
          // NOTE: no subject field
        },
      ],
      earnedBadgeIds: [],
      stats: { lessonsCompleted: 10 },
      subjectProgress: [
        {
          lesson_id: "l1",
          lessons: { subject_id: "s1", subjects: { slug: "math" } },
        },
      ],
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toEqual([]);
  });

  // ---- Criteria: device_flash ----

  it("awards device_flash badge when threshold is met", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-flash",
          name: "Flasher",
          icon: "zap",
          description: "Flash 3 times",
          criteria: { type: "device_flash", threshold: 3 },
        },
      ],
      earnedBadgeIds: [],
      stats: { deviceFlashes: 5 },
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Flasher");
  });

  // ---- Criteria: first_login (always true) ----

  it("awards first_login badge since it is always true", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-login",
          name: "Welcome",
          icon: "door-open",
          description: "Log in for the first time",
          criteria: { type: "first_login", threshold: 0 },
        },
      ],
      earnedBadgeIds: [],
      stats: {},
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Welcome");
  });

  // ---- Criteria: projects_saved ----

  it("awards projects_saved badge when threshold is met", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-projects",
          name: "Creator",
          icon: "palette",
          description: "Save 5 projects",
          criteria: { type: "projects_saved", threshold: 5 },
        },
      ],
      earnedBadgeIds: [],
      stats: { projectsSaved: 5 },
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Creator");
  });

  // ---- Legacy criteria: bug_fix, shapes_drawn, etc. ----

  it("awards legacy bug_fix badge when lessonsCompleted >= 3", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-bugfix",
          name: "Bug Fixer",
          icon: "bug",
          description: "Fix your first bug",
          criteria: { type: "bug_fix", threshold: 0 },
        },
      ],
      earnedBadgeIds: [],
      stats: { lessonsCompleted: 3 },
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Bug Fixer");
  });

  it("does not award legacy bug_fix badge when lessonsCompleted < 3", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-bugfix",
          name: "Bug Fixer",
          icon: "bug",
          description: "Fix your first bug",
          criteria: { type: "bug_fix", threshold: 0 },
        },
      ],
      earnedBadgeIds: [],
      stats: { lessonsCompleted: 2 },
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toEqual([]);
  });

  // ---- Unknown criteria type ----

  it("does not award badge with unknown criteria type", async () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { client, insertFn } = createMockSupabase({
      badges: [
        {
          id: "badge-unknown",
          name: "Mystery",
          icon: "question",
          description: "Unknown",
          criteria: { type: "nonexistent_type", threshold: 1 },
        },
      ],
      earnedBadgeIds: [],
      stats: { lessonsCompleted: 100 },
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toEqual([]);
    expect(insertFn).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "[badges] Unknown criteria type: nonexistent_type",
    );

    consoleSpy.mockRestore();
  });

  // ---- Multiple badges at once ----

  it("awards multiple badges in a single evaluation", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-1",
          name: "First Steps",
          icon: "rocket",
          description: "Complete 1 lesson",
          criteria: { type: "lessons_completed", threshold: 1 },
        },
        {
          id: "badge-2",
          name: "Welcome",
          icon: "door-open",
          description: "Log in",
          criteria: { type: "first_login", threshold: 0 },
        },
        {
          id: "badge-3",
          name: "Unreachable",
          icon: "x",
          description: "Complete 100 lessons",
          criteria: { type: "lessons_completed", threshold: 100 },
        },
      ],
      earnedBadgeIds: [],
      stats: { lessonsCompleted: 5 },
    });

    const result = await evaluateBadges(client, "profile-1");

    expect(result).toHaveLength(2);
    const names = result.map((b) => b.name).sort();
    expect(names).toEqual(["First Steps", "Welcome"]);
  });

  // ---- Duplicate prevention ----

  it("skips already-earned badges even if criteria are still met", async () => {
    const { client, insertFn } = createMockSupabase({
      badges: [
        {
          id: "badge-1",
          name: "First Steps",
          icon: "rocket",
          description: "Complete 1 lesson",
          criteria: { type: "lessons_completed", threshold: 1 },
        },
        {
          id: "badge-2",
          name: "Scholar",
          icon: "book",
          description: "Complete 5 lessons",
          criteria: { type: "lessons_completed", threshold: 5 },
        },
      ],
      earnedBadgeIds: ["badge-1"], // already earned
      stats: { lessonsCompleted: 10 },
    });

    const result = await evaluateBadges(client, "profile-1");

    // Only badge-2 should be newly awarded
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Scholar");
    expect(insertFn).toHaveBeenCalledTimes(1);
    expect(insertFn).toHaveBeenCalledWith({
      profile_id: "profile-1",
      badge_id: "badge-2",
    });
  });

  // ---- Insert error handling ----

  it("does not include badge in results when insert fails", async () => {
    const { client } = createMockSupabase({
      badges: [
        {
          id: "badge-1",
          name: "First Steps",
          icon: "rocket",
          description: "Complete 1 lesson",
          criteria: { type: "lessons_completed", threshold: 1 },
        },
      ],
      earnedBadgeIds: [],
      stats: { lessonsCompleted: 5 },
      insertError: true,
    });

    const result = await evaluateBadges(client, "profile-1");

    // Insert failed, so badge should NOT appear in results
    expect(result).toEqual([]);
  });
});
