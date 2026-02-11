"use client";

/**
 * TabletBottomNav -- touch-optimized bottom tab bar for tablets and phones.
 *
 * Replaces the desktop sidebar and mobile hamburger menu with a persistent
 * bottom navigation bar, following the same pattern as native tablet apps.
 *
 * Shows the 5 most important nav destinations with large touch targets (56px).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Wrench,
  Trophy,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface TabItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const TAB_ITEMS: TabItem[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/workshop", label: "Workshop", icon: Wrench },
  { href: "/achievements", label: "Awards", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function TabletBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch justify-around">
        {TAB_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 px-1 transition-colors",
                "touch-manipulation", // eliminates 300ms tap delay
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground",
              )}
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="tablet-nav-indicator"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="size-6" />
              <span className="text-[10px] font-medium leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
