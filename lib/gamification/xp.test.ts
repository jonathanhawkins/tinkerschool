import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  getLevelForXP,
  getNextLevelXP,
  awardXP,
  LEVELS,
  type XPAction,
} from "./xp";

// ---------------------------------------------------------------------------
// getLevelForXP
// ---------------------------------------------------------------------------

describe("getLevelForXP", () => {
  it("returns level 1 for 0 XP", () => {
    const level = getLevelForXP(0);
    expect(level.level).toBe(1);
    expect(level.name).toBe("Beginner Tinker");
  });

  it("returns level 1 for 99 XP (just below threshold)", () => {
    const level = getLevelForXP(99);
    expect(level.level).toBe(1);
  });

  it("returns level 2 for exactly 100 XP", () => {
    const level = getLevelForXP(100);
    expect(level.level).toBe(2);
    expect(level.name).toBe("Rising Star");
  });

  it("returns level 3 for 300 XP", () => {
    const level = getLevelForXP(300);
    expect(level.level).toBe(3);
    expect(level.name).toBe("Super Builder");
  });

  it("returns level 4 for 600 XP", () => {
    const level = getLevelForXP(600);
    expect(level.level).toBe(4);
    expect(level.name).toBe("Master Maker");
  });

  it("returns level 5 for 1000 XP", () => {
    const level = getLevelForXP(1000);
    expect(level.level).toBe(5);
    expect(level.name).toBe("TinkerSchool Legend");
  });

  it("returns level 5 for XP far beyond max threshold", () => {
    const level = getLevelForXP(99999);
    expect(level.level).toBe(5);
  });

  it("returns level 2 for XP just above threshold (101)", () => {
    const level = getLevelForXP(101);
    expect(level.level).toBe(2);
  });

  it("returns level 3 for 299 XP (just below level 3)", () => {
    const level = getLevelForXP(299);
    expect(level.level).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// getNextLevelXP
// ---------------------------------------------------------------------------

describe("getNextLevelXP", () => {
  it("returns 100 for XP at level 1", () => {
    expect(getNextLevelXP(0)).toBe(100);
  });

  it("returns 300 for XP at level 2", () => {
    expect(getNextLevelXP(100)).toBe(300);
  });

  it("returns 600 for XP at level 3", () => {
    expect(getNextLevelXP(300)).toBe(600);
  });

  it("returns 1000 for XP at level 4", () => {
    expect(getNextLevelXP(600)).toBe(1000);
  });

  it("returns null for XP at max level (level 5)", () => {
    expect(getNextLevelXP(1000)).toBeNull();
  });

  it("returns null for XP way beyond max level", () => {
    expect(getNextLevelXP(50000)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// awardXP
// ---------------------------------------------------------------------------

describe("awardXP", () => {
  function createMockSupabase(currentXP: number, currentLevel: number) {
    const updateEq = vi.fn().mockResolvedValue({ error: null });
    const updateFn = vi.fn().mockReturnValue({ eq: updateEq });

    const fromFn = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { xp: currentXP, level: currentLevel },
          }),
        }),
      }),
      update: updateFn,
    }));

    return {
      client: { from: fromFn } as unknown as Parameters<typeof awardXP>[0],
      updateFn,
      updateEq,
    };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("awards 50 XP for lesson_completed", async () => {
    const { client, updateFn } = createMockSupabase(0, 1);

    const result = await awardXP(client, "profile-1", "lesson_completed");

    expect(result.xpAwarded).toBe(50);
    expect(result.xp).toBe(50);
    expect(updateFn).toHaveBeenCalledWith(
      expect.objectContaining({ xp: 50 }),
    );
  });

  it("awards 20 XP for project_saved", async () => {
    const { client } = createMockSupabase(0, 1);

    const result = await awardXP(client, "profile-1", "project_saved");

    expect(result.xpAwarded).toBe(20);
    expect(result.xp).toBe(20);
  });

  it("awards 5 XP for simulator_run", async () => {
    const { client } = createMockSupabase(0, 1);

    const result = await awardXP(client, "profile-1", "simulator_run");

    expect(result.xpAwarded).toBe(5);
    expect(result.xp).toBe(5);
  });

  it("awards 10 XP for chat_session", async () => {
    const { client } = createMockSupabase(0, 1);

    const result = await awardXP(client, "profile-1", "chat_session");

    expect(result.xpAwarded).toBe(10);
    expect(result.xp).toBe(10);
  });

  it("awards 25 XP for badge_earned", async () => {
    const { client } = createMockSupabase(0, 1);

    const result = await awardXP(client, "profile-1", "badge_earned");

    expect(result.xpAwarded).toBe(25);
    expect(result.xp).toBe(25);
  });

  it("accumulates XP on existing total", async () => {
    const { client } = createMockSupabase(90, 1);

    const result = await awardXP(client, "profile-1", "lesson_completed");

    expect(result.xp).toBe(140); // 90 + 50
  });

  it("detects level-up when XP crosses threshold", async () => {
    const { client, updateFn } = createMockSupabase(80, 1);

    const result = await awardXP(client, "profile-1", "lesson_completed");

    expect(result.xp).toBe(130); // 80 + 50, crosses 100 threshold
    expect(result.level).toBe(2);
    expect(result.levelName).toBe("Rising Star");
    expect(result.leveledUp).toBe(true);
    expect(updateFn).toHaveBeenCalledWith({ xp: 130, level: 2 });
  });

  it("does not report level-up when staying at same level", async () => {
    const { client } = createMockSupabase(110, 2);

    const result = await awardXP(client, "profile-1", "lesson_completed");

    expect(result.xp).toBe(160); // 110 + 50
    expect(result.level).toBe(2);
    expect(result.leveledUp).toBe(false);
  });

  it("returns zeroed result when profile is not found", async () => {
    const fromFn = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }));

    const client = { from: fromFn } as unknown as Parameters<typeof awardXP>[0];

    const result = await awardXP(client, "missing", "lesson_completed");

    expect(result.xp).toBe(0);
    expect(result.level).toBe(1);
    expect(result.levelName).toBe(LEVELS[0].name);
    expect(result.leveledUp).toBe(false);
    expect(result.xpAwarded).toBe(0);
  });

  it("handles null xp field from profile", async () => {
    const fromFn = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { xp: null, level: null },
          }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }));

    const client = { from: fromFn } as unknown as Parameters<typeof awardXP>[0];

    const result = await awardXP(client, "profile-1", "lesson_completed");

    expect(result.xp).toBe(50); // 0 + 50
    expect(result.level).toBe(1);
  });
});
