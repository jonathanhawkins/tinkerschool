"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  Trophy,
  Rocket,
  BookOpen,
  Calculator,
  FlaskConical,
} from "lucide-react";

import { ActivityRouter } from "@/components/lesson-activities/activity-router";
import type {
  LessonActivityConfig,
  ActivitySessionMetrics,
} from "@/lib/activities/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DemoSubjectConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  emoji: string;
  chipIntro: string;
  chipEncouragement: string;
  config: LessonActivityConfig;
}

interface DemoLessonProps {
  subjects: DemoSubjectConfig[];
}

// ---------------------------------------------------------------------------
// Chip message bubble (reusable)
// ---------------------------------------------------------------------------

function ChipMessage({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex items-start gap-3 rounded-2xl bg-primary/5 border border-primary/10 p-4",
        className
      )}
    >
      <Image
        src="/images/chip.png"
        alt="Chip"
        width={44}
        height={44}
        className="size-11 shrink-0 drop-shadow-sm"
      />
      <p className="text-sm font-medium leading-relaxed text-foreground">
        {message}
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Star rating component
// ---------------------------------------------------------------------------

function StarRating({ score }: { score: number }) {
  const stars = score >= 90 ? 3 : score >= 60 ? 2 : 1;
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={
            prefersReducedMotion ? { opacity: 1 } : { scale: 0, rotate: -180 }
          }
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15,
            delay: i * 0.15,
          }}
        >
          <Star
            className={cn(
              "size-10",
              i <= stars
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subject picker
// ---------------------------------------------------------------------------

interface SubjectPickerProps {
  subjects: DemoSubjectConfig[];
  activeId: string;
  completedIds: Set<string>;
  onSelect: (id: string) => void;
}

function SubjectPicker({
  subjects,
  activeId,
  completedIds,
  onSelect,
}: SubjectPickerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {subjects.map((subject, i) => {
        const isActive = subject.id === activeId;
        const isCompleted = completedIds.has(subject.id);
        const Icon = subject.icon;

        return (
          <motion.button
            key={subject.id}
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            onClick={() => onSelect(subject.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 touch-manipulation",
              isActive
                ? "shadow-md"
                : "border-border bg-card hover:shadow-sm",
              isCompleted && !isActive && "opacity-70"
            )}
            style={
              isActive
                ? {
                    borderColor: subject.color,
                    backgroundColor: `${subject.color}14`,
                    color: subject.color,
                  }
                : undefined
            }
          >
            <div
              className="flex size-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${subject.color}1F` }}
            >
              <Icon className="size-4" style={{ color: subject.color }} />
            </div>
            <span className={cn(!isActive && "text-foreground")}>
              {subject.name}
            </span>
            {isCompleted && (
              <span className="text-xs" aria-label="Completed">
                {"\u2714\uFE0F"}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo completion screen
// ---------------------------------------------------------------------------

interface DemoCompletionProps {
  score: number;
  subjectName: string;
  subjectColor: string;
  subjectsCompleted: number;
  totalSubjects: number;
  onTryAnother: () => void;
  onReplay: () => void;
}

function DemoCompletion({
  score,
  subjectName,
  subjectColor,
  subjectsCompleted,
  totalSubjects,
  onTryAnother,
  onReplay,
}: DemoCompletionProps) {
  const prefersReducedMotion = useReducedMotion();
  const confettiFired = useRef(false);

  useEffect(() => {
    if (!confettiFired.current && !prefersReducedMotion && score >= 50) {
      confettiFired.current = true;
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#F97316", "#facc15", "#22c55e", "#ec4899", "#3B82F6"],
      });
    }
  }, [score, prefersReducedMotion]);

  const allDone = subjectsCompleted >= totalSubjects;

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Celebration */}
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <StarRating score={score} />

        <Image
          src="/images/chip.png"
          alt="Chip celebrating"
          width={80}
          height={80}
          className="size-20 drop-shadow-md"
        />

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">
            {score >= 80
              ? "Amazing Job!"
              : score >= 50
                ? "Great Work!"
                : "Nice Try!"}
          </h2>
          <p className="text-sm text-muted-foreground">
            You scored{" "}
            <span className="font-semibold" style={{ color: subjectColor }}>
              {score}%
            </span>{" "}
            on the {subjectName} demo!
          </p>
        </div>

        {/* Subject progress */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1 text-xs"
            style={{ borderColor: `${subjectColor}40`, color: subjectColor }}
          >
            <Trophy className="size-3" />
            {subjectsCompleted} of {totalSubjects} subjects tried
          </Badge>
        </div>
      </div>

      {/* Chip encouragement */}
      <ChipMessage
        message={
          allDone
            ? "Wow, you tried all the demo subjects! Imagine having 100+ lessons like these across 7 subjects. Ready to start your learning adventure?"
            : score >= 50
              ? "You did so well! Want to try another subject, or are you ready to unlock the full TinkerSchool experience?"
              : "Great effort! Every genius starts by trying. Want to give it another go, or try a different subject?"
        }
      />

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {!allDone && (
          <Button
            onClick={onTryAnother}
            size="lg"
            variant="outline"
            className="rounded-xl"
          >
            <Rocket className="size-4" />
            Try Another Subject
          </Button>
        )}

        <Button
          onClick={onReplay}
          size="lg"
          variant="outline"
          className="rounded-xl"
        >
          <RotateCcw className="size-4" />
          Replay {subjectName}
        </Button>
      </div>

      {/* Sign up CTA */}
      <Card className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15">
            <Sparkles className="size-7 text-primary" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-foreground">
              Want More Lessons Like This?
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Sign up free to unlock 100+ interactive lessons across 7
              subjects, meet your personal AI tutor Chip, and track your
              progress. No credit card needed!
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calculator className="size-3.5 text-blue-500" />
              Math
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen className="size-3.5 text-green-500" />
              Reading
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FlaskConical className="size-3.5 text-orange-500" />
              Science
            </div>
            <span className="text-xs text-muted-foreground">+ 4 more</span>
          </div>

          <motion.div
            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
          >
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 shadow-md shadow-primary/25"
            >
              <Link href="/sign-up">
                Start Learning Free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>

          <p className="text-xs text-muted-foreground">
            Free and open source. Always.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// DemoLesson - The main demo experience
// ---------------------------------------------------------------------------

type DemoPhase = "intro" | "playing" | "complete";

export function DemoLesson({ subjects }: DemoLessonProps) {
  const [activeSubjectId, setActiveSubjectId] = useState(subjects[0].id);
  const [completedSubjects, setCompletedSubjects] = useState<
    Map<string, number>
  >(new Map());
  const [phase, setPhase] = useState<DemoPhase>("intro");
  const [activityKey, setActivityKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const activeSubject = subjects.find((s) => s.id === activeSubjectId)!;
  const completedIds = new Set(completedSubjects.keys());

  const handleComplete = useCallback(
    async (metrics: ActivitySessionMetrics) => {
      setCompletedSubjects((prev) => {
        const next = new Map(prev);
        next.set(activeSubjectId, metrics.score);
        return next;
      });
      setPhase("complete");
    },
    [activeSubjectId]
  );

  const handleSelectSubject = useCallback(
    (id: string) => {
      setActiveSubjectId(id);
      // If switching to a new subject, reset to intro
      if (id !== activeSubjectId) {
        setPhase("intro");
        setActivityKey((k) => k + 1);
      }
    },
    [activeSubjectId]
  );

  const handleStart = useCallback(() => {
    setPhase("playing");
  }, []);

  const handleTryAnother = useCallback(() => {
    // Find the next un-completed subject
    const nextSubject = subjects.find((s) => !completedSubjects.has(s.id));
    if (nextSubject) {
      setActiveSubjectId(nextSubject.id);
      setPhase("intro");
      setActivityKey((k) => k + 1);
    }
  }, [subjects, completedSubjects]);

  const handleReplay = useCallback(() => {
    setPhase("intro");
    setActivityKey((k) => k + 1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Subject tabs */}
      <SubjectPicker
        subjects={subjects}
        activeId={activeSubjectId}
        completedIds={completedIds}
        onSelect={handleSelectSubject}
      />

      {/* Content area */}
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key={`intro-${activeSubjectId}`}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <ChipMessage message={activeSubject.chipIntro} />

            <div className="flex justify-center">
              <motion.div
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              >
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="rounded-xl px-8 shadow-md"
                  style={{ backgroundColor: activeSubject.color }}
                >
                  <Sparkles className="size-4" />
                  Start {activeSubject.name} Demo
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div
            key={`playing-${activeSubjectId}-${activityKey}`}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ActivityRouter
              key={activityKey}
              config={activeSubject.config}
              lessonId="demo"
              profileId="demo"
              subjectColor={activeSubject.color}
              onComplete={handleComplete}
            />
          </motion.div>
        )}

        {phase === "complete" && (
          <motion.div
            key={`complete-${activeSubjectId}`}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <DemoCompletion
              score={completedSubjects.get(activeSubjectId) ?? 0}
              subjectName={activeSubject.name}
              subjectColor={activeSubject.color}
              subjectsCompleted={completedSubjects.size}
              totalSubjects={subjects.length}
              onTryAnother={handleTryAnother}
              onReplay={handleReplay}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
