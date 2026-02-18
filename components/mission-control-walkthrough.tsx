"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Compass,
  MessageCircle,
  Rocket,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Mission Control Walkthrough
// ---------------------------------------------------------------------------
// Multi-step guided tour shown when a new user lands on Mission Control
// after completing onboarding (?welcome=true query param).
// Persisted in localStorage so it only shows once.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "tinkerschool_mc_walkthrough_seen";

interface WalkthroughStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const STEPS: WalkthroughStep[] = [
  {
    icon: <Rocket className="size-8 text-primary" />,
    title: "Welcome to Mission Control!",
    description:
      "This is your home base! From here you can see everything -- your progress, your lessons, and what to learn next.",
  },
  {
    icon: <Compass className="size-8 text-blue-500" />,
    title: "Explore 7 Subjects",
    description:
      "Math, Reading, Science, Music, Art, Problem Solving, and Coding -- pick any subject and start exploring fun lessons!",
  },
  {
    icon: <BookOpen className="size-8 text-emerald-500" />,
    title: "Your Missions",
    description:
      "Each subject has missions full of activities. Complete lessons to earn XP, unlock badges, and level up!",
  },
  {
    icon: <MessageCircle className="size-8 text-amber-500" />,
    title: "Chip Is Always Here to Help",
    description:
      "See that orange button in the corner? That's me! Tap it anytime you want to chat, ask a question, or get a hint.",
  },
  {
    icon: <Sparkles className="size-8 text-primary" />,
    title: "Ready for Your First Lesson?",
    description:
      "Look for the \"Start First Lesson\" card on your dashboard. Tap it to begin your adventure!",
  },
];

export function MissionControlWalkthrough() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Only trigger from onboarding redirect (?welcome=true) or if never seen
    const isWelcome = searchParams.get("welcome") === "true";
    if (!isWelcome) return;

    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        setVisible(true);
        // Clean up the URL query param without a page reload
        const url = new URL(window.location.href);
        url.searchParams.delete("welcome");
        window.history.replaceState({}, "", url.pathname);
      }
    } catch {
      // localStorage not available
    }
  }, [searchParams]);

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
                {isLastStep ? "Let's Explore!" : "Next"}
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
