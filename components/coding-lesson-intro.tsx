"use client";

/**
 * CodingLessonIntro -- A brief, friendly intro shown the first time a kid
 * opens a coding lesson. Explains the lesson page layout: story, goal,
 * concepts, and the "Start Coding" button that takes them to the workshop.
 *
 * Much lighter than the BlocklyTutorial (which handles the editor itself).
 * This just bridges the gap between reading the lesson and entering the editor.
 */

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Lightbulb,
  Play,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTutorialProgress } from "@/hooks/use-tutorial-progress";

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

interface IntroStep {
  chipMessage: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: IntroStep[] = [
  {
    chipMessage: "This is a coding lesson! Let me show you how it works.",
    title: "How Coding Lessons Work",
    description:
      "First, read the story to understand what we're building. Then, check out the goal and any new concepts below!",
    icon: <BookOpen className="size-7 text-blue-500" />,
  },
  {
    chipMessage: "New concepts are explained with fun examples before you start!",
    title: "Learn the Concepts",
    description:
      "If there are new ideas in this lesson (like loops or display blocks), you'll see cards explaining them with examples you already know.",
    icon: <Lightbulb className="size-7 text-amber-500" />,
  },
  {
    chipMessage: "When you're ready, click 'Start Coding' to open the block editor!",
    title: "Start Building!",
    description:
      "Hit the Start Coding button to open the workshop. That's where you'll drag and connect blocks to make your program!",
    icon: <Play className="size-7 text-primary" />,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CodingLessonIntro() {
  const { codingWalkthroughSeen, markCodingWalkthroughSeen } =
    useTutorialProgress();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!codingWalkthroughSeen) {
      const timer = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(timer);
    }
  }, [codingWalkthroughSeen]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    markCodingWalkthroughSeen();
  }, [markCodingWalkthroughSeen]);

  const handleNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleDismiss();
    }
  }, [step, handleDismiss]);

  if (!visible) return null;

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-sm space-y-4 rounded-2xl bg-card p-6 shadow-2xl"
          >
            {/* Close */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="absolute right-3 top-3 size-8 rounded-full"
              aria-label="Skip intro"
            >
              <X className="size-4" />
            </Button>

            {/* Chip + icon */}
            <div className="flex items-center gap-3">
              <Image
                src="/images/chip.png"
                alt="Chip"
                width={48}
                height={48}
                className="size-12 shrink-0 drop-shadow-md"
              />
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
                {currentStep.icon}
              </div>
            </div>

            {/* Speech bubble */}
            <div className="rounded-2xl rounded-tl-md bg-primary/8 border border-primary/20 px-3 py-2.5">
              <p className="text-sm font-medium leading-relaxed text-foreground">
                {currentStep.chipMessage}
              </p>
            </div>

            {/* Content */}
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {currentStep.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {currentStep.description}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
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

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleNext}
                size="lg"
                className="flex-1 rounded-xl"
              >
                {isLastStep ? "Got It!" : "Next"}
                <ArrowRight className="size-4" />
              </Button>
              {step === 0 && (
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
