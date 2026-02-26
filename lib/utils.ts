import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ---------------------------------------------------------------------------
// Grade / curriculum band utilities
// ---------------------------------------------------------------------------

/** Valid grade level values: -1 = Pre-K, 0 = Kindergarten, 1-6 = grades 1-6. */
export const VALID_GRADES = [-1, 0, 1, 2, 3, 4, 5, 6] as const;

export const GRADE_LABELS: Record<number, string> = {
  [-1]: "Pre-K",
  0: "Kindergarten",
  1: "1st Grade",
  2: "2nd Grade",
  3: "3rd Grade",
  4: "4th Grade",
  5: "5th Grade",
  6: "6th Grade",
};

/** Human-readable names for each curriculum band. */
export const BAND_NAMES: Record<number, string> = {
  0: "Seedling",
  1: "Explorer",
  2: "Builder",
  3: "Inventor",
  4: "Hacker",
  5: "Creator",
};

/**
 * Maps a grade level to its curriculum band number.
 *
 * Band 0 (Seedling):  Pre-K
 * Band 1 (Explorer):  K-1
 * Band 2 (Builder):   2-3
 * Band 3 (Inventor):  4
 * Band 4 (Hacker):    5
 * Band 5 (Creator):   6
 */
export function bandForGrade(grade: number): number {
  if (grade < 0) return 0;  // Seedling: Pre-K
  if (grade <= 1) return 1;  // Explorer: K-1
  if (grade <= 3) return 2;  // Builder: 2-3
  if (grade <= 4) return 3;  // Inventor: 3-4
  if (grade <= 5) return 4;  // Hacker: 4-5
  return 5; // Creator: 5-6
}

/**
 * Validate that a string is a well-formed UUID (v1-v5 / nil).
 * Rejects non-hex characters, wrong length, or missing hyphens.
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(value: string): boolean {
  return UUID_RE.test(value);
}

/**
 * Validate and sanitize a CSS hex color value.
 *
 * Prevents CSS injection when database-sourced color strings are used
 * in inline style attributes (e.g. `style={{ color: safeColor(val) }}`).
 *
 * Returns the color if it's a valid 3, 4, 6, or 8-digit hex color,
 * otherwise returns a safe fallback.
 */
const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function safeColor(color: string | null | undefined, fallback = "#64748B"): string {
  if (!color || !HEX_COLOR_RE.test(color)) {
    return fallback;
  }
  return color;
}
