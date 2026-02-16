"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator,
  BookOpen,
  FlaskConical,
  Music,
  Palette,
  Puzzle,
  Code2,
  Clock,
  ArrowRight,
  FolderOpen,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WelcomeLessonItem {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  subjectSlug: string | null;
  subjectName: string | null;
  subjectColor: string | null;
  subjectIcon: string | null;
  status: "not_started" | "in_progress";
}

export interface WelcomeProjectItem {
  id: string;
  title: string;
  updatedAt: string;
}

export interface WelcomeData {
  kidName: string;
  continueItems: WelcomeLessonItem[];
  suggestedItems: WelcomeLessonItem[];
  recentProjects: WelcomeProjectItem[];
}

interface WorkshopWelcomeProps {
  data: WelcomeData;
  onFreePlay: () => void;
}

// ---------------------------------------------------------------------------
// Icon mapping (client-side equivalent of server-only SubjectIcon)
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, LucideIcon> = {
  calculator: Calculator,
  "book-open": BookOpen,
  "flask-conical": FlaskConical,
  music: Music,
  palette: Palette,
  puzzle: Puzzle,
  "code-2": Code2,
};

function getSubjectIcon(icon: string | null): LucideIcon {
  if (!icon) return BookOpen;
  return ICON_MAP[icon] ?? BookOpen;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function LessonCard({ item }: { item: WelcomeLessonItem }) {
  const color = item.subjectColor ?? "#64748B";
  const Icon = getSubjectIcon(item.subjectIcon);

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link href={`/workshop?lessonId=${item.id}`} className="block">
        <Card
          className="h-full rounded-2xl border-l-4 transition-shadow hover:shadow-md"
          style={{ borderLeftColor: color }}
        >
          <CardContent className="flex flex-col gap-2 p-5">
            <div className="flex items-start gap-3">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${color}1F` }}
              >
                <Icon className="size-5" style={{ color }} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold leading-snug text-foreground">
                  {item.title}
                </h3>
                {item.subjectName && (
                  <Badge
                    variant="outline"
                    className="mt-1 text-xs"
                    style={{ borderColor: color, color }}
                  >
                    {item.subjectName}
                  </Badge>
                )}
              </div>
            </div>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {item.estimatedMinutes > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {item.estimatedMinutes} min
                </span>
              )}
              {item.status === "in_progress" && (
                <Badge
                  variant="outline"
                  className="border-amber-400 text-xs text-amber-600"
                >
                  In Progress
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function ProjectCard({ project }: { project: WelcomeProjectItem }) {
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link href={`/workshop?projectId=${project.id}`} className="block">
        <Card className="rounded-2xl transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              <FolderOpen className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {project.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// WorkshopWelcome
// ---------------------------------------------------------------------------

export function WorkshopWelcome({ data, onFreePlay }: WorkshopWelcomeProps) {
  const { kidName, continueItems, suggestedItems, recentProjects } = data;
  const [chipHovered, setChipHovered] = useState(false);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-3xl space-y-8 overflow-y-auto px-1 py-6"
    >
      {/* Chip greeting */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="flex items-center gap-4 p-5">
            <motion.div
              animate={chipHovered ? { rotate: [0, -8, 8, -4, 0] } : {}}
              transition={{ duration: 0.5 }}
              onHoverStart={() => setChipHovered(true)}
              onHoverEnd={() => setChipHovered(false)}
              className="shrink-0"
            >
              <Image
                src="/images/chip.png"
                alt="Chip mascot"
                width={64}
                height={64}
                className="rounded-xl"
              />
            </motion.div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Hey {kidName}!
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                What do you want to build today? Pick a lesson below, continue
                where you left off, or jump into free play!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Continue Building */}
      {continueItems.length > 0 && (
        <section className="space-y-3">
          <motion.h2
            variants={itemVariants}
            className="text-lg font-semibold text-foreground"
          >
            Continue Building
          </motion.h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {continueItems.map((item) => (
              <LessonCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Try Something New */}
      {suggestedItems.length > 0 && (
        <section className="space-y-3">
          <motion.h2
            variants={itemVariants}
            className="text-lg font-semibold text-foreground"
          >
            Try Something New
          </motion.h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedItems.map((item) => (
              <LessonCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Your Projects */}
      {recentProjects.length > 0 && (
        <section className="space-y-3">
          <motion.h2
            variants={itemVariants}
            className="text-lg font-semibold text-foreground"
          >
            Your Projects
          </motion.h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Free Play */}
      <motion.div variants={itemVariants}>
        <button
          type="button"
          onClick={onFreePlay}
          className="w-full"
        >
          <Card
            className={cn(
              "rounded-2xl border-2 border-dashed border-muted-foreground/30",
              "transition-all hover:border-primary/50 hover:shadow-md",
            )}
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <h3 className="text-base font-semibold text-foreground">
                  Free Play
                </h3>
                <p className="text-sm text-muted-foreground">
                  Start with a blank canvas and build whatever you imagine!
                </p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-muted-foreground" />
            </CardContent>
          </Card>
        </button>
      </motion.div>
    </motion.div>
  );
}
