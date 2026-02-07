import { BookOpen, CheckCircle2, Circle, Clock } from "lucide-react";

import { requireAuth } from "@/lib/auth/require-auth";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type {
  Profile,
  Module,
  Lesson,
  Progress as ProgressRow,
  ProgressStatus,
} from "@/lib/supabase/types";

export default async function ProgressPage() {
  const { profile, supabase } = await requireAuth();

  // Fetch kid profiles in the family
  const { data: kidProfiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("family_id", profile.family_id)
    .eq("role", "kid");

  const kids = (kidProfiles ?? []) as Profile[];
  const kidIds = kids.map((k) => k.id);

  // Fetch modules, lessons, and progress
  const [modulesResult, lessonsResult, progressResult] = await Promise.all([
    supabase.from("modules").select("*").order("band").order("order_num"),
    supabase.from("lessons").select("*").order("order_num"),
    kidIds.length > 0
      ? supabase.from("progress").select("*").in("profile_id", kidIds)
      : Promise.resolve({ data: [] }),
  ]);

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
    if (
      !existing ||
      statusRank(p.status) > statusRank(existing.status)
    ) {
      progressByLesson.set(p.lesson_id, p);
    }
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Progress Detail
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lesson-by-lesson progress for{" "}
          {kids.length > 0
            ? kids.map((k) => k.display_name).join(", ")
            : "your family"}
          .
        </p>
      </div>

      {/* Modules list */}
      {modules.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No curriculum data available yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {modules.map((mod) => {
            const modLessons = lessonsByModule.get(mod.id) ?? [];
            const completedCount = modLessons.filter(
              (l) => progressByLesson.get(l.id)?.status === "completed",
            ).length;

            return (
              <Card key={mod.id} className="rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="size-4 text-primary" />
                      {mod.title}
                    </CardTitle>
                    <Badge variant="outline" className="shrink-0">
                      {completedCount} / {modLessons.length} done
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mod.description}
                  </p>
                </CardHeader>
                <CardContent>
                  {modLessons.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No lessons in this module yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-border rounded-xl border">
                      {modLessons.map((lesson) => {
                        const p = progressByLesson.get(lesson.id);
                        const status: ProgressStatus =
                          p?.status ?? "not_started";

                        return (
                          <LessonRow
                            key={lesson.id}
                            title={lesson.title}
                            status={status}
                            completedAt={p?.completed_at ?? null}
                            attempts={p?.attempts ?? 0}
                          />
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface LessonRowProps {
  title: string;
  status: ProgressStatus;
  completedAt: string | null;
  attempts: number;
}

function LessonRow({ title, status, completedAt, attempts }: LessonRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Status icon */}
      <StatusIcon status={status} />

      {/* Lesson title */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {completedAt && (
          <p className="text-xs text-muted-foreground">
            Completed {formatDate(completedAt)}
          </p>
        )}
      </div>

      {/* Status badge */}
      <StatusBadge status={status} />

      {/* Attempts */}
      {attempts > 0 && (
        <span className="text-xs text-muted-foreground">
          {attempts} {attempts === 1 ? "attempt" : "attempts"}
        </span>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: ProgressStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="size-5 shrink-0 text-chart-3" />;
    case "in_progress":
      return <Clock className="size-5 shrink-0 text-chart-4" />;
    default:
      return <Circle className="size-5 shrink-0 text-muted-foreground/40" />;
  }
}

function StatusBadge({ status }: { status: ProgressStatus }) {
  const config: Record<
    ProgressStatus,
    { label: string; className: string }
  > = {
    completed: {
      label: "Completed",
      className: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    },
    not_started: {
      label: "Not Started",
      className: "bg-muted text-muted-foreground",
    },
  };

  const { label, className } = config[status];

  return (
    <Badge
      variant="outline"
      className={cn("shrink-0 text-xs", className)}
    >
      {label}
    </Badge>
  );
}

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
