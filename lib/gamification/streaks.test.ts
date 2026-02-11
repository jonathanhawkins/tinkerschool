import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { updateStreak } from "./streaks";
import type { StreakResult } from "./streaks";

// ---------------------------------------------------------------------------
// Helpers to build a mock Supabase client
// ---------------------------------------------------------------------------

interface MockProfileRow {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

function createMockSupabase(profileRow: MockProfileRow | null) {
  const updateEq = vi.fn().mockResolvedValue({ error: null });
  const updateFn = vi.fn().mockReturnValue({ eq: updateEq });

  const selectChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: profileRow }),
  };

  const fromFn = vi.fn().mockImplementation((table: string) => {
    if (table === "profiles") {
      return {
        select: selectChain.select.mockReturnValue({
          eq: selectChain.eq.mockReturnValue({
            single: selectChain.single,
          }),
        }),
        update: updateFn,
      };
    }
    return {};
  });

  return {
    client: { from: fromFn } as unknown as Parameters<typeof updateStreak>[0],
    fromFn,
    updateFn,
    updateEq,
  };
}

// ---------------------------------------------------------------------------
// Time helpers — pin "today" to a known UTC date
// ---------------------------------------------------------------------------

function pinDate(isoDate: string) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(`${isoDate}T12:00:00Z`));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("updateStreak", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ---- Profile not found ----

  it("returns zeroed result when profile is not found", async () => {
    const { client } = createMockSupabase(null);

    const result = await updateStreak(client, "missing-profile");

    expect(result).toEqual<StreakResult>({
      currentStreak: 0,
      longestStreak: 0,
      isNewDay: false,
    });
  });

  // ---- Same-day deduplication ----

  it("does not increment when activity is on the same day", async () => {
    pinDate("2026-02-10");

    const { client, updateFn } = createMockSupabase({
      current_streak: 5,
      longest_streak: 10,
      last_activity_date: "2026-02-10",
    });

    const result = await updateStreak(client, "profile-1");

    expect(result).toEqual<StreakResult>({
      currentStreak: 5,
      longestStreak: 10,
      isNewDay: false,
    });
    // No database update should have happened
    expect(updateFn).not.toHaveBeenCalled();
  });

  // ---- Consecutive day increments streak ----

  it("increments streak for consecutive day activity", async () => {
    pinDate("2026-02-10");

    const { client, updateFn, updateEq } = createMockSupabase({
      current_streak: 3,
      longest_streak: 7,
      last_activity_date: "2026-02-09", // yesterday
    });

    const result = await updateStreak(client, "profile-1");

    expect(result).toEqual<StreakResult>({
      currentStreak: 4,
      longestStreak: 7,
      isNewDay: true,
    });

    expect(updateFn).toHaveBeenCalledWith({
      current_streak: 4,
      longest_streak: 7,
      last_activity_date: "2026-02-10",
    });
    expect(updateEq).toHaveBeenCalledWith("id", "profile-1");
  });

  // ---- Streak beats longest ----

  it("updates longest_streak when current surpasses it", async () => {
    pinDate("2026-02-10");

    const { client, updateFn } = createMockSupabase({
      current_streak: 7,
      longest_streak: 7,
      last_activity_date: "2026-02-09",
    });

    const result = await updateStreak(client, "profile-1");

    expect(result).toEqual<StreakResult>({
      currentStreak: 8,
      longestStreak: 8, // new record
      isNewDay: true,
    });

    expect(updateFn).toHaveBeenCalledWith(
      expect.objectContaining({ longest_streak: 8 }),
    );
  });

  // ---- Day gap resets streak ----

  it("resets streak to 1 when a day is skipped", async () => {
    pinDate("2026-02-10");

    const { client, updateFn } = createMockSupabase({
      current_streak: 5,
      longest_streak: 12,
      last_activity_date: "2026-02-08", // 2 days ago
    });

    const result = await updateStreak(client, "profile-1");

    expect(result).toEqual<StreakResult>({
      currentStreak: 1,
      longestStreak: 12,
      isNewDay: true,
    });

    expect(updateFn).toHaveBeenCalledWith({
      current_streak: 1,
      longest_streak: 12,
      last_activity_date: "2026-02-10",
    });
  });

  it("resets streak to 1 when gap is many days", async () => {
    pinDate("2026-02-10");

    const { client } = createMockSupabase({
      current_streak: 20,
      longest_streak: 20,
      last_activity_date: "2026-01-01", // over a month ago
    });

    const result = await updateStreak(client, "profile-1");

    expect(result).toEqual<StreakResult>({
      currentStreak: 1,
      longestStreak: 20,
      isNewDay: true,
    });
  });

  // ---- First ever activity (null last_activity_date) ----

  it("starts streak at 1 for first ever activity", async () => {
    pinDate("2026-02-10");

    const { client, updateFn } = createMockSupabase({
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: null,
    });

    const result = await updateStreak(client, "profile-1");

    expect(result).toEqual<StreakResult>({
      currentStreak: 1,
      longestStreak: 1,
      isNewDay: true,
    });

    expect(updateFn).toHaveBeenCalledWith({
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: "2026-02-10",
    });
  });

  // ---- UTC midnight boundary ----

  it("treats just-past-midnight UTC as a new day", async () => {
    // 2026-02-11 at 00:01 UTC — should be a new day relative to 2026-02-10
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-11T00:01:00Z"));

    const { client } = createMockSupabase({
      current_streak: 3,
      longest_streak: 5,
      last_activity_date: "2026-02-10",
    });

    const result = await updateStreak(client, "profile-1");

    // 2026-02-11 is consecutive to 2026-02-10 => streak increments
    expect(result).toEqual<StreakResult>({
      currentStreak: 4,
      longestStreak: 5,
      isNewDay: true,
    });
  });

  it("treats just-before-midnight UTC as the same day", async () => {
    // 2026-02-10 at 23:59 UTC — still the same day
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-10T23:59:59Z"));

    const { client, updateFn } = createMockSupabase({
      current_streak: 3,
      longest_streak: 5,
      last_activity_date: "2026-02-10",
    });

    const result = await updateStreak(client, "profile-1");

    expect(result.isNewDay).toBe(false);
    expect(result.currentStreak).toBe(3);
    expect(updateFn).not.toHaveBeenCalled();
  });

  // ---- Month boundary ----

  it("handles month boundaries correctly (Feb 28 -> Mar 1)", async () => {
    pinDate("2026-03-01");

    const { client } = createMockSupabase({
      current_streak: 2,
      longest_streak: 2,
      last_activity_date: "2026-02-28",
    });

    const result = await updateStreak(client, "profile-1");

    // Feb 28 -> Mar 1 is 1 day difference => consecutive
    expect(result).toEqual<StreakResult>({
      currentStreak: 3,
      longestStreak: 3,
      isNewDay: true,
    });
  });

  // ---- Year boundary ----

  it("handles year boundaries correctly (Dec 31 -> Jan 1)", async () => {
    pinDate("2027-01-01");

    const { client } = createMockSupabase({
      current_streak: 10,
      longest_streak: 10,
      last_activity_date: "2026-12-31",
    });

    const result = await updateStreak(client, "profile-1");

    expect(result).toEqual<StreakResult>({
      currentStreak: 11,
      longestStreak: 11,
      isNewDay: true,
    });
  });
});
