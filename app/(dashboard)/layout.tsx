import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ChipVoiceServer from "@/components/chip-voice-server";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileNav } from "@/components/mobile-nav";

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

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Desktop sidebar - hidden on small/medium screens */}
      <DashboardSidebar
        displayName={displayName}
        avatarInitial={avatarInitial}
        email={email}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header with hamburger menu */}
        <MobileNav />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 pb-24 md:p-6 md:pb-24 lg:p-8 lg:pb-24">
          {children}
        </main>
      </div>

      {/* Floating Chip voice button — persists across all dashboard pages */}
      <Suspense fallback={null}>
        <ChipVoiceServer />
      </Suspense>
    </div>
  );
}
