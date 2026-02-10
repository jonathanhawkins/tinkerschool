"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Clock, Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Session Timer - Gentle screen time reminders for kids
// ---------------------------------------------------------------------------
// Shows a friendly reminder after a configurable number of minutes.
// Does NOT forcefully stop the session - just encourages a break.
// ---------------------------------------------------------------------------

/** Default session limit in minutes */
const DEFAULT_SESSION_LIMIT_MINUTES = 30;

/** Reminder interval after the first reminder (minutes) */
const REMINDER_INTERVAL_MINUTES = 10;

interface SessionTimerProps {
  /** Session limit in minutes (from family settings) */
  limitMinutes?: number;
  /** Called when the user dismisses the reminder */
  onDismiss?: () => void;
}

export function SessionTimer({
  limitMinutes = DEFAULT_SESSION_LIMIT_MINUTES,
  onDismiss,
}: SessionTimerProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [showReminder, setShowReminder] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const startTime = useRef(Date.now());
  const lastReminderAt = useRef(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 60000);
      setElapsedMinutes(elapsed);

      // Check if we should show a reminder
      if (
        elapsed >= limitMinutes &&
        elapsed - lastReminderAt.current >= REMINDER_INTERVAL_MINUTES
      ) {
        setShowReminder(true);
        lastReminderAt.current = elapsed;
      } else if (
        elapsed >= limitMinutes &&
        lastReminderAt.current === 0
      ) {
        setShowReminder(true);
        lastReminderAt.current = elapsed;
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [limitMinutes, isPaused]);

  const handleDismiss = useCallback(() => {
    setShowReminder(false);
    onDismiss?.();
  }, [onDismiss]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
    setShowReminder(false);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
    // Adjust start time so elapsed stays continuous
    startTime.current = Date.now() - elapsedMinutes * 60000;
  }, [elapsedMinutes]);

  return (
    <>
      {/* Compact timer display */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3" />
        <span>{elapsedMinutes} min</span>
        {isPaused && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResume}
            className="h-6 gap-1 px-2 text-xs"
          >
            <Play className="size-3" />
            Resume
          </Button>
        )}
      </div>

      {/* Break reminder overlay */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm space-y-4 rounded-2xl bg-card p-6 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <Image
                  src="/images/chip.png"
                  alt="Chip"
                  width={48}
                  height={48}
                  className="size-12 drop-shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Time for a Break!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ve been learning for {elapsedMinutes} minutes
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-foreground/80">
                Great job today! Your brain works best when you take breaks.
                Stand up, stretch, grab a snack, and come back when you&apos;re
                ready!
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={handlePause}
                  variant="default"
                  size="lg"
                  className="flex-1 rounded-xl"
                >
                  <Pause className="size-4" />
                  Take a Break
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl"
                >
                  Keep Going
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
