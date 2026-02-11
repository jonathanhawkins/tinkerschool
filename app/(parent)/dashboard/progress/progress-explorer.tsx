"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Filter,
  Layers,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SubjectIcon } from "@/components/subject-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ProgressStatus } from "@/lib/supabase/types";
import { formatDate } from "@/lib/format-date";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SubjectData {
  id: string;
  display_name: string;
  color: string;
  slug: string;
  icon: string;
}

interface LessonProgressData {
  id: string;
  title: string;
  status: ProgressStatus;
  completedAt: string | null;
  attempts: number;
}

interface ModuleData {
  id: string;
  title: string;
  description: string;
  subjectId: string | null;
  band: number;
  lessons: LessonProgressData[];
}

interface ProgressExplorerProps {
  subjects: SubjectData[];
  modules: ModuleData[];
}

type StatusFilter = "all" | "completed" | "in_progress" | "not_started";

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ProgressExplorer({
  subjects,
  modules,
}: ProgressExplorerProps) {
  const [activeSubject, setActiveSubject] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );

  // Build a subject lookup map
  const subjectMap = useMemo(() => {
    const map = new Map<string, SubjectData>();
    for (const s of subjects) {
      map.set(s.id, s);
    }
    return map;
  }, [subjects]);

  // Apply filters
  const filteredModules = useMemo(() => {
    return modules
      .map((mod) => {
        // Subject filter
        if (activeSubject !== "all" && mod.subjectId !== activeSubject) {
          return null;
        }

        // Status filter on lessons
        const filteredLessons =
          activeStatus === "all"
            ? mod.lessons
            : mod.lessons.filter((l) => l.status === activeStatus);

        if (filteredLessons.length === 0) return null;

        return { ...mod, lessons: filteredLessons };
      })
      .filter(Boolean) as ModuleData[];
  }, [modules, activeSubject, activeStatus]);

  // Compute totals for the summary
  const totalStats = useMemo(() => {
    let totalLessons = 0;
    let completed = 0;
    let inProgress = 0;

    for (const mod of filteredModules) {
      for (const lesson of mod.lessons) {
        totalLessons++;
        if (lesson.status === "completed") completed++;
        else if (lesson.status === "in_progress") inProgress++;
      }
    }

    return { totalLessons, completed, inProgress, notStarted: totalLessons - completed - inProgress };
  }, [filteredModules]);

  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }

  function expandAll() {
    setExpandedModules(new Set(filteredModules.map((m) => m.id)));
  }

  function collapseAll() {
    setExpandedModules(new Set());
  }

  return (
    <div className="space-y-6">
      {/* Subject filter pills */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <SubjectPill
            label="All Subjects"
            color={undefined}
            isActive={activeSubject === "all"}
            onClick={() => setActiveSubject("all")}
          />
          {subjects.map((subject) => (
            <SubjectPill
              key={subject.id}
              label={subject.display_name}
              color={subject.color}
              icon={subject.icon}
              isActive={activeSubject === subject.id}
              onClick={() =>
                setActiveSubject(
                  activeSubject === subject.id ? "all" : subject.id,
                )
              }
            />
          ))}
        </div>

        {/* Status filter + expand/collapse controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="size-4 text-muted-foreground" />
            <StatusPill
              label="All"
              isActive={activeStatus === "all"}
              onClick={() => setActiveStatus("all")}
            />
            <StatusPill
              label="Completed"
              icon={<CheckCircle2 className="size-3.5" />}
              isActive={activeStatus === "completed"}
              onClick={() => setActiveStatus("completed")}
              accentClass="text-emerald-600"
            />
            <StatusPill
              label="In Progress"
              icon={<Clock className="size-3.5" />}
              isActive={activeStatus === "in_progress"}
              onClick={() => setActiveStatus("in_progress")}
              accentClass="text-amber-600"
            />
            <StatusPill
              label="Not Started"
              icon={<Circle className="size-3.5" />}
              isActive={activeStatus === "not_started"}
              onClick={() => setActiveStatus("not_started")}
              accentClass="text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Expand all
            </button>
            <span className="text-muted-foreground/40">|</span>
            <button
              onClick={collapseAll}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Collapse all
            </button>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Layers className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {filteredModules.length} module{filteredModules.length !== 1 ? "s" : ""}
          </span>
        </div>
        <span className="text-muted-foreground/30">|</span>
        <span className="text-sm text-muted-foreground">
          {totalStats.totalLessons} lesson{totalStats.totalLessons !== 1 ? "s" : ""}
        </span>
        <span className="text-muted-foreground/30">|</span>
        <span className="text-sm text-emerald-600">
          {totalStats.completed} completed
        </span>
        <span className="text-muted-foreground/30">|</span>
        <span className="text-sm text-amber-600">
          {totalStats.inProgress} in progress
        </span>
      </div>

      {/* Module cards */}
      {filteredModules.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Search className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No modules match your filters. Try adjusting your subject or
              status filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredModules.map((mod, index) => {
            const subject = mod.subjectId
              ? subjectMap.get(mod.subjectId)
              : undefined;
            const isExpanded = expandedModules.has(mod.id);
            const completedCount = mod.lessons.filter(
              (l) => l.status === "completed",
            ).length;
            const inProgressCount = mod.lessons.filter(
              (l) => l.status === "in_progress",
            ).length;

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: Math.min(index * 0.04, 0.4),
                  ease: "easeOut",
                }}
              >
                <Card
                  className="overflow-hidden rounded-2xl"
                  style={{
                    borderLeftWidth: "4px",
                    borderLeftColor: subject?.color ?? "#64748B",
                  }}
                >
                  {/* Collapsible header */}
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-5 py-4 text-left transition-colors",
                      "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50",
                    )}
                    aria-expanded={isExpanded}
                    aria-controls={`module-${mod.id}`}
                  >
                    {/* Subject color dot */}
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: subject
                          ? `${subject.color}1F`
                          : "#64748B1F",
                      }}
                    >
                      {subject ? (
                        <SubjectIcon
                          icon={subject.icon}
                          className="size-4"
                          style={{ color: subject.color }}
                        />
                      ) : (
                        <Layers
                          className="size-4 text-muted-foreground"
                        />
                      )}
                    </div>

                    {/* Module info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {mod.title}
                      </p>
                      {subject && (
                        <p
                          className="mt-0.5 text-xs font-medium"
                          style={{ color: subject.color }}
                        >
                          {subject.display_name}
                        </p>
                      )}
                    </div>

                    {/* Progress summary */}
                    <div className="flex shrink-0 items-center gap-2">
                      <ModuleProgressBar
                        total={mod.lessons.length}
                        completed={completedCount}
                        inProgress={inProgressCount}
                        color={subject?.color ?? "#64748B"}
                      />
                      <Badge
                        variant="outline"
                        className="shrink-0 text-xs tabular-nums"
                      >
                        {completedCount}/{mod.lessons.length}
                      </Badge>
                    </div>

                    {/* Chevron */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <ChevronDown className="size-4 text-muted-foreground" />
                    </motion.div>
                  </button>

                  {/* Expandable lesson list */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        id={`module-${mod.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="divide-y divide-border border-t border-border">
                          {mod.lessons.map((lesson) => (
                            <LessonRow
                              key={lesson.id}
                              title={lesson.title}
                              status={lesson.status}
                              completedAt={lesson.completedAt}
                              attempts={lesson.attempts}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
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

function SubjectPill({
  label,
  color,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50",
        isActive
          ? "text-white shadow-sm"
          : "border border-border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
      style={
        isActive && color
          ? { backgroundColor: color }
          : isActive && !color
            ? { backgroundColor: "hsl(var(--foreground))" }
            : undefined
      }
    >
      {icon && !isActive && (
        <SubjectIcon
          icon={icon}
          className="size-3.5"
          style={{ color }}
        />
      )}
      {icon && isActive && (
        <SubjectIcon
          icon={icon}
          className="size-3.5 text-white"
        />
      )}
      {label}
    </button>
  );
}

function StatusPill({
  label,
  icon,
  isActive,
  onClick,
  accentClass,
}: {
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  accentClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50",
        isActive
          ? "bg-foreground text-background shadow-sm"
          : cn(
              "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              accentClass,
            ),
      )}
    >
      {icon && !isActive && icon}
      {label}
    </button>
  );
}

function ModuleProgressBar({
  total,
  completed,
  inProgress,
  color,
}: {
  total: number;
  completed: number;
  inProgress: number;
  color: string;
}) {
  if (total === 0) return null;

  const completedPct = (completed / total) * 100;
  const inProgressPct = (inProgress / total) * 100;

  return (
    <div
      className="hidden h-2 w-20 overflow-hidden rounded-full bg-muted sm:block"
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${completed} of ${total} lessons completed`}
    >
      <div className="flex h-full">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${completedPct}%`,
            backgroundColor: color,
          }}
        />
        {inProgressPct > 0 && (
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${inProgressPct}%`,
              backgroundColor: color,
              opacity: 0.35,
            }}
          />
        )}
      </div>
    </div>
  );
}

interface LessonRowProps {
  title: string;
  status: ProgressStatus;
  completedAt: string | null;
  attempts: number;
}

function LessonRow({ title, status, completedAt, attempts }: LessonRowProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
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
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {attempts} {attempts === 1 ? "attempt" : "attempts"}
        </span>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: ProgressStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />;
    case "in_progress":
      return <Clock className="size-5 shrink-0 text-amber-500" />;
    default:
      return <Circle className="size-5 shrink-0 text-muted-foreground/40" />;
  }
}

function StatusBadge({ status }: { status: ProgressStatus }) {
  const config: Record<ProgressStatus, { label: string; className: string }> = {
    completed: {
      label: "Completed",
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
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
