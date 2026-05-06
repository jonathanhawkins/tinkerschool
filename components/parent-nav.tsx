"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

interface ParentNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface ParentNavProps {
  items: ParentNavItem[];
}

export function ParentNav({ items }: ParentNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Preserve the ?kid= param when navigating between sub-pages
  const kidParam = searchParams.get("kid");

  return (
    <nav
      className={cn(
        "-mx-4 flex items-center gap-1 overflow-x-auto px-4 sm:-mx-6 sm:px-6",
        // Hide the horizontal scrollbar — items still scroll via touch/wheel.
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
      )}
    >
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
            className={cn(
              "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground",
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
