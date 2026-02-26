"use client";

// =============================================================================
// AudioReplayButton - Tap to hear the prompt read aloud
// =============================================================================
// A reusable speaker button for Pre-K activities. Shows a subtle pulsing
// animation while audio is playing. Large touch target (44px+) for small hands.
// =============================================================================

import { Volume2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useAudioNarration } from "@/hooks/use-audio-narration";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AudioReplayButtonProps {
  /** The text to speak when tapped */
  text: string;
  /** Optional additional CSS classes */
  className?: string;
  /** Button size variant */
  size?: "sm" | "md" | "lg";
  /** Whether narration is enabled (hide button if not) */
  enabled?: boolean;
}

// ---------------------------------------------------------------------------
// Size config
// ---------------------------------------------------------------------------

const SIZE_CLASSES = {
  sm: "size-9",
  md: "size-11",
  lg: "size-14",
} as const;

const ICON_CLASSES = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AudioReplayButton({
  text,
  className,
  size = "md",
  enabled = true,
}: AudioReplayButtonProps) {
  const { speak, isSpeaking, isSupported } = useAudioNarration({ enabled });
  const prefersReducedMotion = useReducedMotion();

  // Don't render if speech synthesis is not supported or disabled
  if (!isSupported || !enabled) {
    return null;
  }

  function handleClick() {
    speak(text);
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={isSpeaking ? "Speaking..." : "Listen to this question"}
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "bg-primary/10 text-primary",
        "hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50",
        "transition-colors touch-manipulation",
        SIZE_CLASSES[size],
        className,
      )}
      whileHover={prefersReducedMotion ? {} : { scale: 1.08 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.93 }}
      animate={
        isSpeaking && !prefersReducedMotion
          ? {
              boxShadow: [
                "0 0 0 0px rgba(249,115,22,0.3)",
                "0 0 0 8px rgba(249,115,22,0)",
              ],
            }
          : {}
      }
      transition={
        isSpeaking && !prefersReducedMotion
          ? { duration: 1.2, repeat: Infinity, ease: "easeOut" }
          : { duration: 0.15 }
      }
    >
      <Volume2 className={ICON_CLASSES[size]} />
    </motion.button>
  );
}
