"use client";

// =============================================================================
// PreKStoryNarrator - Auto-narrate lesson story text for Pre-K kids
// =============================================================================
// A client island that auto-speaks the story_text when a Pre-K lesson loads.
// Renders a speaker replay button alongside the story text. Also shows the
// story text in a larger, more visual format appropriate for Pre-K.
//
// For non-Pre-K users, this component renders nothing (the parent Server
// Component should not render it at all, but this is a safety check).
// =============================================================================

import { Volume2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { useAudioNarration } from "@/hooks/use-audio-narration";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PreKStoryNarratorProps {
  /** The story text to narrate */
  storyText: string;
  /** Whether this is a Pre-K lesson (band === 0) */
  isPreK: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PreKStoryNarrator({
  storyText,
  isPreK,
}: PreKStoryNarratorProps) {
  const { speak, isSpeaking, isSupported } = useAudioNarration({
    rate: 0.82,
    pitch: 1.1,
    enabled: isPreK,
  });
  const prefersReducedMotion = useReducedMotion();

  // No auto-speak — narration starts only when the user taps "Hear Again"
  // This avoids burning voice/TTS tokens on every page load.

  if (!isPreK) return null;

  return (
    <div className="space-y-3">
      {/* Chip avatar + speaking indicator */}
      <div className="flex items-center gap-3">
        <motion.div
          className="relative"
          animate={
            isSpeaking && !prefersReducedMotion
              ? {
                  boxShadow: [
                    "0 0 0 0px rgba(249,115,22,0.3)",
                    "0 0 0 10px rgba(249,115,22,0)",
                  ],
                }
              : {}
          }
          transition={
            isSpeaking && !prefersReducedMotion
              ? { duration: 1.2, repeat: Infinity, ease: "easeOut" }
              : { duration: 0.15 }
          }
          style={{ borderRadius: "9999px" }}
        >
          <Image
            src="/images/chip.png"
            alt="Chip"
            width={48}
            height={48}
            className="size-12 rounded-full object-cover shadow-md"
          />
          {isSpeaking && (
            <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-emerald-500" />
          )}
        </motion.div>

        <div className="flex-1">
          <span className="text-sm font-semibold text-primary">
            Chip says:
          </span>
        </div>

        {/* Replay button */}
        {isSupported && (
          <motion.button
            type="button"
            onClick={() => speak(storyText)}
            whileHover={prefersReducedMotion ? {} : { scale: 1.08 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.93 }}
            className={cn(
              "flex size-11 items-center justify-center rounded-full",
              "bg-primary/10 text-primary",
              "hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50",
              "transition-colors touch-manipulation",
            )}
            aria-label={isSpeaking ? "Chip is speaking..." : "Hear Chip again"}
          >
            <Volume2 className="size-5" />
          </motion.button>
        )}
      </div>

      {/* Story text - larger and more visual for Pre-K */}
      <p className="text-base leading-relaxed text-foreground/90">
        {storyText}
      </p>
    </div>
  );
}
