import { createServerSupabaseClient } from "@/lib/supabase/server";
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
// Data fetching
// ---------------------------------------------------------------------------

async function getLesson(lessonId: string): Promise<Lesson | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  return data;
}

async function getProject(projectId: string): Promise<Project | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  return data;
}

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------

export default async function WorkshopPage({ searchParams }: WorkshopPageProps) {
  const { lessonId, projectId } = await searchParams;

  // Fetch saved project if projectId is present
  const project = projectId ? await getProject(projectId) : null;

  // Resolve the lesson: either from direct lessonId param, or from the project's linked lesson
  const effectiveLessonId = lessonId ?? project?.lesson_id ?? null;
  const lesson = effectiveLessonId ? await getLesson(effectiveLessonId) : null;

  // Build the serialisable lesson data for the client component.
  // If we have a saved project, use its blocks_xml instead of the lesson's starter blocks.
  const lessonData = lesson
    ? {
        id: lesson.id,
        title: lesson.title,
        storyText: lesson.story_text,
        starterBlocksXml: project?.blocks_xml ?? lesson.starter_blocks_xml,
      }
    : project
      ? {
          id: "",
          title: project.title,
          storyText: null,
          starterBlocksXml: project.blocks_xml,
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
