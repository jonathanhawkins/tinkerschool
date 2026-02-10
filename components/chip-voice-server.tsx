import { requireAuth } from "@/lib/auth/require-auth";
import { getHumeAccessToken } from "@/lib/hume/access-token";
import type { VoicePageContext } from "@/lib/hume/types";
import type { Profile, Subject, Lesson, Progress } from "@/lib/supabase/types";

import ChipVoiceFabWrapper from "./chip-voice-fab-wrapper";

// ---------------------------------------------------------------------------
// Server component — fetches access token + page context, renders FAB
// ---------------------------------------------------------------------------

export default async function ChipVoiceServer() {
  const accessToken = await getHumeAccessToken();
  if (!accessToken) return null;

  const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID;
  const pageContext = await fetchVoicePageContext();

  return (
    <ChipVoiceFabWrapper
      accessToken={accessToken}
      configId={configId}
      pageContext={pageContext}
    />
  );
}

// ---------------------------------------------------------------------------
// Server-side data fetching for FAB page context
// ---------------------------------------------------------------------------

async function fetchVoicePageContext(): Promise<VoicePageContext> {
  const defaults: VoicePageContext = {
    childName: "friend",
    age: 7,
    gradeLevel: 1,
    currentStreak: 0,
    xp: 0,
    deviceMode: "none",
    subjects: [],
    completedLessonCount: 0,
  };

  try {
    const { profile, supabase } = await requireAuth();

    // Chip talks to the kid, not the parent. If the logged-in user is a
    // parent, find the first kid profile in the same family.
    let kidProfile = profile;
    if (profile.role === "parent") {
      const { data: kids } = await supabase
        .from("profiles")
        .select("*")
        .eq("family_id", profile.family_id)
        .eq("role", "kid")
        .order("created_at")
        .limit(1);
      const firstKid = (kids as Profile[] | null)?.[0];
      if (firstKid) kidProfile = firstKid;
    }

    // Parallel queries: subjects + progress
    const [subjectsResult, progressResult] = await Promise.all([
      supabase.from("subjects").select("*").order("sort_order"),
      supabase.from("progress").select("*").eq("profile_id", kidProfile.id),
    ]);

    const safeSubjects = (subjectsResult.data as Subject[] | null) ?? [];
    const subjects = safeSubjects.map((s) => ({
      name: s.display_name,
      slug: s.slug,
    }));

    const progressRows = (progressResult.data as Progress[] | null) ?? [];
    const completedLessonCount = progressRows.filter(
      (p) => p.status === "completed",
    ).length;

    // Find most recent in-progress lesson
    const inProgressEntries = progressRows
      .filter((p) => p.status === "in_progress" && p.started_at)
      .sort(
        (a, b) =>
          new Date(b.started_at!).getTime() - new Date(a.started_at!).getTime(),
      );

    const topEntry = inProgressEntries[0];

    // Only fetch the single lesson we need (instead of ALL lessons)
    let inProgressLesson: { title: string; subject: string; id: string } | undefined;
    if (topEntry?.lesson_id) {
      const { data: lessonData } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", topEntry.lesson_id)
        .single();
      const matchedLesson = lessonData as Lesson | null;

      if (matchedLesson) {
        const lessonSubject = matchedLesson.subject_id
          ? safeSubjects.find((s) => s.id === matchedLesson.subject_id)
          : undefined;

        inProgressLesson = {
          title: matchedLesson.title,
          subject: lessonSubject?.display_name ?? "a subject",
          id: matchedLesson.id,
        };
      }
    }

    // Map age from grade_level (approximate: grade 1 ≈ age 6-7)
    const gradeLevel = kidProfile.grade_level ?? 1;
    const age = gradeLevel + 5;

    return {
      childName: kidProfile.display_name,
      age,
      gradeLevel,
      currentStreak: kidProfile.current_streak,
      xp: kidProfile.xp ?? 0,
      deviceMode: kidProfile.device_mode,
      inProgressLesson,
      subjects,
      completedLessonCount,
    };
  } catch {
    // Auth might fail (e.g., during static generation). Return safe defaults.
    return defaults;
  }
}
