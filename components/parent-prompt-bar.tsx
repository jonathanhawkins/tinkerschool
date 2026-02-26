"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X } from "lucide-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// ParentPromptBar - Contextual co-play suggestions for Pre-K parents
// ---------------------------------------------------------------------------
// A subtle bar at the bottom of Pre-K activities that shows suggestions for
// parents to engage with their child during the activity.
//
// Examples:
//   "Try asking: 'Which one is bigger?'"
//   "Say the numbers out loud together!"
//   "Count on your fingers together!"
// ---------------------------------------------------------------------------

interface ParentPromptBarProps {
  /** The contextual suggestion to show to the parent */
  prompt: string;
  /** Only render when true (Pre-K mode) */
  isPreK: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function ParentPromptBar({
  prompt,
  isPreK,
  className,
}: ParentPromptBarProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
  }, []);

  if (!isPreK || !prompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "flex items-center gap-3 rounded-2xl px-4 py-3",
            "bg-amber-50 dark:bg-amber-950/30",
            "border border-amber-200/60 dark:border-amber-800/40",
            className,
          )}
        >
          {/* Parent icon badge */}
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-amber-200/60 px-2.5 py-1 dark:bg-amber-900/40">
            <Users className="size-3.5 text-amber-700 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Parent
            </span>
          </div>

          {/* Prompt text */}
          <p className="min-w-0 flex-1 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
            {prompt}
          </p>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-amber-500 transition-colors hover:bg-amber-200/50 hover:text-amber-700 dark:hover:bg-amber-800/30 dark:hover:text-amber-300"
            aria-label="Dismiss parent suggestion"
          >
            <X className="size-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
