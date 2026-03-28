import type { Metadata } from "next";
import { Suspense } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard-sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import { getActiveKidProfile, getFamilyKids } from "@/lib/auth/require-auth";
import type { Profile } from "@/lib/supabase/types";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { KidSwitcherOption } from "@/components/kid-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { TabletBottomNav } from "@/components/tablet-bottom-nav";
import { ChipTextFabServer } from "@/components/chip-text-fab-server";
import { DevDebugWidget } from "@/components/dev-debug-widget";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const displayName =
    user?.firstName ?? user?.username ?? "Coder";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const email = user?.primaryEmailAddress?.emailAddress ?? "Ready to code!";

  // Fetch kid profiles for the kid switcher. This is a lightweight query
  // that only runs when the parent is authenticated (kids don't see the switcher).
  let kids: KidSwitcherOption[] = [];
  let activeKidId: string | null = null;
  try {
    // Use admin client directly (not requireAuth) so that a missing profile
    // doesn't throw redirect("/onboarding") into this catch and silently swallow it.
    // The child page will call requireAuth() itself and handle the redirect properly.
    const supabase = createAdminSupabaseClient();
    const { data: profile } = (await supabase
      .from("profiles")
      .select("*")
      .eq("clerk_id", userId)
      .single()) as { data: Profile | null };
    if (profile?.role === "parent") {
      const familyKids = await getFamilyKids(profile, supabase);
      kids = familyKids.map((k) => ({
        id: k.id,
        displayName: k.display_name,
        avatarId: k.avatar_id,
      }));
      const activeKid = await getActiveKidProfile(profile, supabase);
      activeKidId = activeKid?.id ?? null;
    }
  } catch {
    // Non-fatal -- if this fails, the switcher simply won't show
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row" data-dashboard-root>
      {/* Desktop sidebar - hidden on small/medium screens */}
      <div data-dashboard-sidebar>
        <DashboardSidebar
          displayName={displayName}
          avatarInitial={avatarInitial}
          email={email}
          kids={kids}
          activeKidId={activeKidId}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile/tablet header with hamburger menu */}
        <div data-mobile-nav>
          <MobileNav kids={kids} activeKidId={activeKidId} />
        </div>

        {/* Page content -- extra bottom padding for tablet bottom nav */}
        <main className="flex-1 overflow-y-auto bg-background p-4 pb-24 md:p-6 md:pb-24 lg:p-8 lg:pb-8" data-dashboard-main>
          {children}
        </main>
      </div>

      {/* Tablet/phone bottom navigation bar -- hidden on desktop (lg+) */}
      <div data-tablet-bottom-nav>
        <TabletBottomNav />
      </div>

      {/* Chip voice FAB lives in the root layout (app/layout.tsx) so it
          persists across navigations without being affected by this
          dynamic layout's re-renders. */}

      {/* Text-based Chip FAB -- always available as a fallback when the
          Hume voice FAB is not configured. The text FAB automatically
          hides itself when the voice FAB is active. */}
      <Suspense fallback={null}>
        <ChipTextFabServer />
      </Suspense>

      {/* Dev-only debug widget for testing onboarding/walkthroughs */}
      {process.env.NODE_ENV !== "production" && <DevDebugWidget />}
    </div>
  );
}
