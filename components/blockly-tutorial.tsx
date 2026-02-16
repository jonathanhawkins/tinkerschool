"use client";

/**
 * BlocklyTutorial -- Step-by-step guided walkthrough for first-time Blockly editor users.
 *
 * Shows a series of overlay steps with Chip mascot narrating what blocks are,
 * how to drag them, how they connect, and how to run code. Each step highlights
 * a specific area of the editor UI with a spotlight effect.
 *
 * Designed for ages 5-12 (primary target: age 7). Minimal text, big visuals,
 * friendly mascot guidance.
 *
 * Persists completion via the useTutorialProgress store so it only shows once.
 */

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Blocks,
  GripVertical,
  MousePointer2,
  Play,
  Puzzle,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTutorialProgress } from "@/hooks/use-tutorial-progress";

// ---------------------------------------------------------------------------
// Tutorial Step Definitions
// ---------------------------------------------------------------------------

interface TutorialStep {
  /** Unique step identifier */
  id: string;
  /** Chip's message (keep short, kid-friendly) */
  chipMessage: string;
  /** Visual title shown above the message */
  title: string;
  /** Small supporting description */
  description: string;
  /** Icon to display alongside the step */
  icon: React.ReactNode;
  /** Which UI area to highlight (used for spotlight positioning) */
  highlightArea: "none" | "toolbox" | "workspace" | "run-button" | "save-button";
  /** Optional animated illustration */
  illustration?: "drag-block" | "connect-blocks" | "click-run";
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    chipMessage: "Hey friend! Let me show you how blocks work. It's super fun!",
    title: "Welcome to the Block Editor!",
    description:
      "Blocks are puzzle pieces that tell your M5Stick what to do. Let me show you how!",
    icon: <Sparkles className="size-8 text-primary" />,
    highlightArea: "none",
  },
  {
    id: "toolbox",
    chipMessage: "See those colorful tabs on the left? Those are your block categories!",
    title: "The Block Toolbox",
    description:
      "Each color group has different blocks. Purple blocks draw on the screen. Orange blocks make sounds!",
    icon: <Blocks className="size-8 text-purple-500" />,
    highlightArea: "toolbox",
  },
  {
    id: "drag",
    chipMessage: "To use a block, just click a category and drag the block out!",
    title: "Drag a Block Out",
    description:
      "Click on a category like \"Display\", then drag a block into the white area. Try it!",
    icon: <GripVertical className="size-8 text-blue-500" />,
    highlightArea: "workspace",
    illustration: "drag-block",
  },
  {
    id: "connect",
    chipMessage: "Blocks snap together like puzzle pieces! Stack them up!",
    title: "Connect Your Blocks",
    description:
      "Drag one block near another and they'll click together. The order matters -- blocks run from top to bottom!",
    icon: <Puzzle className="size-8 text-emerald-500" />,
    highlightArea: "workspace",
    illustration: "connect-blocks",
  },
  {
    id: "run",
    chipMessage: "When you're ready, hit Run to see what your code does!",
    title: "Run Your Code!",
    description:
      "Click the Run button to test your blocks in the simulator. You can try as many times as you want!",
    icon: <Play className="size-8 text-primary" />,
    highlightArea: "run-button",
    illustration: "click-run",
  },
];

// ---------------------------------------------------------------------------
// Animated illustrations for tutorial steps
// ---------------------------------------------------------------------------

function DragBlockIllustration() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative mx-auto h-24 w-48">
      {/* Block being dragged */}
      <motion.div
        animate={
          prefersReduced
            ? {}
            : {
                x: [0, 60, 60],
                y: [0, 20, 20],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
        className="absolute left-4 top-2 flex h-10 w-32 items-center gap-1.5 rounded-lg bg-purple-500 px-3 text-xs font-medium text-white shadow-lg"
      >
        <span className="truncate">display text</span>
      </motion.div>

      {/* Cursor */}
      <motion.div
        animate={
          prefersReduced
            ? {}
            : {
                x: [16, 76, 76],
                y: [12, 32, 32],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
        className="absolute left-0 top-0"
      >
        <MousePointer2 className="size-5 -rotate-6 fill-foreground text-foreground drop-shadow-md" />
      </motion.div>

      {/* Workspace area indicator */}
      <div className="absolute bottom-0 right-2 flex h-14 w-24 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20">
        <span className="text-[10px] text-muted-foreground">drop here</span>
      </div>
    </div>
  );
}

function ConnectBlocksIllustration() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative mx-auto h-28 w-48">
      {/* Top block (stationary) */}
      <div className="absolute left-8 top-2 flex h-9 w-32 items-center rounded-lg bg-purple-500 px-3 text-xs font-medium text-white shadow-sm">
        <span className="truncate">clear display</span>
      </div>

      {/* Bottom block (snapping into place) */}
      <motion.div
        animate={
          prefersReduced
            ? { y: 0 }
            : {
                y: [20, 0, 0],
                opacity: [0.7, 1, 1],
              }
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeOut",
        }}
        className="absolute left-8 top-11 flex h-9 w-32 items-center rounded-lg bg-purple-400 px-3 text-xs font-medium text-white shadow-sm"
      >
        <span className="truncate">display text</span>
      </motion.div>

      {/* Snap indicator */}
      <motion.div
        animate={
          prefersReduced
            ? { opacity: 0 }
            : {
                opacity: [0, 0, 1, 0],
                scale: [0.8, 0.8, 1.2, 0.8],
              }
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeOut",
        }}
        className="absolute left-[72px] top-[38px]"
      >
        <Sparkles className="size-4 text-amber-400" />
      </motion.div>
    </div>
  );
}

function ClickRunIllustration() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative mx-auto flex h-16 w-48 items-center justify-center">
      <motion.div
        animate={
          prefersReduced
            ? {}
            : {
                scale: [1, 1.08, 1],
              }
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg"
      >
        <Play className="size-4" />
        Run
      </motion.div>

      {/* Cursor pointing to button */}
      <motion.div
        animate={
          prefersReduced
            ? {}
            : {
                x: [20, 0, 0],
                y: [10, 0, 0],
                opacity: [0, 1, 1],
              }
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
        className="absolute right-6 bottom-0"
      >
        <MousePointer2 className="size-5 -rotate-6 fill-foreground text-foreground drop-shadow-md" />
      </motion.div>
    </div>
  );
}

function StepIllustration({ type }: { type: string | undefined }) {
  switch (type) {
    case "drag-block":
      return <DragBlockIllustration />;
    case "connect-blocks":
      return <ConnectBlocksIllustration />;
    case "click-run":
      return <ClickRunIllustration />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// BlocklyTutorial Component
// ---------------------------------------------------------------------------

interface BlocklyTutorialProps {
  /** Force show tutorial even if already completed (for testing) */
  forceShow?: boolean;
}

export function BlocklyTutorial({ forceShow = false }: BlocklyTutorialProps) {
  const { blocklyTutorialComplete, completeBlocklyTutorial } =
    useTutorialProgress();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const prefersReduced = useReducedMotion();

  // Show on mount if tutorial hasn't been completed
  useEffect(() => {
    if (forceShow || !blocklyTutorialComplete) {
      // Short delay so the editor renders first
      const timer = setTimeout(() => {
        setVisible(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [forceShow, blocklyTutorialComplete]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    completeBlocklyTutorial();
  }, [completeBlocklyTutorial]);

  const handleNext = useCallback(() => {
    if (step < TUTORIAL_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleDismiss();
    }
  }, [step, handleDismiss]);

  const handleBack = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  }, [step]);

  if (!visible) return null;

  const currentStep = TUTORIAL_STEPS[step];
  const isLastStep = step === TUTORIAL_STEPS.length - 1;
  const isFirstStep = step === 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            key={step}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 12 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md space-y-5 rounded-2xl bg-card p-6 shadow-2xl"
          >
            {/* Close / Skip button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="absolute right-3 top-3 size-8 rounded-full"
              aria-label="Skip tutorial"
            >
              <X className="size-4" />
            </Button>

            {/* Chip mascot + step icon */}
            <div className="flex items-center gap-4">
              <motion.div
                animate={prefersReduced ? {} : { rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/images/chip.png"
                  alt="Chip"
                  width={56}
                  height={56}
                  className="size-14 shrink-0 drop-shadow-md"
                />
              </motion.div>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                {currentStep.icon}
              </div>
            </div>

            {/* Chip's speech bubble */}
            <div className="rounded-2xl rounded-tl-md bg-primary/8 border border-primary/20 px-4 py-3">
              <p className="text-sm font-medium leading-relaxed text-foreground">
                {currentStep.chipMessage}
              </p>
            </div>

            {/* Title + description */}
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">
                {currentStep.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {currentStep.description}
              </p>
            </div>

            {/* Animated illustration */}
            {currentStep.illustration && (
              <div className="rounded-2xl bg-muted/50 p-4">
                <StepIllustration type={currentStep.illustration} />
              </div>
            )}

            {/* Step progress dots */}
            <div className="flex items-center gap-1.5">
              {TUTORIAL_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    i === step
                      ? "w-6 bg-primary"
                      : i < step
                        ? "w-3 bg-primary/40"
                        : "w-3 bg-muted",
                  )}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {!isFirstStep && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                size="lg"
                className="flex-1 rounded-xl"
              >
                {isLastStep ? "Let's Build!" : "Next"}
                <ArrowRight className="size-4" />
              </Button>
              {isFirstStep && (
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="lg"
                  className="rounded-xl text-muted-foreground"
                >
                  Skip
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
