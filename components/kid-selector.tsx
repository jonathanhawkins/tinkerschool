"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Avatar mapping (matches AVATAR_OPTIONS in onboarding-form.tsx)
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

export interface KidOption {
  id: string;
  displayName: string;
  avatarId: string;
}

interface KidSelectorProps {
  kids: KidOption[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function KidSelector({ kids }: KidSelectorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedKid = searchParams.get("kid");

  // Validate that the selected kid actually belongs to this family
  const validKidIds = new Set(kids.map((k) => k.id));
  const activeKidId = selectedKid && validKidIds.has(selectedKid) ? selectedKid : null;

  const handleSelect = useCallback(
    (kidId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (kidId === null) {
        params.delete("kid");
      } else {
        params.set("kid", kidId);
      }

      const query = params.toString();
      router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  return (
    <nav
      aria-label="Filter by child"
      className="flex flex-wrap items-center gap-2"
    >
      {/* "All Kids" pill */}
      <Pill
        isActive={activeKidId === null}
        onClick={() => handleSelect(null)}
        aria-pressed={activeKidId === null}
      >
        <Users className="size-4" />
        <span>All Kids</span>
      </Pill>

      {/* Per-kid pills */}
      {kids.map((kid) => (
        <Pill
          key={kid.id}
          isActive={activeKidId === kid.id}
          onClick={() => handleSelect(kid.id)}
          aria-pressed={activeKidId === kid.id}
        >
          <span className="text-base leading-none" aria-hidden>
            {AVATAR_EMOJI[kid.avatarId] ?? "\uD83D\uDE42"}
          </span>
          <span>{kid.displayName}</span>
        </Pill>
      ))}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Pill sub-component
// ---------------------------------------------------------------------------

interface PillProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  "aria-pressed"?: boolean;
}

function Pill({ isActive, onClick, children, ...rest }: PillProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        "inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
