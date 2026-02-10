"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Lightbulb,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Lesson Walkthrough - Guides first-time users through the activity system
// ---------------------------------------------------------------------------
// Shows a multi-step overlay explaining how interactive lessons work.
// Persists dismissal in localStorage so it only shows once.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "tinkerschool_walkthrough_seen";

interface WalkthroughStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const STEPS: WalkthroughStep[] = [
  {
    icon: <Sparkles className="size-8 text-primary" />,
    title: "Welcome to Your First Lesson!",
    description:
      "Interactive lessons are fun activities where you'll answer questions, sort things, match pairs, and more!",
  },
  {
    icon: <Target className="size-8 text-emerald-500" />,
    title: "Answer Questions",
    description:
      "Read the question carefully and pick your answer. Don't worry if you get it wrong -- you can always try again!",
  },
  {
    icon: <Lightbulb className="size-8 text-amber-500" />,
    title: "Use Hints if You're Stuck",
    description:
      "If a question is tricky, look for the hint button. Chip will give you a clue to help you figure it out.",
  },
  {
    icon: <BookOpen className="size-8 text-blue-500" />,
    title: "Track Your Progress",
    description:
      "The progress bar at the top shows how far you've come. Complete all the activities to finish the lesson and earn XP!",
  },
];

interface LessonWalkthroughProps {
  /** Whether to show (only on first lesson with no completed lessons) */
  isFirstLesson: boolean;
}

export function LessonWalkthrough({ isFirstLesson }: LessonWalkthroughProps) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isFirstLesson) return;
    // Check if already seen
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        setVisible(true);
      }
    } catch {
      // localStorage not available, skip
    }
  }, [isFirstLesson]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  }, []);

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-md space-y-5 rounded-2xl bg-card p-6 shadow-xl"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="absolute right-4 top-4 size-8"
              aria-label="Skip walkthrough"
            >
              <X className="size-4" />
            </Button>

            {/* Chip + step icon */}
            <div className="flex items-center gap-4">
              <Image
                src="/images/chip.png"
                alt="Chip"
                width={56}
                height={56}
                className="size-14 shrink-0 drop-shadow-md"
              />
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                {currentStep.icon}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">
                {currentStep.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {currentStep.description}
              </p>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === step
                      ? "w-6 bg-primary"
                      : i < step
                        ? "w-3 bg-primary/40"
                        : "w-3 bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleNext}
                size="lg"
                className="flex-1 rounded-xl"
              >
                {isLastStep ? "Let's Go!" : "Next"}
                <ArrowRight className="size-4" />
              </Button>
              {!isLastStep && (
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
