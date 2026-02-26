"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  TreePine,
  Hand,
  Eye,
  Music,
  Footprints,
  Cat,
  Star,
  Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// CoolDownPrompt - Off-screen activity interstitial for Pre-K
// ---------------------------------------------------------------------------
// After every 2 activities in Pre-K mode, this shows a brief "off-screen
// suggestion" encouraging the child to take a quick body break before
// continuing. Parents guide the activity.
// ---------------------------------------------------------------------------

const COOL_DOWN_SUGGESTIONS = [
  {
    text: "Count 5 things in your room!",
    icon: Eye,
    color: "#3B82F6",
  },
  {
    text: "Stand up and stretch like a cat!",
    icon: Cat,
    color: "#A855F7",
  },
  {
    text: "Clap your hands 10 times!",
    icon: Hand,
    color: "#F97316",
  },
  {
    text: "Touch your toes, then reach for the sky!",
    icon: Star,
    color: "#EAB308",
  },
  {
    text: "Take 3 big, deep breaths!",
    icon: Heart,
    color: "#EC4899",
  },
  {
    text: "Walk like a dinosaur around the room!",
    icon: Footprints,
    color: "#22C55E",
  },
  {
    text: "Sing your favorite song!",
    icon: Music,
    color: "#14B8A6",
  },
  {
    text: "Find something green in your room!",
    icon: TreePine,
    color: "#22C55E",
  },
] as const;

interface CoolDownPromptProps {
  /** Called when the child is ready to continue */
  onContinue: () => void;
  /** Optional seed to pick a deterministic suggestion (e.g. activity index) */
  seed?: number;
}

export function CoolDownPrompt({ onContinue, seed = 0 }: CoolDownPromptProps) {
  const [isExiting, setIsExiting] = useState(false);

  // Pick a suggestion based on the seed so it varies between breaks
  const suggestion = useMemo(() => {
    const index = Math.abs(seed) % COOL_DOWN_SUGGESTIONS.length;
    return COOL_DOWN_SUGGESTIONS[index];
  }, [seed]);

  const IconComponent = suggestion.icon;

  const handleContinue = useCallback(() => {
    setIsExiting(true);
    // Small delay so the exit animation plays
    setTimeout(() => {
      onContinue();
    }, 300);
  }, [onContinue]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 py-8 text-center"
        >
          {/* Chip says take a break */}
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={80}
              height={80}
              className="size-20 drop-shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="space-y-2"
          >
            <h3 className="text-xl font-bold text-foreground">
              Quick Break Time!
            </h3>
            <p className="text-sm text-muted-foreground">
              Let&apos;s move our body before the next activity
            </p>
          </motion.div>

          {/* Suggestion card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            className="w-full max-w-xs rounded-2xl border-2 bg-card p-6 shadow-lg"
            style={{ borderColor: `${suggestion.color}40` }}
          >
            <div className="flex flex-col items-center gap-4">
              {/* Icon */}
              <div
                className="flex size-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${suggestion.color}1F` }}
              >
                <IconComponent
                  className="size-8"
                  style={{ color: suggestion.color }}
                />
              </div>

              {/* Text */}
              <p className="text-lg font-semibold leading-snug text-foreground">
                {suggestion.text}
              </p>
            </div>
          </motion.div>

          {/* Continue button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Button
              onClick={handleContinue}
              size="lg"
              className="min-h-[48px] rounded-full px-8 text-base"
            >
              I&apos;m Ready!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
