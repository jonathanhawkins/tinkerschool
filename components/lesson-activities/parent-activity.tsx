"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HandHeart, Lightbulb, PartyPopper, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { ParentActivityContent } from "@/lib/activities/types";

// ---------------------------------------------------------------------------
// Celebration stars that burst out on completion
// ---------------------------------------------------------------------------

const CELEBRATION_STARS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: (i * 360) / 8,
  delay: i * 0.05,
}));

function CelebrationBurst() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {CELEBRATION_STARS.map((star) => {
        const rad = (star.angle * Math.PI) / 180;
        const x = Math.cos(rad) * 80;
        const y = Math.sin(rad) * 80;
        return (
          <motion.div
            key={star.id}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], x, y, scale: [0, 1.2, 0.6] }}
            transition={{ duration: 0.7, delay: star.delay, ease: "easeOut" }}
            className="absolute"
          >
            <Star
              className="size-5 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ParentActivity - Off-screen parent-guided activity widget
// ---------------------------------------------------------------------------

export function ParentActivity() {
  const { currentActivity, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as ParentActivityContent;
  const prefersReducedMotion = useReducedMotion();

  const [completed, setCompleted] = useState(false);

  if (!activity) return null;

  const illustration = activity.illustration ?? "🌟";

  function handleComplete() {
    setCompleted(true);
    play("complete");
    // Record as completed — parent activities are always "correct" on completion
    recordAnswer("completed", true);
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {activity.prompt}
        </h3>
        <p className="text-sm text-muted-foreground">
          Time for a real-world activity with your child!
        </p>
      </div>

      {/* Activity card */}
      <div className="overflow-hidden rounded-2xl border-2 bg-card shadow-sm"
        style={{ borderColor: `${subjectColor}40` }}
      >
        {/* Illustration area */}
        <div
          className="flex items-center justify-center py-8"
          style={{ backgroundColor: `${subjectColor}14` }}
        >
          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 15 }}
            className="relative"
          >
            {/* Check if illustration is a URL path or an emoji */}
            {illustration.startsWith("/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={illustration}
                alt=""
                className="size-24 rounded-xl object-cover"
              />
            ) : (
              <span className="text-7xl" role="img" aria-hidden="true">
                {illustration}
              </span>
            )}
            {completed && <CelebrationBurst />}
          </motion.div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${subjectColor}1F` }}
            >
              <HandHeart
                className="size-4"
                style={{ color: subjectColor }}
                aria-hidden="true"
              />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">
                What to do
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">
                {activity.instructions}
              </p>
            </div>
          </div>

          {/* Parent tip callout */}
          {activity.parentTip && (
            <div
              className={cn(
                "flex items-start gap-3 rounded-xl p-4",
                "bg-amber-50 dark:bg-amber-950/30",
              )}
            >
              <Lightbulb
                className="mt-0.5 size-4 shrink-0 text-amber-500"
                aria-hidden="true"
              />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  Parent Tip
                </p>
                <p className="text-sm leading-relaxed text-amber-700/80 dark:text-amber-300/80">
                  {activity.parentTip}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completion section */}
      <div className="space-y-3 text-center">
        {/* Completion prompt */}
        <p className="text-sm font-medium text-muted-foreground">
          {activity.completionPrompt}
        </p>

        {/* "We did it!" button */}
        {!completed ? (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleComplete}
              size="lg"
              className="rounded-xl px-8 text-base"
              style={{ backgroundColor: subjectColor }}
            >
              <PartyPopper className="size-5" />
              We did it!
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="flex size-12 items-center justify-center rounded-full"
              style={{ backgroundColor: `${subjectColor}1F` }}
            >
              <Star
                className="size-6 fill-current"
                style={{ color: subjectColor }}
                aria-hidden="true"
              />
            </div>
            <p
              className="text-base font-semibold"
              style={{ color: subjectColor }}
            >
              Great job!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
