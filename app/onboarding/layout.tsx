import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata = {
  title: "Welcome to TinkerSchool!",
  description: "Set up your family's learning adventure.",
};

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

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
