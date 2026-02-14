import { Suspense } from "react";

import ChipChat from "@/components/chip-chat";
import { Skeleton } from "@/components/ui/skeleton";
import { requireAuth, getActiveKidProfile } from "@/lib/auth/require-auth";

// ---------------------------------------------------------------------------
// Approximate age from grade level (grade 0 = ~5 yrs, grade 1 = ~6 yrs, etc.)
// Defaults to 7 if grade_level is null.
// ---------------------------------------------------------------------------
function gradeToAge(gradeLevel: number | null): number {
  if (gradeLevel === null) return 7;
  return Math.max(5, Math.min(12, gradeLevel + 5));
}

// ---------------------------------------------------------------------------
// Data fetching from Supabase profile
// ---------------------------------------------------------------------------

async function getKidProfile(): Promise<{
  kidName: string;
  age: number;
  band: number;
}> {
  const { profile, supabase } = await requireAuth();

  // Resolve the active kid profile for chat personalization
  const kidProfile = await getActiveKidProfile(profile, supabase);
  const activeProfile = kidProfile ?? profile;

  return {
    kidName: activeProfile.display_name,
    age: gradeToAge(activeProfile.grade_level),
    band: activeProfile.current_band,
  };
}

// ---------------------------------------------------------------------------
// Chat loading skeleton
// ---------------------------------------------------------------------------

function ChatSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex-1 space-y-3">
        <Skeleton className="h-12 w-3/4 rounded-2xl" />
        <Skeleton className="ml-auto h-8 w-1/2 rounded-2xl" />
        <Skeleton className="h-10 w-2/3 rounded-2xl" />
      </div>
      <Skeleton className="h-10 w-full rounded-full" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inner async component (wrapped in Suspense)
// ---------------------------------------------------------------------------

async function ChipChatWithData({
  currentLesson,
  currentCode,
}: {
  currentLesson?: string;
  currentCode?: string;
}) {
  const { kidName, age, band } = await getKidProfile();

  return (
    <ChipChat
      kidName={kidName}
      age={age}
      band={band}
      currentLesson={currentLesson}
      currentCode={currentCode}
    />
  );
}

// ---------------------------------------------------------------------------
// Exported wrapper (Server Component)
// ---------------------------------------------------------------------------

interface ChipChatWrapperProps {
  currentLesson?: string;
  currentCode?: string;
}

export default function ChipChatWrapper({
  currentLesson,
  currentCode,
}: ChipChatWrapperProps) {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChipChatWithData
        currentLesson={currentLesson}
        currentCode={currentCode}
      />
    </Suspense>
  );
}
