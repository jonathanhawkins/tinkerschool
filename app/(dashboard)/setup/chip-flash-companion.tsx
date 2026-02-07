"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bot,
  ChevronDown,
  PartyPopper,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import type { FlashStep } from "./firmware-flasher";

// ---------------------------------------------------------------------------
// Step messages — kid-friendly translations of each flash step
// ---------------------------------------------------------------------------

const STEP_MESSAGES: Record<FlashStep, { text: string; detail?: string }> = {
  idle: {
    text: "Beep boop! Ready to set up your M5Stick!",
    detail: "Plug it in and hit the big button when you're ready.",
  },
  downloading: {
    text: "Grabbing the special code for your device...",
    detail: "Think of it like downloading a new brain for your M5Stick!",
  },
  connecting: {
    text: "Looking for your M5Stick...",
    detail: "I'm trying to find your little buddy. Make sure it's plugged in!",
  },
  erasing: {
    text: "Cleaning up your device...",
    detail: "It's like erasing a whiteboard so we can draw something new!",
  },
  flashing: {
    text: "Writing new code to your device!",
    detail: "Almost there... watch the progress bar!",
  },
  done: {
    text: "Circuit high-five! Your M5Stick is ready!",
    detail: "Let's go to the Workshop and start coding!",
  },
  error: {
    text: "Oops! Something went a little wonky.",
    detail: "No worries — just check the cable and try again!",
  },
};

// ---------------------------------------------------------------------------
// Mood icon per step
// ---------------------------------------------------------------------------

function MoodIcon({ step }: { step: FlashStep }) {
  switch (step) {
    case "done":
      return <PartyPopper className="size-4 text-green-500" />;
    case "error":
      return <AlertCircle className="size-4 text-amber-500" />;
    case "flashing":
      return <Zap className="size-4 text-primary" />;
    default:
      return <Sparkles className="size-4 text-primary" />;
  }
}

// ---------------------------------------------------------------------------
// Bouncing dots (waiting indicator)
// ---------------------------------------------------------------------------

function BouncingDots() {
  return (
    <span className="flex gap-1">
      <span className="size-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ChipFlashCompanionProps {
  step: FlashStep;
  progress: number;
}

export default function ChipFlashCompanion({
  step,
  progress,
}: ChipFlashCompanionProps) {
  const [open, setOpen] = useState(true);

  const msg = STEP_MESSAGES[step];
  const isWaiting =
    step === "downloading" || step === "connecting" || step === "erasing";
  const isActive = step !== "idle" && step !== "done" && step !== "error";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Speech bubble */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-72 rounded-2xl border p-4 shadow-lg",
              step === "error"
                ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950"
                : step === "done"
                  ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
                  : "border-primary/20 bg-background"
            )}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-muted-foreground"
              aria-label="Hide Chip"
            >
              <X className="size-3.5" />
            </button>

            {/* Header */}
            <div className="mb-1 flex items-center gap-1.5">
              <span className="text-xs font-bold text-primary">Chip</span>
              <MoodIcon step={step} />
            </div>

            {/* Message with animated transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <p className="text-sm font-medium text-foreground">
                  {msg.text}
                </p>
                {msg.detail && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {msg.detail}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Progress bar during flashing */}
            {step === "flashing" && (
              <div className="mt-2.5 space-y-1">
                <Progress value={progress} className="h-2.5" />
                <p className="text-center text-xs font-medium text-primary">
                  {progress}% done!
                </p>
              </div>
            )}

            {/* Bouncing dots during waiting states */}
            {isWaiting && (
              <div className="mt-2 flex justify-start">
                <BouncingDots />
              </div>
            )}

            {/* Workshop link on success */}
            {step === "done" && (
              <a
                href="/workshop"
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Zap className="size-3" />
                Go to Workshop
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chip avatar FAB */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "relative flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-shadow hover:shadow-xl",
          isActive && "ring-2 ring-primary/40 ring-offset-2"
        )}
        aria-label={open ? "Hide Chip" : "Show Chip"}
      >
        <Bot className="size-6" />
        {/* Activity pulse */}
        {isActive && (
          <span className="absolute -right-0.5 -top-0.5 flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex size-3 rounded-full bg-primary" />
          </span>
        )}
        {/* Collapse indicator when open */}
        {open && (
          <span className="absolute -left-1 -top-1 flex size-4 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-sm">
            <ChevronDown className="size-3" />
          </span>
        )}
      </motion.button>
    </div>
  );
}
