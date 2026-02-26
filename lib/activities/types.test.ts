import { describe, it, expect } from "vitest";

import {
  parseActivityConfig,
  isInteractiveLesson,
  type LessonActivityConfig,
  type MultipleChoiceContent,
  type CountingContent,
} from "./types";

// ---------------------------------------------------------------------------
// parseActivityConfig
// ---------------------------------------------------------------------------

describe("parseActivityConfig", () => {
  it("returns null for empty object", () => {
    expect(parseActivityConfig({})).toBeNull();
  });

  it("returns null for null/undefined-ish input", () => {
    expect(parseActivityConfig(null as unknown as Record<string, unknown>)).toBeNull();
    expect(parseActivityConfig(undefined as unknown as Record<string, unknown>)).toBeNull();
  });

  it("returns null when activities is not an array", () => {
    expect(parseActivityConfig({ activities: "not-array" })).toBeNull();
  });

  it("returns null when activities is empty", () => {
    expect(parseActivityConfig({ activities: [] })).toBeNull();
  });

  it("returns null when activity has invalid type", () => {
    expect(
      parseActivityConfig({
        activities: [{ type: "invalid_widget" }],
      }),
    ).toBeNull();
  });

  it("returns null when activity is missing type", () => {
    expect(
      parseActivityConfig({
        activities: [{ questions: [] }],
      }),
    ).toBeNull();
  });

  it("parses valid multiple_choice config", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "multiple_choice",
          questions: [
            {
              id: "q1",
              prompt: "What is 1+1?",
              options: [
                { id: "a", text: "2" },
                { id: "b", text: "3" },
              ],
              correctOptionId: "a",
            },
          ],
        } as MultipleChoiceContent,
      ],
    };

    const result = parseActivityConfig(config as unknown as Record<string, unknown>);
    expect(result).not.toBeNull();
    expect(result!.activities).toHaveLength(1);
    expect(result!.activities[0].type).toBe("multiple_choice");
  });

  it("parses valid counting config", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "counting",
          questions: [
            {
              id: "c1",
              prompt: "Count the stars",
              emoji: "\u2b50",
              correctCount: 3,
              displayCount: 3,
            },
          ],
        } as CountingContent,
      ],
    };

    const result = parseActivityConfig(config as unknown as Record<string, unknown>);
    expect(result).not.toBeNull();
    expect(result!.activities[0].type).toBe("counting");
  });

  it("parses config with multiple activities", () => {
    const config = {
      activities: [
        { type: "matching_pairs", prompt: "Match!", pairs: [] },
        { type: "sequence_order", questions: [] },
      ],
    };

    const result = parseActivityConfig(config);
    expect(result).not.toBeNull();
    expect(result!.activities).toHaveLength(2);
  });

  it("preserves passingScore and estimatedMinutes", () => {
    const config = {
      activities: [{ type: "flash_card", prompt: "Flip!", cards: [] }],
      passingScore: 80,
      estimatedMinutes: 10,
    };

    const result = parseActivityConfig(config);
    expect(result).not.toBeNull();
    expect(result!.passingScore).toBe(80);
    expect(result!.estimatedMinutes).toBe(10);
  });

  it("accepts all valid activity types", () => {
    const validTypes = [
      "multiple_choice",
      "counting",
      "matching_pairs",
      "sequence_order",
      "flash_card",
      "fill_in_blank",
      "number_bond",
      "ten_frame",
      "number_line",
      "rekenrek",
      "parent_activity",
      "emotion_picker",
      "drag_to_sort",
      "tap_and_reveal",
      "listen_and_find",
      "trace_shape",
    ];

    for (const type of validTypes) {
      const config = { activities: [{ type }] };
      const result = parseActivityConfig(config);
      expect(result).not.toBeNull();
    }
  });

  it("parses valid number_bond config", () => {
    const config = {
      activities: [
        {
          type: "number_bond",
          questions: [
            {
              id: "nb1",
              prompt: "Find the missing part",
              whole: 10,
              part1: 6,
              part2: null,
            },
          ],
        },
      ],
    };

    const result = parseActivityConfig(config);
    expect(result).not.toBeNull();
    expect(result!.activities[0].type).toBe("number_bond");
  });

  it("parses valid ten_frame config", () => {
    const config = {
      activities: [
        {
          type: "ten_frame",
          questions: [
            {
              id: "tf1",
              prompt: "Show 7",
              targetNumber: 7,
              frameCount: 1,
            },
          ],
        },
      ],
    };

    const result = parseActivityConfig(config);
    expect(result).not.toBeNull();
    expect(result!.activities[0].type).toBe("ten_frame");
  });

  it("parses valid number_line config", () => {
    const config = {
      activities: [
        {
          type: "number_line",
          questions: [
            {
              id: "nl1",
              prompt: "Add 3 + 4",
              min: 0,
              max: 15,
              startPosition: 3,
              correctEndPosition: 7,
              operation: "add",
            },
          ],
        },
      ],
    };

    const result = parseActivityConfig(config);
    expect(result).not.toBeNull();
    expect(result!.activities[0].type).toBe("number_line");
  });

  it("parses valid rekenrek config", () => {
    const config = {
      activities: [
        {
          type: "rekenrek",
          questions: [
            {
              id: "rk1",
              prompt: "Show 8",
              targetNumber: 8,
              mode: "show",
            },
          ],
        },
      ],
    };

    const result = parseActivityConfig(config);
    expect(result).not.toBeNull();
    expect(result!.activities[0].type).toBe("rekenrek");
  });
});

// ---------------------------------------------------------------------------
// isInteractiveLesson
// ---------------------------------------------------------------------------

describe("isInteractiveLesson", () => {
  const validContent = {
    activities: [{ type: "multiple_choice", questions: [] }],
  };

  it("returns true for interactive lesson_type with valid content", () => {
    expect(isInteractiveLesson("interactive", validContent)).toBe(true);
  });

  it("returns true for quiz lesson_type with valid content", () => {
    expect(isInteractiveLesson("quiz", validContent)).toBe(true);
  });

  it("returns false for creative lesson_type even with valid content", () => {
    expect(isInteractiveLesson("creative", validContent)).toBe(false);
  });

  it("returns false for capstone lesson_type", () => {
    expect(isInteractiveLesson("capstone", validContent)).toBe(false);
  });

  it("returns false for interactive type with empty content", () => {
    expect(isInteractiveLesson("interactive", {})).toBe(false);
  });

  it("returns false for interactive type with invalid activities", () => {
    expect(
      isInteractiveLesson("interactive", { activities: [{ type: "unknown" }] }),
    ).toBe(false);
  });
});
