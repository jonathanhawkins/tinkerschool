"use client";

/**
 * WorkshopHints -- Contextual hint system for the Blockly workshop.
 *
 * Detects when a kid seems stuck (no blocks placed after a timeout) and
 * shows progressive Chip hints pointing them in the right direction.
 *
 * Hints are lesson-aware: they know which blocks the lesson needs and
 * guide the kid toward the right toolbox category.
 *
 * Progressive hint levels:
 *   1. Gentle nudge ("Try clicking on the Display category!")
 *   2. Specific guidance ("Drag the 'display text' block to get started")
 *   3. Step-by-step ("First, click Display. Then drag out 'display text'")
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Lightbulb, X } from "lucide-react";

import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LessonHintContext {
  /** The lesson title for contextual messaging */
  lessonTitle: string;
  /** Hints from the lesson data */
  hints: Array<{ order: number; text: string }>;
  /** Whether the lesson has starter blocks (less guidance needed) */
  hasStarterBlocks: boolean;
  /** The lesson description (used for hint context) */
  description: string;
}

interface WorkshopHintsProps {
  /** Lesson context for generating contextual hints */
  lessonContext: LessonHintContext | null;
  /** Whether blocks exist on the workspace (passed from parent) */
  hasBlocks: boolean;
  /** Whether the simulator has been run at least once */
  hasRunSim: boolean;
  /** Callback when the hint ask button is clicked */
  onAskChip?: () => void;
}

// ---------------------------------------------------------------------------
// Hint definitions
// ---------------------------------------------------------------------------

interface HintMessage {
  /** The main message Chip says */
  message: string;
  /** Optional action label (e.g., "Click Display") */
  actionLabel?: string;
  /** Hint level: 1=gentle, 2=specific, 3=detailed */
  level: 1 | 2 | 3;
}

/**
 * Detect the primary toolbox category a lesson needs based on its hints and
 * description. Returns "Sound", "Display", "Sensors", etc. or null.
 */
function detectLessonCategory(context: LessonHintContext): string | null {
  const text = `${context.description} ${context.lessonTitle} ${context.hints.map((h) => h.text).join(" ")}`.toLowerCase();

  if (text.includes("sound") || text.includes("tone") || text.includes("buzzer") || text.includes("beat") || text.includes("music") || text.includes("drum") || text.includes("note")) {
    return "Sound";
  }
  if (text.includes("sensor") || text.includes("tilt") || text.includes("shake") || text.includes("imu") || text.includes("accel")) {
    return "Sensors";
  }
  if (text.includes("led") || text.includes("light up")) {
    return "LED";
  }
  if (text.includes("button")) {
    return "Buttons";
  }
  // Default to Display for most lessons
  return null;
}

function generateIdleHints(
  context: LessonHintContext | null,
  hasBlocks: boolean,
  hasRunSim: boolean,
): HintMessage[] {
  if (!context) {
    // Free play mode - generic hints
    return [
      {
        message: "Try clicking on the colorful tabs on the left to see what blocks you can use!",
        level: 1,
      },
      {
        message: "Click \"Display\" and drag out a block to start building your program!",
        actionLabel: "Try Display",
        level: 2,
      },
      {
        message: "Here's how: 1) Click \"Display\" on the left. 2) Drag the \"display text\" block into the white area. 3) Click Run to test!",
        level: 3,
      },
    ];
  }

  // Sort lesson hints once (used in multiple branches)
  const sortedHints = [...context.hints].sort((a, b) => a.order - b.order);
  const category = detectLessonCategory(context);

  if (hasBlocks && !hasRunSim) {
    // Kid has blocks but hasn't run yet
    return [
      {
        message: "Nice blocks! Try clicking the Run button to see what they do!",
        actionLabel: "Click Run",
        level: 1,
      },
      {
        message: "You've built some code! Click the green Run button in the simulator to test it out.",
        level: 2,
      },
    ];
  }

  if (hasBlocks && hasRunSim) {
    // Kid has run the sim -- show lesson-specific next steps from hints
    // Skip the first hint (getting started) and show hints about refinement
    if (sortedHints.length > 2) {
      return sortedHints.slice(2).map((hint, i) => ({
        message: hint.text,
        level: (Math.min(i + 1, 3)) as 1 | 2 | 3,
      }));
    }
    if (sortedHints.length > 0) {
      return sortedHints.map((hint, i) => ({
        message: hint.text,
        level: (Math.min(i + 1, 3)) as 1 | 2 | 3,
      }));
    }

    return [
      {
        message: "Looking good! Check the \"Your Goal\" panel to see if your output matches.",
        level: 1,
      },
    ];
  }

  // ----- No blocks yet (or only starter blocks) -----

  if (context.hasStarterBlocks) {
    // Starter blocks present -- encourage running first, then show lesson hints
    const starterHints: HintMessage[] = [
      {
        message: "You already have some starter blocks! Click Run to see what they do.",
        actionLabel: "Click Run",
        level: 1,
      },
    ];

    // Add the first lesson hint as the second step
    if (sortedHints.length > 0) {
      starterHints.push({
        message: sortedHints[0].text,
        level: 2,
      });
    } else {
      starterHints.push({
        message: "The starter blocks are a head start! Try running them, then add more blocks to match the lesson goal.",
        level: 2,
      });
    }

    // Add remaining lesson hints progressively
    if (sortedHints.length > 1) {
      starterHints.push({
        message: sortedHints[1].text,
        level: 3,
      });
    }

    return starterHints;
  }

  // No blocks, no starter blocks -- use lesson hints if available,
  // otherwise generate category-aware generic hints
  if (sortedHints.length >= 3) {
    // Lesson has its own step-by-step hints -- use them directly
    return sortedHints.slice(0, 3).map((hint, i) => ({
      message: hint.text,
      actionLabel: i === 0 ? (category === "Sound" ? "Try Sound" : category ? `Try ${category}` : undefined) : undefined,
      level: (i + 1) as 1 | 2 | 3,
    }));
  }

  // Generate category-aware hints based on lesson content
  if (category === "Sound") {
    return [
      {
        message: `Let's make some ${context.lessonTitle.toLowerCase().includes("beat") ? "beats" : "music"}! Click the orange "Sound" tab on the left.`,
        actionLabel: "Try Sound",
        level: 1,
      },
      {
        message: `Drag the "play tone" block into the workspace. The first number controls how high or low the sound is!`,
        level: 2,
      },
      {
        message: `Step by step: 1) Click "Sound" on the left. 2) Drag "play tone" into the workspace. 3) Click Run to hear it! Then add a Loop to repeat.`,
        level: 3,
      },
    ];
  }

  if (category === "Sensors") {
    return [
      {
        message: "Let's use sensors! Click the teal \"Sensors\" tab on the left to see what your device can sense.",
        actionLabel: "Try Sensors",
        level: 1,
      },
      {
        message: `Drag a sensor block into the workspace. Combine it with a Display block to show the readings!`,
        level: 2,
      },
      {
        message: `Step by step: 1) Click "Sensors" on the left. 2) Drag a sensor block out. 3) Use a Loop so it keeps checking. 4) Click Run!`,
        level: 3,
      },
    ];
  }

  // Default: Display-based hints (original behavior)
  return [
    {
      message: "Let's get started! Click on the colorful tabs on the left to find your blocks.",
      level: 1,
    },
    {
      message: `For this lesson, try clicking "Display" first, then drag out the "display text" block.`,
      actionLabel: "Try Display",
      level: 2,
    },
    {
      message: `Step by step: 1) Click "Display" on the left. 2) Drag "display text" into the workspace. 3) Type what you want to show. 4) Click Run!`,
      level: 3,
    },
  ];
}

// ---------------------------------------------------------------------------
// Idle timer durations (in milliseconds)
// ---------------------------------------------------------------------------

const IDLE_THRESHOLD_LEVEL_1 = 15_000; // 15 seconds
const IDLE_THRESHOLD_LEVEL_2 = 30_000; // 30 seconds
const IDLE_THRESHOLD_LEVEL_3 = 50_000; // 50 seconds

// ---------------------------------------------------------------------------
// WorkshopHints Component
// ---------------------------------------------------------------------------

export function WorkshopHints({
  lessonContext,
  hasBlocks,
  hasRunSim,
}: WorkshopHintsProps) {
  const [currentHint, setCurrentHint] = useState<HintMessage | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const prefersReduced = useReducedMotion();

  // Refs for idle detection
  const lastActivityRef = useRef<number>(0);
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate contextual hints
  const hints = useMemo(
    () => generateIdleHints(lessonContext, hasBlocks, hasRunSim),
    [lessonContext, hasBlocks, hasRunSim],
  );

  // Reset activity timer on state changes
  useEffect(() => {
    lastActivityRef.current = Date.now();
    // When blocks change or sim runs, clear current hint
    if (hasBlocks || hasRunSim) {
      setCurrentHint(null);
      setHintLevel(0);
      setDismissed(false);
    }
  }, [hasBlocks, hasRunSim]);

  // Idle detection timer
  useEffect(() => {
    if (dismissed) return;

    idleTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;

      if (elapsed >= IDLE_THRESHOLD_LEVEL_3 && hintLevel < 3 && hints.length > 2) {
        setHintLevel(3);
        setCurrentHint(hints[2]);
      } else if (elapsed >= IDLE_THRESHOLD_LEVEL_2 && hintLevel < 2 && hints.length > 1) {
        setHintLevel(2);
        setCurrentHint(hints[1]);
      } else if (elapsed >= IDLE_THRESHOLD_LEVEL_1 && hintLevel < 1 && hints.length > 0) {
        setHintLevel(1);
        setCurrentHint(hints[0]);
      }
    }, 3000);

    return () => {
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
      }
    };
  }, [dismissed, hintLevel, hints]);

  const handleDismiss = useCallback(() => {
    setCurrentHint(null);
    setDismissed(true);
    lastActivityRef.current = Date.now();
  }, []);

  // Render nothing when no hint is active -- zero height
  if (!currentHint) return null;

  return (
    <AnimatePresence>
      {currentHint && (
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center gap-2 rounded-xl border border-amber-300/50 bg-amber-50/80 px-3 py-1.5 dark:bg-amber-950/30"
        >
          <Lightbulb className="size-3.5 shrink-0 text-amber-500" />
          <p className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
            {currentHint.message}
          </p>

          {currentHint.actionLabel && (
            <Button
              size="sm"
              className="h-6 gap-1 rounded-lg px-2.5 text-[11px]"
              onClick={handleDismiss}
            >
              {currentHint.actionLabel}
              <ArrowRight className="size-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 rounded-lg px-1.5 text-muted-foreground"
            onClick={handleDismiss}
          >
            <X className="size-3" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Hook for tracking workspace activity (to reset idle timer)
// ---------------------------------------------------------------------------

/**
 * useWorkshopActivity -- provides a callback to record activity events
 * from the Blockly workspace. Calling `recordActivity()` resets the idle timer.
 */
export function useWorkshopActivity() {
  const [hasBlocks, setHasBlocks] = useState(false);
  const [hasRunSim, setHasRunSim] = useState(false);

  const recordBlockChange = useCallback((count: number) => {
    setHasBlocks(count > 0);
  }, []);

  const recordSimRun = useCallback(() => {
    setHasRunSim(true);
  }, []);

  return {
    hasBlocks,
    hasRunSim,
    recordBlockChange,
    recordSimRun,
  };
}
