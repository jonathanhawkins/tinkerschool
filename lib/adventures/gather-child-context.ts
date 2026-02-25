/**
 * Child Context Gatherer
 *
 * Collects all relevant data about a child for AI adventure generation:
 * profile, learning profile, skill proficiencies, recent sessions, and
 * recent adventures (for subject rotation).
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, SkillLevel, SubjectSlug } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SkillInfo {
  skillId: string;
  skillName: string;
  subjectId: string;
  subjectName: string;
  subjectSlug: SubjectSlug;
  level: SkillLevel;
  attempts: number;
  lastPracticed: string | null;
}

export interface RecentSession {
  score: number;
  hintsUsed: number;
  correctFirstTry: number;
  totalQuestions: number;
  timeSeconds: number;
  subjectId: string | null;
  createdAt: string;
}

export interface ChildContext {
  profileId: string;
  displayName: string;
  gradeLevel: number | null;
  currentBand: number;

  /** Learning preferences */
  learningStyle: Record<string, number>;
  interests: string[];
  chipNotes: string | null;

  /** All skill proficiencies (joined with skill + subject data) */
  skills: SkillInfo[];
  /** Skills at "beginning" or "not_started" level */
  weakSkills: SkillInfo[];
  /** Skills not practiced in 7+ days */
  staleSkills: SkillInfo[];

  /** Recent activity sessions (last 10) */
  recentSessions: RecentSession[];

  /** Subject IDs used in recent adventures (last 7 days, for rotation) */
  recentAdventureSubjectIds: string[];

  /** All available subjects */
  subjects: Array<{
    id: string;
    slug: SubjectSlug;
    displayName: string;
    color: string;
  }>;
}

// ---------------------------------------------------------------------------
// Row types for query results
// ---------------------------------------------------------------------------

interface ProfileRow {
  id: string;
  display_name: string;
  grade_level: number | null;
  current_band: number;
}

interface LearningProfileRow {
  learning_style: Record<string, number>;
  interests: string[];
  chip_notes: string | null;
}

interface SkillProficiencyRow {
  skill_id: string;
  level: SkillLevel;
  attempts: number;
  last_practiced: string | null;
  skills: {
    id: string;
    name: string;
    subject_id: string;
    subjects: {
      id: string;
      slug: SubjectSlug;
      display_name: string;
    } | null;
  } | null;
}

interface ActivitySessionRow {
  score: number;
  hints_used: number;
  correct_first_try: number;
  total_questions: number;
  time_seconds: number;
  created_at: string;
  lesson_id: string | null;
}

interface RecentAdventureRow {
  subject_id: string;
}

interface SubjectRow {
  id: string;
  slug: SubjectSlug;
  display_name: string;
  color: string;
}

// ---------------------------------------------------------------------------
// Core function
// ---------------------------------------------------------------------------

/**
 * Gather all context about a child needed for adventure generation.
 * All queries run in parallel for performance.
 */
export async function gatherChildContext(
  supabase: SupabaseClient<Database>,
  profileId: string,
): Promise<ChildContext | null> {
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const [
    profileResult,
    learningProfileResult,
    skillsResult,
    sessionsResult,
    adventuresResult,
    subjectsResult,
  ] = await Promise.all([
    // Profile
    supabase
      .from("profiles")
      .select("id, display_name, grade_level, current_band")
      .eq("id", profileId)
      .single() as unknown as Promise<{ data: ProfileRow | null; error: unknown }>,

    // Learning profile
    supabase
      .from("learning_profiles")
      .select("learning_style, interests, chip_notes")
      .eq("profile_id", profileId)
      .single() as unknown as Promise<{ data: LearningProfileRow | null; error: unknown }>,

    // Skill proficiencies with skill + subject joins
    supabase
      .from("skill_proficiencies")
      .select("skill_id, level, attempts, last_practiced, skills(id, name, subject_id, subjects(id, slug, display_name))")
      .eq("profile_id", profileId) as unknown as Promise<{ data: SkillProficiencyRow[] | null; error: unknown }>,

    // Recent activity sessions (last 10)
    supabase
      .from("activity_sessions")
      .select("score, hints_used, correct_first_try, total_questions, time_seconds, created_at, lesson_id")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(10) as unknown as Promise<{ data: ActivitySessionRow[] | null; error: unknown }>,

    // Recent adventures (last 7 days, for subject rotation)
    supabase
      .from("daily_adventures")
      .select("subject_id")
      .eq("profile_id", profileId)
      .gte("generated_at", sevenDaysAgo)
      .order("generated_at", { ascending: false }) as unknown as Promise<{ data: RecentAdventureRow[] | null; error: unknown }>,

    // All subjects
    supabase
      .from("subjects")
      .select("id, slug, display_name, color")
      .order("sort_order") as unknown as Promise<{ data: SubjectRow[] | null; error: unknown }>,
  ]);

  const profile = profileResult.data;
  if (!profile) return null;

  const learningProfile = learningProfileResult.data;
  const skillRows = skillsResult.data ?? [];
  const sessionRows = sessionsResult.data ?? [];
  const adventureRows = adventuresResult.data ?? [];
  const subjectRows = subjectsResult.data ?? [];

  // Map skill proficiency rows to SkillInfo
  const skills: SkillInfo[] = skillRows
    .filter((row) => row.skills?.subjects)
    .map((row) => ({
      skillId: row.skill_id,
      skillName: row.skills!.name,
      subjectId: row.skills!.subject_id,
      subjectName: row.skills!.subjects!.display_name,
      subjectSlug: row.skills!.subjects!.slug,
      level: row.level,
      attempts: row.attempts,
      lastPracticed: row.last_practiced,
    }));

  // Weak skills: beginning or not_started
  const weakSkills = skills.filter(
    (s) => s.level === "beginning" || s.level === "not_started",
  );

  // Stale skills: not practiced in 7+ days
  const staleSkills = skills.filter(
    (s) => s.lastPracticed && s.lastPracticed < sevenDaysAgo,
  );

  // Map sessions
  const recentSessions: RecentSession[] = sessionRows.map((s) => ({
    score: s.score,
    hintsUsed: s.hints_used,
    correctFirstTry: s.correct_first_try,
    totalQuestions: s.total_questions,
    timeSeconds: s.time_seconds,
    subjectId: null, // Would need a join to get subject_id from lessons
    createdAt: s.created_at,
  }));

  return {
    profileId: profile.id,
    displayName: profile.display_name,
    gradeLevel: profile.grade_level,
    currentBand: profile.current_band,
    learningStyle: learningProfile?.learning_style ?? {},
    interests: learningProfile?.interests ?? [],
    chipNotes: learningProfile?.chip_notes ?? null,
    skills,
    weakSkills,
    staleSkills,
    recentSessions,
    recentAdventureSubjectIds: adventureRows.map((a) => a.subject_id),
    subjects: subjectRows.map((s) => ({
      id: s.id,
      slug: s.slug,
      displayName: s.display_name,
      color: s.color,
    })),
  };
}
