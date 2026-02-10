import type { SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// XP action types and values
// ---------------------------------------------------------------------------

export type XPAction =
  | "lesson_completed"
  | "project_saved"
  | "simulator_run"
  | "chat_session"
  | "badge_earned";

const XP_VALUES: Record<XPAction, number> = {
  lesson_completed: 50,
  project_saved: 20,
  simulator_run: 5,
  chat_session: 10,
  badge_earned: 25,
};

// ---------------------------------------------------------------------------
// Level thresholds (kid-friendly names)
// ---------------------------------------------------------------------------

export interface LevelInfo {
  level: number;
  name: string;
  minXP: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, name: "Beginner Tinker", minXP: 0 },
  { level: 2, name: "Rising Star", minXP: 100 },
  { level: 3, name: "Super Builder", minXP: 300 },
  { level: 4, name: "Master Maker", minXP: 600 },
  { level: 5, name: "TinkerSchool Legend", minXP: 1000 },
];

/** Get the level info for a given XP total */
export function getLevelForXP(xp: number): LevelInfo {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.minXP) {
      current = lvl;
    } else {
      break;
    }
  }
  return current;
}

/** Get the next level's XP threshold (or null if max level) */
export function getNextLevelXP(xp: number): number | null {
  const currentLevel = getLevelForXP(xp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  return nextLevel?.minXP ?? null;
}

// ---------------------------------------------------------------------------
// Award XP
// ---------------------------------------------------------------------------

export interface XPResult {
  xp: number;
  level: number;
  levelName: string;
  leveledUp: boolean;
  xpAwarded: number;
}

/**
 * Award XP to a kid profile and check for level-up.
 *
 * Updates the `xp` and `level` columns on the profiles table.
 */
export async function awardXP(
  supabase: SupabaseClient,
  profileId: string,
  action: XPAction,
): Promise<XPResult> {
  const xpAmount = XP_VALUES[action];

  // Fetch current XP
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, level")
    .eq("id", profileId)
    .single();

  if (!profile) {
    return {
      xp: 0,
      level: 1,
      levelName: LEVELS[0].name,
      leveledUp: false,
      xpAwarded: 0,
    };
  }

  const oldXP = (profile.xp as number) ?? 0;
  const oldLevel = (profile.level as number) ?? 1;
  const newXP = oldXP + xpAmount;

  // Calculate new level
  const newLevelInfo = getLevelForXP(newXP);
  const leveledUp = newLevelInfo.level > oldLevel;

  // Update the profile
  await supabase
    .from("profiles")
    .update({
      xp: newXP,
      level: newLevelInfo.level,
    })
    .eq("id", profileId);

  return {
    xp: newXP,
    level: newLevelInfo.level,
    levelName: newLevelInfo.name,
    leveledUp,
    xpAwarded: xpAmount,
  };
}
