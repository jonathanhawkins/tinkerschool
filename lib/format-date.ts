/**
 * Formats an ISO date string into a friendly, human-readable format.
 *
 * @example formatDate("2025-06-15T10:30:00Z") // "Jun 15, 2025"
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats an ISO date string into a short relative or date format.
 *
 * @example formatRelativeDate("2025-06-15T10:30:00Z") // "Jun 15"
 */
export function formatShortDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
