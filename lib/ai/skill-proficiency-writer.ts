/**
 * Skill Proficiency Writer
 *
 * After every activity completion, computes skill proficiency levels
 * from the activity results and upserts them into skill_proficiencies.
 *
 * Levels are never downgraded — only promoted when evidence warrants.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, SkillLevel } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActivityResult {
  score: number;
  hintsUsed: number;
  correctFirstTry: number;
  totalQuestions: number;
}

interface ExistingProficiency {
  id: string;
  level: SkillLevel;
  attempts: number;
  correct: number;
}

// ---------------------------------------------------------------------------
// Level ordering (higher = better, used for never-downgrade logic)
// ---------------------------------------------------------------------------

const LEVEL_ORDER: Record<SkillLevel, number> = {
  not_started: 0,
  beginning: 1,
  developing: 2,
  proficient: 3,
  mastered: 4,
};

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

/**
 * Compute the proficiency level from a single activity result.
 *
 * - mastered:    score >= 85, 0 hints, >= 80% first-try correct
 * - proficient:  score >= 70, <= 1 hint
 * - developing:  score >= 50
 * - beginning:   score < 50
 */
export function computeLevel(result: ActivityResult): SkillLevel {
  const firstTryRate =
    result.totalQuestions > 0
      ? result.correctFirstTry / result.totalQuestions
      : 0;

  if (result.score >= 85 && result.hintsUsed === 0 && firstTryRate >= 0.8) {
    return "mastered";
  }
  if (result.score >= 70 && result.hintsUsed <= 1) {
    return "proficient";
  }
  if (result.score >= 50) {
    return "developing";
  }
  return "beginning";
}

/**
 * Upsert skill proficiency records for all skills covered by a lesson.
 *
 * - Fetches the lesson's `skills_covered` UUID array
 * - For each skill, upserts into `skill_proficiencies` with the computed level
 * - Never downgrades — compares against existing level
 * - Increments `attempts` and `correct` counts
 *
 * Uses the admin client (bypasses RLS) since this runs in a fire-and-forget
 * context from a server action.
 */
export async function updateSkillProficiency(
  supabase: SupabaseClient<Database>,
  profileId: string,
  lessonId: string,
  result: ActivityResult,
): Promise<void> {
  // 1. Fetch lesson's skills_covered
  const { data: lesson, error: lessonError } = (await supabase
    .from("lessons")
    .select("skills_covered")
    .eq("id", lessonId)
    .single()) as { data: { skills_covered: string[] } | null; error: unknown };

  if (lessonError) {
    console.error("[skill-proficiency] Failed to fetch lesson:", lessonError);
    return;
  }

  const skillIds = lesson?.skills_covered;
  if (!skillIds || skillIds.length === 0) {
    return;
  }

  const newLevel = computeLevel(result);
  const newLevelOrder = LEVEL_ORDER[newLevel];
  const passed = result.score >= 60;
  const now = new Date().toISOString();

  // 2. Fetch existing proficiency rows for these skills
  const { data: existingRows, error: fetchError } = (await supabase
    .from("skill_proficiencies")
    .select("id, skill_id, level, attempts, correct")
    .eq("profile_id", profileId)
    .in("skill_id", skillIds)) as {
    data: (ExistingProficiency & { skill_id: string })[] | null;
    error: unknown;
  };

  if (fetchError) {
    console.error("[skill-proficiency] Failed to fetch existing rows:", fetchError);
    return;
  }

  const existingMap = new Map<string, ExistingProficiency & { skill_id: string }>();
  if (existingRows) {
    for (const row of existingRows) {
      existingMap.set(row.skill_id, row);
    }
  }

  // 3. Upsert each skill
  await upsertSkillProficiencies(supabase, profileId, skillIds, result);
}

/**
 * Update skill proficiency given skill IDs directly (no lesson lookup).
 * Used by daily adventures which store skill_ids on the adventure row
 * rather than looking them up from a lesson.
 *
 * Same core logic as updateSkillProficiency: compute level, never-downgrade,
 * upsert into skill_proficiencies.
 */
export async function updateSkillProficiencyDirect(
  supabase: SupabaseClient<Database>,
  profileId: string,
  skillIds: string[],
  result: ActivityResult,
): Promise<void> {
  if (skillIds.length === 0) return;
  await upsertSkillProficiencies(supabase, profileId, skillIds, result);
}

// ---------------------------------------------------------------------------
// Shared upsert logic
// ---------------------------------------------------------------------------

async function upsertSkillProficiencies(
  supabase: SupabaseClient<Database>,
  profileId: string,
  skillIds: string[],
  result: ActivityResult,
): Promise<void> {
  const newLevel = computeLevel(result);
  const newLevelOrder = LEVEL_ORDER[newLevel];
  const passed = result.score >= 60;
  const now = new Date().toISOString();

  const { data: existingRows, error: fetchError } = (await supabase
    .from("skill_proficiencies")
    .select("id, skill_id, level, attempts, correct")
    .eq("profile_id", profileId)
    .in("skill_id", skillIds)) as {
    data: (ExistingProficiency & { skill_id: string })[] | null;
    error: unknown;
  };

  if (fetchError) {
    console.error("[skill-proficiency] Failed to fetch existing rows:", fetchError);
    return;
  }

  const existingMap = new Map<string, ExistingProficiency & { skill_id: string }>();
  if (existingRows) {
    for (const row of existingRows) {
      existingMap.set(row.skill_id, row);
    }
  }

  for (const skillId of skillIds) {
    const existing = existingMap.get(skillId);

    if (existing) {
      const existingOrder = LEVEL_ORDER[existing.level];
      const effectiveLevel =
        newLevelOrder > existingOrder ? newLevel : existing.level;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("skill_proficiencies") as any)
        .update({
          level: effectiveLevel,
          attempts: existing.attempts + 1,
          correct: existing.correct + (passed ? 1 : 0),
          last_practiced: now,
          updated_at: now,
        })
        .eq("id", existing.id);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("skill_proficiencies") as any).insert({
        profile_id: profileId,
        skill_id: skillId,
        level: newLevel,
        attempts: 1,
        correct: passed ? 1 : 0,
        last_practiced: now,
      });
    }
  }
}
