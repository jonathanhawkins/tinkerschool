"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeIcon } from "@/lib/badge-icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EarnedBadge {
  name: string;
  icon: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Confetti burst
// ---------------------------------------------------------------------------

function fireCelebration() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.7, x: 0.85 },
    colors: ["#9333ea", "#facc15", "#22c55e", "#ec4899"],
  });
}

// ---------------------------------------------------------------------------
// BadgeCelebration
// ---------------------------------------------------------------------------

interface BadgeCelebrationProps {
  badges: EarnedBadge[];
  onDismiss: () => void;
}

export function BadgeCelebration({ badges, onDismiss }: BadgeCelebrationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Fire confetti on mount and whenever we advance to the next badge
  useEffect(() => {
    fireCelebration();
  }, [currentIndex]);

  // Auto-dismiss after 5 seconds per badge
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (currentIndex < badges.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        onDismiss();
      }
    }, 5000);

    return () => clearTimeout(timerRef.current);
  }, [currentIndex, badges.length, onDismiss]);

  const handleDismiss = useCallback(() => {
    clearTimeout(timerRef.current);
    if (currentIndex < badges.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onDismiss();
    }
  }, [currentIndex, badges.length, onDismiss]);

  const badge = badges[currentIndex];
  if (!badge) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={badge.name}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed bottom-20 right-6 z-50 w-72"
      >
        <Card className="overflow-hidden rounded-2xl border-2 border-yellow-300 bg-gradient-to-br from-purple-50 to-yellow-50 shadow-lg">
          <CardContent className="flex items-start gap-3 p-4">
            {/* Badge icon */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-100">
              <BadgeIcon name={badge.icon} className="size-6 text-purple-600" />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-purple-600">
                You earned a badge!
              </p>
              <p className="text-sm font-bold text-foreground">{badge.name}</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                {badge.description}
              </p>
            </div>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="size-7 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Dismiss badge notification"
            >
              <X className="size-3.5" />
            </Button>
          </CardContent>

          {/* Progress bar for auto-dismiss countdown */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-1 origin-left bg-gradient-to-r from-purple-400 to-yellow-400"
          />
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
