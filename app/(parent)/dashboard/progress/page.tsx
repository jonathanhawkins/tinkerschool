import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/require-auth";
import { FadeIn } from "@/components/motion";
import { safeColor } from "@/lib/utils";
import type {
  Profile,
  Module,
  Lesson,
  Progress as ProgressRow,
  Subject,
  ProgressStatus,
} from "@/lib/supabase/types";
import { ProgressExplorer } from "./progress-explorer";

export const metadata: Metadata = {
  title: "Learning Progress",
  robots: { index: false, follow: false },
};

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ kid?: string }>;
}) {
  const { profile, supabase } = await requireAuth();
  const { kid: selectedKidId } = await searchParams;

  // Fetch kid profiles in the family
  const { data: kidProfiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("family_id", profile.family_id)
    .eq("role", "kid");

  const allKids = (kidProfiles ?? []) as Profile[];
  const allKidIds = new Set(allKids.map((k) => k.id));

  // Filter to selected kid if the param is valid, otherwise show all
  const kids =
    selectedKidId && allKidIds.has(selectedKidId)
      ? allKids.filter((k) => k.id === selectedKidId)
      : allKids;
  const kidIds = kids.map((k) => k.id);

  // Fetch subjects, modules, lessons, and progress in parallel
  const [subjectsResult, modulesResult, lessonsResult, progressResult] =
    await Promise.all([
      supabase.from("subjects").select("*").order("sort_order"),
      supabase.from("modules").select("*").order("band").order("order_num"),
      supabase.from("lessons").select("*").order("order_num"),
      kidIds.length > 0
        ? supabase.from("progress").select("*").in("profile_id", kidIds)
        : Promise.resolve({ data: [] }),
    ]);

  const subjects = ((subjectsResult.data ?? []) as Subject[]).map((s) => ({
    ...s,
    color: safeColor(s.color),
  }));
  const modules = (modulesResult.data ?? []) as Module[];
  const lessons = (lessonsResult.data ?? []) as Lesson[];
  const progress = (progressResult.data ?? []) as ProgressRow[];

  // Group lessons by module
  const lessonsByModule = new Map<string, Lesson[]>();
  for (const lesson of lessons) {
    const group = lessonsByModule.get(lesson.module_id) ?? [];
    group.push(lesson);
    lessonsByModule.set(lesson.module_id, group);
  }

  // Index progress by lesson_id (take the most advanced status if multiple kids)
  const progressByLesson = new Map<string, ProgressRow>();
  for (const p of progress) {
    const existing = progressByLesson.get(p.lesson_id);
    if (!existing || statusRank(p.status) > statusRank(existing.status)) {
      progressByLesson.set(p.lesson_id, p);
    }
  }

  // Shape subjects for the client component
  const subjectData = subjects.map((s) => ({
    id: s.id,
    display_name: s.display_name,
    color: s.color,
    slug: s.slug,
    icon: s.icon,
  }));

  // Shape modules + lessons with progress for the client component
  const moduleData = modules.map((mod) => {
    const modLessons = lessonsByModule.get(mod.id) ?? [];

    return {
      id: mod.id,
      title: mod.title,
      description: mod.description,
      subjectId: mod.subject_id,
      band: mod.band,
      lessons: modLessons.map((lesson) => {
        const p = progressByLesson.get(lesson.id);
        return {
          id: lesson.id,
          title: lesson.title,
          status: (p?.status ?? "not_started") as ProgressStatus,
          completedAt: p?.completed_at ?? null,
          attempts: p?.attempts ?? 0,
        };
      }),
    };
  });

  return (
    <div className="space-y-8">
      {/* Page header */}
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Progress Detail
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Lesson-by-lesson progress for{" "}
            {kids.length > 0
              ? selectedKidId && allKidIds.has(selectedKidId)
                ? kids[0].display_name
                : "all kids"
              : "your family"}
            .
          </p>
        </div>
      </FadeIn>

      {/* Interactive filterable progress explorer */}
      <ProgressExplorer subjects={subjectData} modules={moduleData} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusRank(status: ProgressStatus): number {
  switch (status) {
    case "completed":
      return 2;
    case "in_progress":
      return 1;
    default:
      return 0;
  }
}
