import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";

import { getAllFeedback, checkIsSiteAdmin } from "../actions";
import { FeedbackAdminClient } from "./feedback-admin-client";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Feedback Admin | TinkerSchool",
  robots: { index: false, follow: false },
};

export default async function FeedbackAdminPage() {
  // Check admin access
  const isAdmin = await checkIsSiteAdmin();
  if (!isAdmin) {
    redirect("/dashboard/feedback");
  }

  const feedback = await getAllFeedback();

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Feedback Admin
              </h1>
              <p className="text-sm text-muted-foreground">
                Review and manage all user feedback submissions.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
          >
            <Link href="/dashboard/feedback">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Admin panel */}
      <FadeIn delay={0.05}>
        <FeedbackAdminClient initialFeedback={feedback} />
      </FadeIn>
    </div>
  );
}
