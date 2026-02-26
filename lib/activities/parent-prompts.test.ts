import { describe, it, expect } from "vitest";

import { getParentPrompt } from "./parent-prompts";
import type { ActivityContent } from "./types";

// ---------------------------------------------------------------------------
// Helper to build a minimal ActivityContent for a given type
// ---------------------------------------------------------------------------
function activityOfType(type: string): ActivityContent {
  return { type } as unknown as ActivityContent;
}

// ---------------------------------------------------------------------------
// getParentPrompt
// ---------------------------------------------------------------------------

describe("getParentPrompt", () => {
  it('returns a string for "counting" activity', () => {
    const result = getParentPrompt(activityOfType("counting"), 0);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns a string for "multiple_choice" activity', () => {
    const result = getParentPrompt(activityOfType("multiple_choice"), 0);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("rotates through prompts based on questionIndex", () => {
    const prompt0 = getParentPrompt(activityOfType("counting"), 0);
    const prompt1 = getParentPrompt(activityOfType("counting"), 1);
    expect(prompt0).not.toBe(prompt1);
  });

  it("wraps around when questionIndex exceeds prompt count", () => {
    // "counting" has 4 prompts, so index 4 wraps to index 0
    const prompt0 = getParentPrompt(activityOfType("counting"), 0);
    const prompt4 = getParentPrompt(activityOfType("counting"), 4);
    expect(prompt4).toBe(prompt0);
  });

  it("returns a default prompt for an unknown activity type", () => {
    const result = getParentPrompt(activityOfType("totally_unknown_type"), 0);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("all known activity types return non-empty prompt strings", () => {
    const knownTypes = [
      "counting",
      "multiple_choice",
      "matching_pairs",
      "sequence_order",
      "flash_card",
      "number_bond",
      "ten_frame",
      "number_line",
      "emotion_picker",
      "drag_to_sort",
      "listen_and_find",
      "tap_and_reveal",
      "trace_shape",
      "rekenrek",
      "parent_activity",
    ];

    for (const type of knownTypes) {
      const result = getParentPrompt(activityOfType(type), 0);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    }
  });

  it("handles negative questionIndex via Math.abs", () => {
    const promptPositive = getParentPrompt(activityOfType("counting"), 2);
    const promptNegative = getParentPrompt(activityOfType("counting"), -2);
    expect(promptNegative).toBe(promptPositive);
  });
});
