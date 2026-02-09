import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
