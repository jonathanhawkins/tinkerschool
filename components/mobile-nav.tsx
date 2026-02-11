"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

/**
 * Items shown in the bottom tab nav -- the hamburger menu only shows
 * additional pages not covered by the bottom nav.
 */
const BOTTOM_NAV_HREFS = new Set([
  "/home",
  "/subjects",
  "/workshop",
  "/achievements",
  "/settings",
]);

export function MobileNav() {
  const items = navItems;
  // Items not in the bottom tab nav -- these go in the hamburger drawer
  const drawerItems = items.filter((item) => !BOTTOM_NAV_HREFS.has(item.href));
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile/tablet header bar - visible on small/medium screens, hidden on lg+ */}
      <header className="flex h-14 items-center gap-3 border-b border-border bg-sidebar px-4 lg:hidden">
        {/* Hamburger menu -- only needed for overflow nav items */}
        {drawerItems.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="size-10 touch-manipulation"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <Image
            src="/images/chip.png"
            alt="Chip"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-primary">TinkerSchool</span>
        </div>
      </header>

      {/* Sheet drawer for overflow items not in bottom nav */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="px-4 pt-6 pb-2">
            <SheetTitle asChild>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/chip.png"
                  alt="Chip"
                  width={36}
                  height={36}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-primary">
                  TinkerSchool
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>
          <Separator />
          <nav className="flex flex-col gap-1.5 p-4">
            {drawerItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-xl px-4 text-base font-medium transition-colors touch-manipulation",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive &&
                      "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  )}
                >
                  <Icon className="size-6 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
