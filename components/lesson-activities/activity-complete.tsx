"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { Star, Trophy, Clock, Lightbulb, Sparkles, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";

// ---------------------------------------------------------------------------
// Stars display (1-3 stars based on score)
// ---------------------------------------------------------------------------

function StarRating({ score }: { score: number }) {
  const stars = score >= 90 ? 3 : score >= 60 ? 2 : 1;
  const prefersReducedMotion = useReducedMotion();
  const { play } = useSound();
  const starsSounded = useRef(0);

  // Play "star" sound for each earned star, staggered to match animation
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= stars; i++) {
      if (i > starsSounded.current) {
        const timer = setTimeout(() => {
          play("star");
        }, i * 150 + 100); // Offset to sync with spring animation
        timers.push(timer);
      }
    }
    starsSounded.current = stars;
    return () => timers.forEach(clearTimeout);
  }, [stars, play, prefersReducedMotion]);

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
            className={`size-10 ${
              i <= stars
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ActivityComplete - celebration screen shown when all questions are done
// ---------------------------------------------------------------------------

interface ActivityCompleteProps {
  /** Called when the student wants to retry */
  onRetry?: () => void;
}

export function ActivityComplete({ onRetry }: ActivityCompleteProps) {
  const { state, totalQuestions, subjectColor, lessonId } = useActivity();
  const prefersReducedMotion = useReducedMotion();
  const confettiFired = useRef(false);
  const { play } = useSound();

  const { metrics, hasPassed } = state;

  // Play "complete" sound on mount
  useEffect(() => {
    play("complete");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- fire once on mount

  // Fire confetti on first render
  useEffect(() => {
    if (!confettiFired.current && !prefersReducedMotion && hasPassed) {
      confettiFired.current = true;
      // Burst from center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F97316", "#facc15", "#22c55e", "#ec4899", "#3B82F6"],
      });
      // Side bursts
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#F97316", "#facc15"],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#22c55e", "#3B82F6"],
        });
      }, 300);
    }
  }, [hasPassed, prefersReducedMotion]);

  // Format time
  const totalSeconds = Math.round(metrics.totalTimeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeDisplay =
    minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  // Unique correct answers
  const uniqueCorrect = new Set(
    metrics.answers
      .filter((a) => a.isCorrect)
      .map((a) => a.questionId),
  ).size;

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Main celebration card */}
      <Card className="overflow-hidden rounded-2xl border-2" style={{ borderColor: subjectColor }}>
        <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
          {/* Stars */}
          <StarRating score={metrics.score} />

          {/* Title */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {hasPassed ? "Great Job!" : "Nice Try!"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {hasPassed
                ? "You completed the activity!"
                : "Keep practicing and you'll get it!"}
            </p>
          </div>

          {/* Score circle */}
          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
            className="flex size-24 items-center justify-center rounded-full"
            style={{ backgroundColor: `${subjectColor}20` }}
          >
            <span
              className="text-3xl font-bold"
              style={{ color: subjectColor }}
            >
              {metrics.score}%
            </span>
          </motion.div>

          {/* Stats grid */}
          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-muted/30 p-3">
              <Trophy className="size-5 text-amber-500" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Correct</p>
                <p className="text-sm font-semibold">
                  {uniqueCorrect} / {totalQuestions}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-muted/30 p-3">
              <Sparkles className="size-5 text-primary" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">First Try</p>
                <p className="text-sm font-semibold">
                  {metrics.correctFirstTry}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-muted/30 p-3">
              <Clock className="size-5 text-blue-500" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-semibold">{timeDisplay}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-muted/30 p-3">
              <Lightbulb className="size-5 text-amber-500" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Hints Used</p>
                <p className="text-sm font-semibold">{metrics.hintsUsed}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {!hasPassed && onRetry && (
          <Button
            onClick={onRetry}
            size="lg"
            className="rounded-xl"
            style={{ backgroundColor: subjectColor }}
          >
            <RotateCcw className="size-4" />
            Try Again
          </Button>
        )}

        <Button asChild size="lg" variant={hasPassed ? "default" : "outline"} className="rounded-xl">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to Mission Control
          </Link>
        </Button>

        {hasPassed && (
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl"
          >
            <Link href={`/lessons/${lessonId}`}>
              <RotateCcw className="size-4" />
              Play Again
            </Link>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
