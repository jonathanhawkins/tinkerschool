"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SupportCardProps {
  kidName: string;
  lessonsCompleted: number;
  className?: string;
}

export function SupportCard({
  kidName,
  lessonsCompleted,
  className,
}: SupportCardProps) {
  const [dismissed, setDismissed] = useState(false);

  const hasLessons = lessonsCompleted > 0;
  const message = hasLessons
    ? `${kidName} has completed ${lessonsCompleted} lesson${lessonsCompleted !== 1 ? "s" : ""} powered by AI that costs real money to run. Want to help keep TinkerSchool free for every family?`
    : `${kidName} is getting started on a learning journey powered by AI. Want to help keep TinkerSchool free for every family?`;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50 to-amber-50/80 dark:border-orange-900/40 dark:from-orange-950/30 dark:to-amber-950/20",
            className,
          )}
        >
          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-black/5 hover:text-muted-foreground dark:hover:bg-white/10"
            aria-label="Dismiss support card"
          >
            <X className="size-3.5" />
          </button>

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
            {/* Icon */}
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/40">
              <Heart className="size-5 text-orange-500" />
            </div>

            {/* Message */}
            <div className="min-w-0 flex-1 pr-6 sm:pr-0">
              <p className="text-sm font-semibold text-foreground">
                Support TinkerSchool
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {message}
              </p>
            </div>

            {/* CTA */}
            <Button
              asChild
              size="sm"
              className="shrink-0 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
            >
              <Link href="/dashboard/billing">
                <Heart className="size-4 mr-2" />
                Support TinkerSchool
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
