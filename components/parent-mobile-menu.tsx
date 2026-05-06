"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface ParentMobileMenuItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface ParentMobileMenuProps {
  items: ParentMobileMenuItem[];
}

export function ParentMobileMenu({ items }: ParentMobileMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const kidParam = searchParams.get("kid");

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-10 shrink-0 lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="px-4 pt-6 pb-2">
            <SheetTitle>Parent Dashboard</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1.5 p-4">
            {items.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              const href = kidParam ? `${item.href}?kid=${kidParam}` : item.href;

              return (
                <Link
                  key={item.href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-xl px-4 text-base font-medium transition-colors touch-manipulation",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive &&
                      "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                  )}
                >
                  <span className="shrink-0 [&>svg]:size-5">{item.icon}</span>
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
