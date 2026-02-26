"use client";

// =============================================================================
// usePreKMode - Detect if the current user is in Pre-K mode
// =============================================================================
// Pre-K (grade_level = -1, band = 0 "Seedling") kids are ages 3-5 and can't
// read yet. Activity widgets use this hook to enable audio narration, larger
// touch targets, and simplified UI.
//
// Since the profile is resolved server-side and passed to client components
// as props, this hook accepts the grade level as a parameter rather than
// fetching it from a context or API.
// =============================================================================

import { useMemo } from "react";

import { bandForGrade } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UsePreKModeReturn {
  /** Whether the user is in Pre-K (grade_level === -1) */
  isPreK: boolean;
  /** The curriculum band number (0 = Seedling for Pre-K) */
  band: number;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Determine if the current user is in Pre-K mode.
 *
 * @param gradeLevel - The user's grade level from their profile.
 *   -1 = Pre-K, 0 = Kindergarten, 1-6 = grades 1-6.
 *   `null` or `undefined` defaults to non-Pre-K.
 */
export function usePreKMode(
  gradeLevel: number | null | undefined,
): UsePreKModeReturn {
  return useMemo(() => {
    const grade = gradeLevel ?? 0;
    return {
      isPreK: grade === -1,
      band: bandForGrade(grade),
    };
  }, [gradeLevel]);
}
