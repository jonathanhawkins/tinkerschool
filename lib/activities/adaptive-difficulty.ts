import type { SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Adaptive Difficulty System
// ---------------------------------------------------------------------------
// Analyzes a student's past activity_sessions for a given subject and
// computes a difficulty adjustment. The lesson page calls this server-side
// before passing the config to the InteractiveLesson client component.
// ---------------------------------------------------------------------------

export type DifficultyLevel = "supportive" | "standard" | "challenge";

export interface DifficultyAdjustment {
  /** The computed difficulty level */
  level: DifficultyLevel;
  /** Adjusted passing score (0-100) */
  passingScore: number;
  /** Chip encouragement message tailored to the level */
  encouragementMessage: string;
  /** Whether to reveal hints proactively */
  showHintsEarly: boolean;
  /** Average score from recent sessions (for display) */
  recentAverageScore: number | null;
  /** Number of sessions analyzed */
  sessionsAnalyzed: number;
}

const DEFAULT_ADJUSTMENT: DifficultyAdjustment = {
  level: "standard",
  passingScore: 60,
  encouragementMessage:
    "Let's do this, friend! I'm right here if you need help.",
  showHintsEarly: false,
  recentAverageScore: null,
  sessionsAnalyzed: 0,
};

/** How many recent sessions to consider */
const LOOKBACK_COUNT = 10;

/** Thresholds for difficulty classification */
const CHALLENGE_SCORE_THRESHOLD = 85; // avg score above this → challenge
const SUPPORTIVE_SCORE_THRESHOLD = 50; // avg score below this → supportive
const HIGH_HINT_RATE = 0.5; // >50% of questions used hints → more supportive

/**
 * Compute difficulty adjustments based on a student's past performance.
 *
 * Runs server-side in the lesson page before passing config to the client.
 */
export async function computeDifficulty(
  supabase: SupabaseClient,
  profileId: string,
  subjectId: string | null,
): Promise<DifficultyAdjustment> {
  // Build query for recent sessions
  let query = supabase
    .from("activity_sessions")
    .select("score, hints_used, total_questions, time_seconds, created_at")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(LOOKBACK_COUNT);

  // If we have a subject, filter by lessons + adventures in that subject
  if (subjectId) {
    // Get lesson IDs for this subject
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("subject_id", subjectId);

    // Also get adventure IDs for this subject
    const { data: adventures } = await supabase
      .from("daily_adventures")
      .select("id")
      .eq("profile_id", profileId)
      .eq("subject_id", subjectId);

    const lessonIds = (lessons ?? []).map((l: { id: string }) => l.id);
    const adventureIds = (adventures ?? []).map((a: { id: string }) => a.id);

    // Filter sessions that are linked to either lessons or adventures in this subject
    if (lessonIds.length > 0 && adventureIds.length > 0) {
      query = query.or(
        `lesson_id.in.(${lessonIds.join(",")}),adventure_id.in.(${adventureIds.join(",")})`,
      );
    } else if (lessonIds.length > 0) {
      query = query.in("lesson_id", lessonIds);
    } else if (adventureIds.length > 0) {
      query = query.in("adventure_id", adventureIds);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sessions, error } = await (query as any);

  if (error || !sessions || sessions.length === 0) {
    return DEFAULT_ADJUSTMENT;
  }

  // Compute metrics
  const scores = sessions.map((s: { score: number }) => s.score);
  const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;

  // Hint usage rate: total hints / total questions across sessions
  const totalHints = sessions.reduce(
    (sum: number, s: { hints_used: number }) => sum + (s.hints_used ?? 0),
    0,
  );
  const totalQuestions = sessions.reduce(
    (sum: number, s: { total_questions: number }) =>
      sum + (s.total_questions ?? 0),
    0,
  );
  const hintRate = totalQuestions > 0 ? totalHints / totalQuestions : 0;

  // Average time per question
  const totalTime = sessions.reduce(
    (sum: number, s: { time_seconds: number }) => sum + (s.time_seconds ?? 0),
    0,
  );
  const avgTimePerQuestion =
    totalQuestions > 0 ? totalTime / totalQuestions : 0;

  // Classify difficulty
  const level = classifyDifficulty(avgScore, hintRate, avgTimePerQuestion);

  return {
    level,
    passingScore: getPassingScore(level),
    encouragementMessage: getEncouragementMessage(level, avgScore),
    showHintsEarly: level === "supportive",
    recentAverageScore: Math.round(avgScore),
    sessionsAnalyzed: sessions.length,
  };
}

function classifyDifficulty(
  avgScore: number,
  hintRate: number,
  _avgTimePerQuestion: number,
): DifficultyLevel {
  // Strong performance → challenge mode
  if (avgScore >= CHALLENGE_SCORE_THRESHOLD && hintRate < 0.2) {
    return "challenge";
  }

  // Struggling → supportive mode
  if (avgScore < SUPPORTIVE_SCORE_THRESHOLD || hintRate > HIGH_HINT_RATE) {
    return "supportive";
  }

  return "standard";
}

function getPassingScore(level: DifficultyLevel): number {
  switch (level) {
    case "supportive":
      return 50; // Lower bar so struggling kids can still progress
    case "standard":
      return 60;
    case "challenge":
      return 70; // Higher bar for kids who are excelling
  }
}

function getEncouragementMessage(
  level: DifficultyLevel,
  avgScore: number,
): string {
  switch (level) {
    case "supportive":
      return "Take your time -- I'll give you extra hints if you need them! You're doing great just by trying.";
    case "challenge":
      return `Wow, you've been scoring ${Math.round(avgScore)}% lately! Let's see if we can challenge you a bit more!`;
    case "standard":
      return "Let's do this, friend! I'm right here if you need help.";
  }
}
