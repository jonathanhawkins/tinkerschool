import { requireAuth } from "@/lib/auth/require-auth";
import type { Lesson, Project } from "@/lib/supabase/types";

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

  return (
    <WorkshopContent
      lesson={lessonData}
      chatPanel={
        <ChipChatWrapper
          currentLesson={lesson?.title}
          currentCode={undefined}
        />
      }
    />
  );
}
