"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, GraduationCap } from "lucide-react";

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

export function MobileNav() {
  const items = navItems;
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile header bar - visible on small/medium screens, hidden on lg+ */}
      <header className="flex h-16 items-center gap-3 border-b border-border bg-sidebar px-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="size-10"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="size-6" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary">TinkerSchool</span>
        </div>
      </header>

      {/* Sheet drawer from left */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="px-4 pt-6 pb-2">
            <SheetTitle asChild>
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
                  <GraduationCap className="size-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-primary">
                  TinkerSchool
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>
          <Separator />
          <nav className="flex flex-col gap-1.5 p-4">
            {items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-xl px-4 text-base font-medium transition-colors",
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
