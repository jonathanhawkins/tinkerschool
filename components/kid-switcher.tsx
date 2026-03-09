"use client";

/**
 * KidSwitcher -- a compact dropdown for switching between kid profiles.
 *
 * Shows the active kid's avatar and name. Clicking opens a popover with all
 * kids in the family. Selecting a different kid calls the `switchActiveKid`
 * server action, which sets a cookie and revalidates all pages.
 *
 * Used in the mobile header, desktop sidebar, and tablet bottom nav.
 */

import { useState, useTransition } from "react";
import { ChevronDown, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { switchActiveKid } from "@/app/(dashboard)/settings/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ---------------------------------------------------------------------------
// Avatar emoji mapping (matches onboarding-form.tsx & kid-selector.tsx)
// ---------------------------------------------------------------------------

const AVATAR_EMOJI: Record<string, string> = {
  robot: "\uD83E\uDD16",
  fairy: "\uD83E\uDDDA",
  astronaut: "\uD83D\uDE80",
  wizard: "\uD83E\uDDD9",
  dragon: "\uD83D\uDC32",
  unicorn: "\uD83E\uDD84",
  ninja: "\uD83E\uDD77",
  scientist: "\uD83E\uDDEC",
  parent: "\uD83D\uDC64",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface KidSwitcherOption {
  id: string;
  displayName: string;
  avatarId: string;
}

interface KidSwitcherProps {
  kids: KidSwitcherOption[];
  activeKidId: string | null;
  /** Compact mode for collapsed sidebar or narrow spaces */
  compact?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function KidSwitcher({ kids, activeKidId, compact = false }: KidSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [switchingToId, setSwitchingToId] = useState<string | null>(null);

  // Don't render if there's 0 or 1 kid (no switching needed)
  if (kids.length <= 1) return null;

  const activeKid = kids.find((k) => k.id === activeKidId) ?? kids[0];
  const emoji = AVATAR_EMOJI[activeKid.avatarId] ?? "\uD83D\uDE42";

  function handleSwitch(kidId: string) {
    if (kidId === activeKidId) {
      setOpen(false);
      return;
    }

    setSwitchingToId(kidId);
    startTransition(async () => {
      await switchActiveKid(kidId);
      setSwitchingToId(null);
      setOpen(false);
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "sm"}
          className={cn(
            "gap-1.5 rounded-xl touch-manipulation",
            compact
              ? "size-10"
              : "h-10 px-3",
          )}
          aria-label={`Active learner: ${activeKid.displayName}. Click to switch.`}
        >
          <span className="text-lg leading-none" aria-hidden>
            {emoji}
          </span>
          {!compact && (
            <>
              <span className="max-w-[100px] truncate text-sm font-medium">
                {activeKid.displayName}
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-56 rounded-xl p-1.5"
      >
        <p className="px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
          Switch Learner
        </p>
        <AnimatePresence>
          {kids.map((kid) => {
            const isActive = kid.id === activeKidId;
            const isSwitching = kid.id === switchingToId;
            const kidEmoji = AVATAR_EMOJI[kid.avatarId] ?? "\uD83D\uDE42";

            return (
              <motion.button
                key={kid.id}
                type="button"
                onClick={() => handleSwitch(kid.id)}
                disabled={isPending}
                initial={false}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex w-full min-h-[44px] items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50",
                  "touch-manipulation",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent",
                  isPending && !isSwitching && "opacity-50",
                )}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {kidEmoji}
                </span>
                <span className="flex-1 truncate text-sm font-medium">
                  {kid.displayName}
                </span>
                {isSwitching ? (
                  <Loader2 className="size-4 animate-spin text-primary" />
                ) : isActive ? (
                  <Check className="size-4 text-primary" />
                ) : null}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
