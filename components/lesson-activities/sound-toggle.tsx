"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSound } from "@/lib/activities/use-sound";

// ---------------------------------------------------------------------------
// SoundToggle - mute/unmute button for the activity area
// ---------------------------------------------------------------------------
// Small, unobtrusive toggle. Designed to live near the progress bar without
// drawing attention away from the activity itself.
// ---------------------------------------------------------------------------

export function SoundToggle() {
  const { muted, toggleMute } = useSound();

  return (
    <motion.button
      onClick={toggleMute}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "flex size-9 items-center justify-center rounded-xl border transition-colors duration-200",
        "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50",
        muted
          ? "border-border bg-muted/30 text-muted-foreground"
          : "border-border bg-card text-foreground",
      )}
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
    >
      {muted ? (
        <VolumeX className="size-4" />
      ) : (
        <Volume2 className="size-4" />
      )}
    </motion.button>
  );
}
