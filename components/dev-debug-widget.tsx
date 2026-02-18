"use client";

import { useCallback, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, RotateCcw, Eye, X, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { resetProgress, resetOnboarding } from "@/app/(dashboard)/settings/actions";

// ---------------------------------------------------------------------------
// Dev-only debug widget — floating panel for testing onboarding, walkthroughs,
// and progress resets. Only rendered when NODE_ENV !== "production".
// ---------------------------------------------------------------------------

const WALKTHROUGH_KEYS = [
  "tinkerschool_walkthrough_seen",
  "tinkerschool_mc_walkthrough_seen",
  "tinkerschool-tutorial-progress",
  "tinkerschool_onboarding",
];

export function DevDebugWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  const showStatus = useCallback((msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 3000);
  }, []);

  const handleResetWalkthroughs = useCallback(() => {
    for (const key of WALKTHROUGH_KEYS) {
      localStorage.removeItem(key);
    }
    showStatus("Walkthroughs reset! Reload to see them again.");
  }, [showStatus]);

  const handleResetProgress = useCallback(() => {
    if (!confirm("Reset all progress, badges, XP, and streaks?")) return;
    startTransition(async () => {
      await resetProgress();
      // Also clear walkthrough localStorage
      for (const key of WALKTHROUGH_KEYS) {
        localStorage.removeItem(key);
      }
      showStatus("Progress reset! Reload to see changes.");
    });
  }, [showStatus]);

  const handleResetOnboarding = useCallback(() => {
    if (!confirm("Delete profile & family? You'll be redirected to onboarding.")) return;
    startTransition(async () => {
      // Clear all localStorage
      for (const key of WALKTHROUGH_KEYS) {
        localStorage.removeItem(key);
      }
      await resetOnboarding();
      window.location.href = "/onboarding";
    });
  }, []);

  return (
    <div className="fixed bottom-20 left-3 z-50 lg:bottom-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-2 w-64 rounded-2xl border border-border bg-background p-4 shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Dev Tools
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2">
              <DebugAction
                icon={<Eye className="size-3.5" />}
                label="Reset Walkthroughs"
                description="Show tutorial overlays again"
                onClick={handleResetWalkthroughs}
                disabled={isPending}
              />
              <DebugAction
                icon={<RotateCcw className="size-3.5" />}
                label="Reset Progress"
                description="Clear XP, badges, streaks"
                onClick={handleResetProgress}
                disabled={isPending}
                variant="warning"
              />
              <DebugAction
                icon={<RotateCcw className="size-3.5" />}
                label="Reset Onboarding"
                description="Delete profile, restart from scratch"
                onClick={handleResetOnboarding}
                disabled={isPending}
                variant="destructive"
              />

              <div className="border-t border-border pt-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Quick Links
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {[
                    { label: "Onboarding", href: "/onboarding" },
                    { label: "Home", href: "/home?welcome=true" },
                    { label: "Subjects", href: "/subjects" },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center gap-0.5 rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                      <ChevronRight className="size-3" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Status toast */}
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  {status}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-muted"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Dev Debug Tools"
      >
        <Bug className="size-4 text-muted-foreground" />
      </motion.button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DebugAction row
// ---------------------------------------------------------------------------

interface DebugActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "warning" | "destructive";
}

function DebugAction({
  icon,
  label,
  description,
  onClick,
  disabled,
  variant = "default",
}: DebugActionProps) {
  const colorClasses = {
    default: "hover:bg-muted",
    warning: "hover:bg-amber-50 dark:hover:bg-amber-950/30",
    destructive: "hover:bg-red-50 dark:hover:bg-red-950/30",
  };

  const iconColors = {
    default: "text-foreground",
    warning: "text-amber-600",
    destructive: "text-red-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors disabled:opacity-50 ${colorClasses[variant]}`}
    >
      <span className={`mt-0.5 ${iconColors[variant]}`}>{icon}</span>
      <div>
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
