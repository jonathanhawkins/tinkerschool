"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Clock, Pause, Play, Plus, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Session Timer - Gentle screen time reminders for kids
// ---------------------------------------------------------------------------
// Shows a friendly reminder after a configurable number of minutes.
// Band 0 (Pre-K): 10 min default, 30 min daily max, parent can extend +5 min
// Band 1+ (K-6): 30 min default
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Band-specific configuration
// ---------------------------------------------------------------------------

interface BandTimerConfig {
  /** Default session limit in minutes */
  sessionLimitMinutes: number;
  /** Daily maximum across all sessions (minutes) */
  dailyMaxMinutes: number;
  /** How many minutes a parent can extend per tap */
  extendIncrementMinutes: number;
  /** Maximum session length after extensions (minutes) */
  maxSessionMinutes: number;
  /** Reminder interval after the first reminder (minutes) */
  reminderIntervalMinutes: number;
}

const BAND_TIMER_CONFIGS: Record<number, BandTimerConfig> = {
  0: {
    sessionLimitMinutes: 10,
    dailyMaxMinutes: 30,
    extendIncrementMinutes: 5,
    maxSessionMinutes: 20,
    reminderIntervalMinutes: 5,
  },
};

const DEFAULT_TIMER_CONFIG: BandTimerConfig = {
  sessionLimitMinutes: 30,
  dailyMaxMinutes: 120,
  extendIncrementMinutes: 10,
  maxSessionMinutes: 60,
  reminderIntervalMinutes: 10,
};

/** Get timer configuration for a given band. */
export function getTimerConfig(band: number): BandTimerConfig {
  return BAND_TIMER_CONFIGS[band] ?? DEFAULT_TIMER_CONFIG;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SessionTimerProps {
  /** Session limit in minutes (overrides band-based default) */
  limitMinutes?: number;
  /** Curriculum band (0 = Pre-K, 1+ = K-6). Determines defaults. */
  band?: number;
  /** Called when the user dismisses the reminder */
  onDismiss?: () => void;
  /** Called when the session is paused (break taken) */
  onPause?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SessionTimer({
  limitMinutes,
  band = 1,
  onDismiss,
  onPause,
}: SessionTimerProps) {
  const config = getTimerConfig(band);
  const sessionLimit = limitMinutes ?? config.sessionLimitMinutes;
  const isPreK = band === 0;

  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [showReminder, setShowReminder] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [extensionsUsed, setExtensionsUsed] = useState(0);
  const startTime = useRef(Date.now());
  const lastReminderAt = useRef(0);

  // Effective limit accounts for parent extensions
  const effectiveLimit =
    sessionLimit + extensionsUsed * config.extendIncrementMinutes;

  // Can the parent extend the session further?
  const canExtend =
    effectiveLimit + config.extendIncrementMinutes <= config.maxSessionMinutes;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 60000);
      setElapsedMinutes(elapsed);

      // Check if we should show a reminder
      if (elapsed >= effectiveLimit && lastReminderAt.current === 0) {
        setShowReminder(true);
        lastReminderAt.current = elapsed;
      } else if (
        elapsed >= effectiveLimit &&
        elapsed - lastReminderAt.current >= config.reminderIntervalMinutes
      ) {
        setShowReminder(true);
        lastReminderAt.current = elapsed;
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [effectiveLimit, isPaused, config.reminderIntervalMinutes]);

  const handleDismiss = useCallback(() => {
    setShowReminder(false);
    onDismiss?.();
  }, [onDismiss]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
    setShowReminder(false);
    onPause?.();
  }, [onPause]);

  const handleResume = useCallback(() => {
    setIsPaused(false);
    // Adjust start time so elapsed stays continuous
    startTime.current = Date.now() - elapsedMinutes * 60000;
  }, [elapsedMinutes]);

  const handleExtend = useCallback(() => {
    setExtensionsUsed((prev) => prev + 1);
    setShowReminder(false);
  }, []);

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
              {/* Header with Chip */}
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

              {/* Message - varies by band */}
              {isPreK ? (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-foreground/80">
                    Great job today! Time to play and explore!
                  </p>

                  {/* Fun illustration area for Pre-K */}
                  <div className="flex items-center justify-center gap-3 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/30">
                    <Sun className="size-8 text-amber-500" />
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      Go outside, draw a picture, or play with your toys!
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-foreground/80">
                  Great job today! Your brain works best when you take breaks.
                  Stand up, stretch, grab a snack, and come back when
                  you&apos;re ready!
                </p>
              )}

              {/* Actions */}
              <div
                className={cn(
                  "flex gap-3",
                  isPreK && canExtend && "flex-col",
                )}
              >
                <Button
                  onClick={handlePause}
                  variant="default"
                  size="lg"
                  className="flex-1 rounded-xl"
                >
                  <Pause className="size-4" />
                  Take a Break
                </Button>

                {isPreK && canExtend ? (
                  <Button
                    onClick={handleExtend}
                    variant="outline"
                    size="lg"
                    className="flex-1 rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30"
                  >
                    <Plus className="size-4" />
                    Parent: Add {config.extendIncrementMinutes} More Minutes
                  </Button>
                ) : (
                  <Button
                    onClick={handleDismiss}
                    variant="outline"
                    size="lg"
                    className="flex-1 rounded-xl"
                  >
                    Keep Going
                  </Button>
                )}
              </div>

              {/* Pre-K session info for parents */}
              {isPreK && (
                <p className="text-center text-xs text-muted-foreground">
                  Session: {elapsedMinutes}/{effectiveLimit} min
                  {extensionsUsed > 0 &&
                    ` (extended ${extensionsUsed}x)`}
                  {" | "}Max {config.maxSessionMinutes} min
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
