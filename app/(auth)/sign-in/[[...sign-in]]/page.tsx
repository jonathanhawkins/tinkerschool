import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-accent">
      <SignIn />
    </div>
  );
}
