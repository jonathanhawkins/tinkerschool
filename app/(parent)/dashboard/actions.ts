"use server";

import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { unstable_cache } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import type { Profile, Subject } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Weekly summary data types
// ---------------------------------------------------------------------------

interface WeeklyStats {
  kidName: string;
  lessonsCompleted: { title: string; subjectName: string; score: number }[];
  subjectsTouched: string[];
  avgScore: number;
  currentStreak: number;
  badgesEarned: string[];
}

// ---------------------------------------------------------------------------
// Helper: Get ISO week number for cache key
// ---------------------------------------------------------------------------

function getWeekNumber(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${d.getFullYear()}-W${weekNo}`;
}

// ---------------------------------------------------------------------------
// Gather weekly stats for a kid
// ---------------------------------------------------------------------------

async function gatherWeeklyStats(
  supabase: Awaited<ReturnType<typeof requireAuth>>["supabase"],
  kid: Profile,
  subjects: Subject[],
): Promise<WeeklyStats> {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);
  const weekStartIso = weekStart.toISOString();

  const subjectMap = new Map<string, string>();
  for (const s of subjects) {
    subjectMap.set(s.id, s.display_name);
  }

  // Fetch this week's completed lessons with titles and subjects
  const { data: weekProgress } = await supabase
    .from("progress")
    .select("*, lessons(title, subject_id)")
    .eq("profile_id", kid.id)
    .eq("status", "completed")
    .gte("completed_at", weekStartIso);

  type ProgressWithLesson = {
    lessons: { title: string; subject_id: string | null } | null;
  };
  const progressRows = (weekProgress ?? []) as ProgressWithLesson[];

  // Get lesson IDs to fetch activity session scores
  const lessonIds = progressRows
    .map((p) => p.lessons)
    .filter(Boolean)
    .map((_, i) => (weekProgress as { lesson_id: string }[])[i].lesson_id);

  // Fetch activity sessions for scores this week
  const { data: sessions } = lessonIds.length > 0
    ? await supabase
        .from("activity_sessions")
        .select("lesson_id, score")
        .eq("profile_id", kid.id)
        .in("lesson_id", lessonIds)
    : { data: [] };

  const scoreByLesson = new Map<string, number>();
  for (const s of (sessions ?? []) as { lesson_id: string; score: number }[]) {
    // Keep the best score per lesson
    const existing = scoreByLesson.get(s.lesson_id) ?? 0;
    if (s.score > existing) {
      scoreByLesson.set(s.lesson_id, s.score);
    }
  }

  // Build completed lessons list
  const lessonsCompleted: WeeklyStats["lessonsCompleted"] = [];
  const subjectsTouched = new Set<string>();

  for (let i = 0; i < progressRows.length; i++) {
    const p = progressRows[i];
    const lessonId = (weekProgress as { lesson_id: string }[])[i].lesson_id;
    if (p.lessons) {
      const subjectName = p.lessons.subject_id
        ? (subjectMap.get(p.lessons.subject_id) ?? "Unknown")
        : "Unknown";
      lessonsCompleted.push({
        title: p.lessons.title,
        subjectName,
        score: scoreByLesson.get(lessonId) ?? 0,
      });
      if (p.lessons.subject_id) {
        subjectsTouched.add(subjectName);
      }
    }
  }

  // Average score
  const scores = lessonsCompleted.map((l) => l.score).filter((s) => s > 0);
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  // Badges earned this week
  const { data: weekBadges } = await supabase
    .from("user_badges")
    .select("badges(name)")
    .eq("profile_id", kid.id)
    .gte("earned_at", weekStartIso);

  const badgesEarned = ((weekBadges ?? []) as { badges: { name: string } }[])
    .map((b) => b.badges.name);

  return {
    kidName: kid.display_name,
    lessonsCompleted,
    subjectsTouched: Array.from(subjectsTouched),
    avgScore,
    currentStreak: kid.current_streak ?? 0,
    badgesEarned,
  };
}

// ---------------------------------------------------------------------------
// Generate AI summary from stats
// ---------------------------------------------------------------------------

async function generateSummaryText(stats: WeeklyStats): Promise<string> {
  // Build a concise data block for the LLM
  const lessonList = stats.lessonsCompleted
    .map((l) => `- "${l.title}" (${l.subjectName}${l.score > 0 ? `, score: ${l.score}%` : ""})`)
    .join("\n");

  const dataBlock = [
    `Child's name: ${stats.kidName}`,
    `Lessons completed this week: ${stats.lessonsCompleted.length}`,
    lessonList ? `Lessons:\n${lessonList}` : "",
    `Subjects touched: ${stats.subjectsTouched.join(", ") || "none"}`,
    stats.avgScore > 0 ? `Average score: ${stats.avgScore}%` : "",
    `Current streak: ${stats.currentStreak} day${stats.currentStreak !== 1 ? "s" : ""}`,
    stats.badgesEarned.length > 0
      ? `Badges earned: ${stats.badgesEarned.join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const { text } = await generateText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system:
      "You are writing a brief weekly learning summary for a parent about their child's progress on TinkerSchool, an education platform. Write 3-4 warm, specific sentences. Mention specific lessons and subjects by name. Celebrate effort and consistency. Use the child's name. Keep it under 60 words.",
    prompt: dataBlock,
    maxOutputTokens: 150,
    temperature: 0.7,
  });

  return text.trim();
}

// ---------------------------------------------------------------------------
// Public API: get cached weekly summary for a kid
// ---------------------------------------------------------------------------

export interface WeeklySummaryResult {
  text: string;
  kidName: string;
  hasActivity: boolean;
}

const FALLBACK_MESSAGE =
  "Start learning this week and Chip will write a summary of your progress here!";

export async function getWeeklySummaries(): Promise<WeeklySummaryResult[]> {
  const { profile, supabase } = await requireAuth();

  // Fetch kid profiles in the family
  const { data: kidProfiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("family_id", profile.family_id)
    .eq("role", "kid");

  const kids = (kidProfiles ?? []) as Profile[];
  if (kids.length === 0) return [];

  // Fetch subjects for name lookup
  const { data: subjectsData } = await supabase
    .from("subjects")
    .select("id, display_name, color, icon, slug, name, sort_order");
  const subjects = (subjectsData ?? []) as Subject[];

  const weekNumber = getWeekNumber(new Date());

  // Generate summary for each kid (cached per kid per week)
  const results: WeeklySummaryResult[] = [];

  for (const kid of kids) {
    const cacheKey = `weekly-summary-${kid.id}-${weekNumber}`;

    const getCachedSummary = unstable_cache(
      async (): Promise<WeeklySummaryResult> => {
        try {
          const stats = await gatherWeeklyStats(supabase, kid, subjects);

          // No activity this week? Skip the API call
          if (stats.lessonsCompleted.length === 0) {
            return {
              text: FALLBACK_MESSAGE,
              kidName: kid.display_name,
              hasActivity: false,
            };
          }

          const text = await generateSummaryText(stats);
          return {
            text,
            kidName: kid.display_name,
            hasActivity: true,
          };
        } catch (error) {
          console.error(`[weekly-summary] Failed for kid ${kid.id}:`, error);
          return {
            text: FALLBACK_MESSAGE,
            kidName: kid.display_name,
            hasActivity: false,
          };
        }
      },
      [cacheKey],
      {
        revalidate: 86400, // 24 hours in seconds
        tags: [`weekly-summary-${kid.id}`],
      },
    );

    const summary = await getCachedSummary();
    results.push(summary);
  }

  return results;
}
