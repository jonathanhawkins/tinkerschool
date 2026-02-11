import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Heart,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ParentNav } from "@/components/parent-nav";
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
    href: "/dashboard/billing",
    label: "Support",
    icon: <Heart className="size-4" />,
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
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Left: branding */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={36}
              height={36}
              className="size-9 rounded-xl"
            />
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
          <Suspense>
            <ParentNav items={parentNavItems} />
          </Suspense>

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
