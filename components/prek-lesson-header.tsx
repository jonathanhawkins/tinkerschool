"use client";

/**
 * PreKLessonHeader - A simplified, visual-first header for Pre-K lessons.
 *
 * Replaces the text-heavy default lesson header for band 0 kids who cannot
 * read. Shows a large emoji/illustration, the lesson title spoken aloud by
 * Chip, and a prominent "Talk to Chip" button. Minimal text on screen.
 */

import { motion, useReducedMotion } from "framer-motion";
import { Volume2 } from "lucide-react";
import Image from "next/image";

import { useAudioNarration } from "@/hooks/use-audio-narration";
import { cn } from "@/lib/utils";

interface PreKLessonHeaderProps {
  /** Lesson title (displayed large) */
  title: string;
  /** Chip's opening line for this lesson */
  storyText: string | null;
  /** Subject color for accent theming */
  subjectColor: string;
  /** Large emoji to display as the lesson's visual centerpiece */
  heroEmoji?: string;
}

export function PreKLessonHeader({
  title,
  storyText,
  subjectColor,
  heroEmoji,
}: PreKLessonHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const { speak, isSpeaking, isSupported } = useAudioNarration({
    rate: 0.82,
    pitch: 1.1,
    enabled: true,
  });

  // Pick a fallback emoji from the title if none provided
  const displayEmoji = heroEmoji ?? "⭐";

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center gap-5 py-6 text-center"
    >
      {/* Hero emoji — big and visual */}
      <motion.div
        initial={prefersReducedMotion ? {} : { scale: 0.8 }}
        animate={prefersReducedMotion ? {} : { scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="flex size-28 items-center justify-center rounded-3xl shadow-lg"
        style={{ backgroundColor: `${subjectColor}20` }}
      >
        <span className="text-6xl" role="img" aria-label={title}>
          {displayEmoji}
        </span>
      </motion.div>

      {/* Lesson title — big, readable, fun */}
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ color: subjectColor }}
      >
        {title}
      </h1>

      {/* Chip says section — the voice-first intro */}
      {storyText && (
        <div className="flex w-full max-w-sm flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={40}
              height={40}
              className="size-10 rounded-full object-cover shadow-md"
            />
            <span className="text-sm font-semibold text-primary">
              Chip says:
            </span>
          </div>

          {/* Big readable story text */}
          <p className="text-lg leading-relaxed text-foreground/90">
            {storyText}
          </p>

          {/* Listen again button — big touch target */}
          {isSupported && (
            <motion.button
              type="button"
              onClick={() => speak(storyText)}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-3",
                "bg-primary/10 text-primary font-semibold text-base",
                "hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50",
                "touch-manipulation min-h-[48px]",
              )}
              aria-label={
                isSpeaking ? "Chip is speaking..." : "Hear Chip again"
              }
            >
              <Volume2 className="size-5" />
              {isSpeaking ? "Chip is talking..." : "Hear Again"}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}
