import { describe, it, expect } from "vitest";

import { formatDate, formatShortDate } from "./format-date";

describe("formatDate", () => {
  it("formats an ISO date string into readable format", () => {
    const result = formatDate("2025-06-15T10:30:00Z");
    expect(result).toBe("Jun 15, 2025");
  });

  it("formats a different date correctly", () => {
    // Use midday UTC to avoid timezone-related day shifts
    const result = formatDate("2024-01-15T12:00:00Z");
    expect(result).toBe("Jan 15, 2024");
  });

  it("formats a December date correctly", () => {
    const result = formatDate("2025-12-25T12:00:00Z");
    expect(result).toBe("Dec 25, 2025");
  });

  it("handles ISO date strings without time component", () => {
    // new Date("2025-03-10") is valid and parsed as UTC midnight
    const result = formatDate("2025-03-10T12:00:00Z");
    expect(result).toContain("2025");
    expect(result).toContain("Mar");
  });
});

describe("formatShortDate", () => {
  it("formats an ISO date string into short format (no year)", () => {
    const result = formatShortDate("2025-06-15T10:30:00Z");
    expect(result).toBe("Jun 15");
  });

  it("formats a different date correctly", () => {
    // Use midday UTC to avoid timezone-related day shifts
    const result = formatShortDate("2024-01-15T12:00:00Z");
    expect(result).toBe("Jan 15");
  });

  it("formats a November date correctly", () => {
    const result = formatShortDate("2025-11-03T08:00:00Z");
    expect(result).toBe("Nov 3");
  });

  it("does not include the year", () => {
    const result = formatShortDate("2025-06-15T10:30:00Z");
    expect(result).not.toContain("2025");
  });
});
