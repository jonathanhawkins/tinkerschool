import type { SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Adaptive Difficulty System
// ---------------------------------------------------------------------------
// Analyzes a student's past activity_sessions for a given subject and
// computes a difficulty adjustment. The lesson page calls this server-side
// before passing the config to the InteractiveLesson client component.
//
// Pre-K Philosophy (band 0, ages 3-5):
// All Pre-K children should feel successful. At this age, the goal is
// exposure and positive association with learning -- not mastery-based
// progression. Thresholds are much more forgiving, time pressure is
// removed entirely, and the system requires more sessions before
// advancing to harder content. Hints are always shown proactively.
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

// ---------------------------------------------------------------------------
// Band-specific threshold configuration
// ---------------------------------------------------------------------------

interface DifficultyThresholds {
  /** Minimum sessions before the system can recommend "challenge" */
  minSessionsForChallenge: number;
  /** Avg score above this → challenge */
  challengeScoreThreshold: number;
  /** Avg score below this → supportive */
  supportiveScoreThreshold: number;
  /** Hint usage rate above this → more supportive */
  highHintRate: number;
  /** Whether to factor in time-per-question */
  useTimePenalty: boolean;
  /** Passing scores for each tier */
  passingScores: Record<DifficultyLevel, number>;
}

/**
 * Default thresholds for Band 1+ (K-6, ages 5-12).
 */
const DEFAULT_THRESHOLDS: DifficultyThresholds = {
  minSessionsForChallenge: 1,
  challengeScoreThreshold: 85,
  supportiveScoreThreshold: 50,
  highHintRate: 0.5,
  useTimePenalty: true,
  passingScores: { supportive: 50, standard: 60, challenge: 70 },
};

/**
 * Pre-K thresholds (Band 0, ages 3-5).
 *
 * Much more forgiving: lower bars for "standard" and "challenge", slower
 * progression (need 8+ sessions before any challenge bump), no time
 * penalties, and a very generous hint-rate tolerance. The supportive
 * passing score of 30 means virtually every child can "pass" and
 * feel good about their effort.
 */
const PREK_THRESHOLDS: DifficultyThresholds = {
  minSessionsForChallenge: 8,
  challengeScoreThreshold: 90,
  supportiveScoreThreshold: 35,
  highHintRate: 0.75,
  useTimePenalty: false,
  passingScores: { supportive: 30, standard: 40, challenge: 50 },
};

/** Look up thresholds by band number. Band 0 = Pre-K, everything else = default. */
function getThresholds(band: number): DifficultyThresholds {
  return band === 0 ? PREK_THRESHOLDS : DEFAULT_THRESHOLDS;
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

/**
 * Compute difficulty adjustments based on a student's past performance.
 *
 * Runs server-side in the lesson page before passing config to the client.
 *
 * @param band - The student's curriculum band (0 = Pre-K, 1-5 = K-6). When
 *   provided, band-specific thresholds are used. Pre-K (band 0) uses much
 *   more forgiving thresholds so every child feels successful.
 */
export async function computeDifficulty(
  supabase: SupabaseClient,
  profileId: string,
  subjectId: string | null,
  band?: number,
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

  const thresholds = getThresholds(band ?? 1);

  // Pre-K default: always show hints early and use a lower passing score
  if (error || !sessions || sessions.length === 0) {
    if (band === 0) {
      return {
        ...DEFAULT_ADJUSTMENT,
        passingScore: thresholds.passingScores.standard,
        showHintsEarly: true,
        encouragementMessage:
          "You are doing amazing! Let's play and learn together!",
      };
    }
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

  // Average time per question (ignored for Pre-K)
  const totalTime = sessions.reduce(
    (sum: number, s: { time_seconds: number }) => sum + (s.time_seconds ?? 0),
    0,
  );
  const avgTimePerQuestion =
    totalQuestions > 0 ? totalTime / totalQuestions : 0;

  // Classify difficulty using band-appropriate thresholds
  const level = classifyDifficulty(
    avgScore,
    hintRate,
    avgTimePerQuestion,
    sessions.length,
    thresholds,
  );

  return {
    level,
    passingScore: thresholds.passingScores[level],
    encouragementMessage: getEncouragementMessage(level, avgScore, band ?? 1),
    // Pre-K always shows hints early; for other bands, only in supportive mode
    showHintsEarly: band === 0 || level === "supportive",
    recentAverageScore: Math.round(avgScore),
    sessionsAnalyzed: sessions.length,
  };
}

function classifyDifficulty(
  avgScore: number,
  hintRate: number,
  _avgTimePerQuestion: number,
  sessionCount: number,
  thresholds: DifficultyThresholds,
): DifficultyLevel {
  // Strong performance → challenge mode (only if enough sessions observed)
  if (
    avgScore >= thresholds.challengeScoreThreshold &&
    hintRate < 0.2 &&
    sessionCount >= thresholds.minSessionsForChallenge
  ) {
    return "challenge";
  }

  // Struggling → supportive mode
  if (
    avgScore < thresholds.supportiveScoreThreshold ||
    hintRate > thresholds.highHintRate
  ) {
    return "supportive";
  }

  return "standard";
}

function getEncouragementMessage(
  level: DifficultyLevel,
  avgScore: number,
  band: number,
): string {
  // Pre-K gets warmer, simpler encouragement messages
  if (band === 0) {
    switch (level) {
      case "supportive":
        return "You are doing so great just by trying! Let's play some more!";
      case "challenge":
        return "Wow, you are a superstar! Let's try something a little trickier!";
      case "standard":
        return "You are doing amazing! Let's play and learn together!";
    }
  }

  switch (level) {
    case "supportive":
      return "Take your time -- I'll give you extra hints if you need them! You're doing great just by trying.";
    case "challenge":
      return `Wow, you've been scoring ${Math.round(avgScore)}% lately! Let's see if we can challenge you a bit more!`;
    case "standard":
      return "Let's do this, friend! I'm right here if you need help.";
  }
}
