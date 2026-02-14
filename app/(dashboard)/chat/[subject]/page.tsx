import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

import { SubjectIcon } from "@/components/subject-icon";
import { requireAuth, getActiveKidProfile } from "@/lib/auth/require-auth";
import { FadeIn } from "@/components/motion";
import type { Subject } from "@/lib/supabase/types";
import { safeColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ChipChat from "@/components/chip-chat";

// ---------------------------------------------------------------------------
// Valid subject slugs
// ---------------------------------------------------------------------------

const VALID_SUBJECTS = [
  "math",
  "reading",
  "science",
  "music",
  "art",
  "problem-solving",
  "coding",
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function FreeplayChatPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: subjectSlug } = await params;

  if (!VALID_SUBJECTS.includes(subjectSlug as (typeof VALID_SUBJECTS)[number])) {
    notFound();
  }

  const { profile, supabase } = await requireAuth();

  // Resolve the active kid profile for chat personalization
  const kidProfile = await getActiveKidProfile(profile, supabase);
  const activeProfile = kidProfile ?? profile;

  // Fetch the subject by slug
  const { data: subject } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", subjectSlug)
    .single();

  if (!subject) {
    notFound();
  }

  const safeSubject = { ...(subject as Subject), color: safeColor((subject as Subject).color) };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* ----- Breadcrumb / back ----- */}
      <FadeIn>
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-lg px-2"
          >
            <Link href={`/subjects/${safeSubject.slug}`}>
              <ArrowLeft className="size-4" />
              {safeSubject.display_name}
            </Link>
          </Button>
          <ChevronRight className="size-3.5" />
          <span className="truncate font-medium text-foreground">
            Chat with Chip
          </span>
        </nav>
      </FadeIn>

      {/* ----- Header ----- */}
      <FadeIn delay={0.05}>
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${safeSubject.color}1F` }}
          >
            <SubjectIcon
              icon={safeSubject.icon}
              className="size-5"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              {safeSubject.display_name} Chat
            </h1>
            <p className="text-xs text-muted-foreground">
              Ask Chip anything about {safeSubject.display_name.toLowerCase()}!
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ----- Chat ----- */}
      <FadeIn delay={0.1} className="min-h-0 flex-1">
        <ChipChat
          kidName={activeProfile.display_name}
          age={activeProfile.grade_level ? activeProfile.grade_level + 5 : 7}
          band={activeProfile.current_band}
          currentSubject={safeSubject.slug}
        />
      </FadeIn>
    </div>
  );
}
