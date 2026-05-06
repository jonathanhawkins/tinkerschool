import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Parent Dashboard | TinkerSchool",
  robots: { index: false, follow: false },
};
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  MessageSquare,
  MessageSquarePlus,
  Heart,
  Settings,
  ArrowLeft,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ParentNav } from "@/components/parent-nav";
import { ParentMobileMenu } from "@/components/parent-mobile-menu";
import { KidSelector } from "@/components/kid-selector";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Profile } from "@/lib/supabase/types";

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
    href: "/dashboard/reports",
    label: "Reports",
    icon: <TrendingUp className="size-4" />,
  },
  {
    href: "/dashboard/ai-history",
    label: "AI History",
    icon: <MessageSquare className="size-4" />,
  },
  {
    href: "/dashboard/events",
    label: "Events",
    icon: <Activity className="size-4" />,
  },
  {
    href: "/dashboard/feedback",
    label: "Feedback",
    icon: <MessageSquarePlus className="size-4" />,
  },
  {
    href: "/dashboard/billing",
    label: "Support",
    icon: <Heart className="size-4" />,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: <Settings className="size-4" />,
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

  // Verify the user is a parent — kids should not access parent dashboard.
  // Uses admin client since this is a server-side guard (no RLS needed for role check).
  const supabase = createAdminSupabaseClient();
  const { data: profile } = (await supabase
    .from("profiles")
    .select("role, family_id")
    .eq("clerk_id", userId)
    .single()) as { data: { role: string; family_id: string } | null };

  if (!profile || profile.role !== "parent") {
    redirect("/home");
  }

  // Fetch kid profiles in this family for the KidSelector
  const { data: kidProfiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_id")
    .eq("family_id", profile.family_id)
    .eq("role", "kid")
    .order("created_at");

  const kids = (kidProfiles ?? []) as Pick<Profile, "id" | "display_name" | "avatar_id">[];

  const kidOptions = kids.map((k) => ({
    id: k.id,
    displayName: k.display_name,
    avatarId: k.avatar_id,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Top row: hamburger (mobile) + branding + back to kid view */}
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:h-16 sm:gap-3 sm:px-6">
          <Suspense>
            <ParentMobileMenu items={parentNavItems} />
          </Suspense>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={36}
              height={36}
              className="size-9 shrink-0 rounded-xl"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight text-foreground">
                TinkerSchool
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Parent Dashboard
              </p>
            </div>
          </div>

          <Button asChild variant="outline" size="sm" className="shrink-0 gap-2 rounded-xl">
            <Link href="/">
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Kid View</span>
            </Link>
          </Button>
        </div>

        {/* Bottom row: navigation tabs (desktop only -- mobile uses the hamburger menu) */}
        <div className="mx-auto hidden max-w-6xl border-t border-border/60 px-4 sm:px-6 lg:block">
          <Suspense>
            <ParentNav items={parentNavItems} />
          </Suspense>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* Kid selector -- only shown when family has 2+ kids */}
        {kidOptions.length >= 2 && (
          <div className="mb-6">
            <Suspense>
              <KidSelector kids={kidOptions} />
            </Suspense>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
