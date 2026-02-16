import { requireAuth, getActiveKidProfile } from "@/lib/auth/require-auth";
import type {
  Lesson,
  Module,
  Progress,
  Project,
  Subject,
} from "@/lib/supabase/types";
import { isInteractiveLesson } from "@/lib/activities/types";
import { safeColor } from "@/lib/utils";
import type { WelcomeData, WelcomeLessonItem } from "@/components/workshop-welcome";

import ChipChatWrapper from "./chip-chat-wrapper";
import { WorkshopContent } from "./workshop-content";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WorkshopPageProps {
  searchParams: Promise<{ lessonId?: string; projectId?: string }>;
}

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------

export default async function WorkshopPage({ searchParams }: WorkshopPageProps) {
  const { supabase, profile } = await requireAuth();
  const { lessonId, projectId } = await searchParams;

  // Fetch saved project if projectId is present — scoped to user's family
  let project: Project | null = null;
  if (projectId) {
    const { data } = (await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("family_id", profile.family_id)
      .single()) as { data: Project | null };
    project = data;
  }

  // Resolve the lesson: either from direct lessonId param, or from the project's linked lesson
  const effectiveLessonId = lessonId ?? project?.lesson_id ?? null;
  let lesson: Lesson | null = null;
  if (effectiveLessonId) {
    const { data } = (await supabase
      .from("lessons")
      .select("*")
      .eq("id", effectiveLessonId)
      .single()) as { data: Lesson | null };
    lesson = data;
  }

  // Build the serialisable lesson data for the client component.
  // If we have a saved project, use its blocks_xml instead of the lesson's starter blocks.
  const lessonData = lesson
    ? {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        storyText: lesson.story_text,
        starterBlocksXml: project?.blocks_xml ?? lesson.starter_blocks_xml,
        solutionCode: lesson.solution_code,
        hints: lesson.hints ?? [],
      }
    : project
      ? {
          id: "",
          title: project.title,
          description: "",
          storyText: null,
          starterBlocksXml: project.blocks_xml,
          solutionCode: null,
          hints: [],
        }
      : null;

  // -------------------------------------------------------------------------
  // Welcome data — fetched only when no lesson or project is being opened
  // -------------------------------------------------------------------------

  let welcomeData: WelcomeData | null = null;

  if (!lessonData) {
    const kidProfile = await getActiveKidProfile(profile, supabase);
    const activeProfile = kidProfile ?? profile;
    const band = activeProfile.current_band;

    // Parallel fetches
    const [subjectsRes, modulesRes, progressRes, projectsRes] =
      await Promise.all([
        supabase.from("subjects").select("*").order("sort_order"),
        supabase.from("modules").select("*").eq("band", band),
        supabase
          .from("progress")
          .select("*")
          .eq("profile_id", activeProfile.id),
        supabase
          .from("projects")
          .select("*")
          .eq("profile_id", activeProfile.id)
          .order("updated_at", { ascending: false })
          .limit(5),
      ]);

    const subjects = (subjectsRes.data as Subject[] | null) ?? [];
    const modules = (modulesRes.data as Module[] | null) ?? [];
    const progressRows = (progressRes.data as Progress[] | null) ?? [];
    const recentProjects = (projectsRes.data as Project[] | null) ?? [];

    // Fetch lessons for these modules
    const moduleIds = modules.map((m) => m.id);
    let allLessons: Lesson[] = [];
    if (moduleIds.length > 0) {
      const { data } = await supabase
        .from("lessons")
        .select("*")
        .in("module_id", moduleIds)
        .order("order_num");
      allLessons = (data as Lesson[] | null) ?? [];
    }

    // Build lookup maps
    const subjectMap = new Map(subjects.map((s) => [s.id, s]));
    const progressMap = new Map(progressRows.map((p) => [p.lesson_id, p]));

    // Filter to workshop-appropriate lessons (have starter_blocks_xml or are coding subject)
    // Exclude interactive-only lessons (math counting, reading matching, etc.)
    const codingSubject = subjects.find((s) => s.slug === "coding");
    const workshopLessons = allLessons.filter((l) => {
      // Skip interactive-only lessons — they belong on the lesson page
      if (isInteractiveLesson(l.lesson_type, l.content)) return false;
      // Keep lessons with starter blocks
      if (l.starter_blocks_xml) return true;
      // Keep coding-subject lessons
      if (codingSubject && l.subject_id === codingSubject.id) return true;
      return false;
    });

    // Map to WelcomeLessonItem
    function toLessonItem(l: Lesson): WelcomeLessonItem {
      const subject = l.subject_id ? subjectMap.get(l.subject_id) : null;
      const prog = progressMap.get(l.id);
      return {
        id: l.id,
        title: l.title,
        description: l.description,
        estimatedMinutes: l.estimated_minutes,
        subjectSlug: subject?.slug ?? null,
        subjectName: subject?.display_name ?? null,
        subjectColor: subject ? safeColor(subject.color) : null,
        subjectIcon: subject?.icon ?? null,
        status: prog?.status === "in_progress" ? "in_progress" : "not_started",
      };
    }

    const continueItems = workshopLessons
      .filter((l) => progressMap.get(l.id)?.status === "in_progress")
      .map(toLessonItem);

    const completedIds = new Set(
      progressRows
        .filter((p) => p.status === "completed")
        .map((p) => p.lesson_id),
    );
    const inProgressIds = new Set(
      progressRows
        .filter((p) => p.status === "in_progress")
        .map((p) => p.lesson_id),
    );

    const suggestedItems = workshopLessons
      .filter(
        (l) => !completedIds.has(l.id) && !inProgressIds.has(l.id),
      )
      .slice(0, 6)
      .map(toLessonItem);

    welcomeData = {
      kidName: activeProfile.display_name,
      continueItems,
      suggestedItems,
      recentProjects: recentProjects.map((p) => ({
        id: p.id,
        title: p.title,
        updatedAt: p.updated_at,
      })),
    };
  }

  return (
    <WorkshopContent
      lesson={lessonData}
      welcomeData={welcomeData}
      chatPanel={
        <ChipChatWrapper
          currentLesson={lesson?.title}
          currentCode={undefined}
        />
      }
    />
  );
}
