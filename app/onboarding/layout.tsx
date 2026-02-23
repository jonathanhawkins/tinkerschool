import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Welcome to TinkerSchool!",
  description: "Set up your family's learning adventure on TinkerSchool.",
  robots: { index: false, follow: false },
};

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userId: string | null = null;

  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch (err) {
    console.error("[onboarding/layout] auth() threw:", err);
  }

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-accent">
      {/* Top bar with branding */}
      <header className="flex w-full items-center justify-center px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/chip.png"
            alt="Chip"
            width={36}
            height={36}
            className="rounded-xl"
          />
          <span className="text-xl font-bold text-primary">
            TinkerSchool
          </span>
        </div>
      </header>

      {/* Centered content area */}
      <main className="flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 pb-12">
        {children}
      </main>
    </div>
  );
}
