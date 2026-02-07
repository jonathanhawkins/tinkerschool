import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ParentNav } from "@/components/parent-nav";

interface ParentNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const parentNavItems: ParentNavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: <LayoutDashboard className="size-4" />,
  },
  {
    href: "/dashboard/progress",
    label: "Progress",
    icon: <BarChart3 className="size-4" />,
  },
  {
    href: "/dashboard/ai-history",
    label: "AI History",
    icon: <MessageSquare className="size-4" />,
  },
];

export default async function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Left: branding */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground leading-tight">
                TinkerSchool
              </p>
              <p className="text-xs text-muted-foreground">
                Parent Dashboard
              </p>
            </div>
          </div>

          {/* Center: navigation */}
          <ParentNav items={parentNavItems} />

          {/* Right: back to kid view */}
          <Button asChild variant="outline" size="sm" className="gap-2 rounded-xl">
            <Link href="/">
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Kid View</span>
            </Link>
          </Button>
        </div>
      </header>

      <Separator />

      {/* Main content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
