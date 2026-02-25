import { describe, it, expect } from "vitest";

import { lessonActivityConfigSchema, activityContentSchema } from "./schemas";

// ---------------------------------------------------------------------------
// Valid seed-style JSON for each widget type
// ---------------------------------------------------------------------------

const VALID_MULTIPLE_CHOICE = {
  type: "multiple_choice" as const,
  questions: [
    {
      id: "q1",
      prompt: "What is 2 + 2?",
      options: [
        { id: "a", text: "3" },
        { id: "b", text: "4" },
        { id: "c", text: "5" },
      ],
      correctOptionId: "b",
      hint: "Count on your fingers!",
    },
  ],
  shuffleOptions: true,
};

const VALID_COUNTING = {
  type: "counting" as const,
  questions: [
    {
      id: "q1",
      prompt: "How many apples?",
      emoji: "🍎",
      correctCount: 5,
      displayCount: 5,
    },
  ],
};

const VALID_MATCHING_PAIRS = {
  type: "matching_pairs" as const,
  prompt: "Match the number to the word",
  pairs: [
    {
      id: "p1",
      left: { id: "l1", text: "1" },
      right: { id: "r1", text: "one" },
    },
    {
      id: "p2",
      left: { id: "l2", text: "2" },
      right: { id: "r2", text: "two" },
    },
  ],
};

const VALID_SEQUENCE_ORDER = {
  type: "sequence_order" as const,
  questions: [
    {
      id: "q1",
      prompt: "Put the numbers in order",
      items: [
        { id: "i1", text: "3", correctPosition: 3 },
        { id: "i2", text: "1", correctPosition: 1 },
        { id: "i3", text: "2", correctPosition: 2 },
      ],
    },
  ],
};

const VALID_FLASH_CARD = {
  type: "flash_card" as const,
  prompt: "Flip to learn!",
  cards: [
    { id: "fc1", front: "Hello", back: "Hola" },
    {
      id: "fc2",
      front: { text: "Cat", emoji: "🐱" },
      back: { text: "Gato", emoji: "🐈" },
    },
  ],
};

const VALID_FILL_IN_BLANK = {
  type: "fill_in_blank" as const,
  questions: [
    {
      id: "q1",
      template: "The ___ is yellow.",
      correctAnswer: "sun",
      wordBank: ["sun", "moon", "star"],
    },
  ],
};

const VALID_NUMBER_BOND = {
  type: "number_bond" as const,
  questions: [
    {
      id: "q1",
      prompt: "What plus 3 equals 8?",
      whole: 8,
      part1: 3,
      part2: null,
    },
  ],
};

const VALID_TEN_FRAME = {
  type: "ten_frame" as const,
  questions: [
    {
      id: "q1",
      prompt: "Show the number 7",
      targetNumber: 7,
      frameCount: 1 as const,
    },
  ],
};

const VALID_NUMBER_LINE = {
  type: "number_line" as const,
  questions: [
    {
      id: "q1",
      prompt: "What is 5 + 3?",
      min: 0,
      max: 20,
      startPosition: 5,
      correctEndPosition: 8,
      operation: "add" as const,
    },
  ],
};

const VALID_REKENREK = {
  type: "rekenrek" as const,
  questions: [
    {
      id: "q1",
      prompt: "Show the number 12",
      targetNumber: 12,
      mode: "show" as const,
    },
  ],
};

const ALL_VALID_ACTIVITIES = [
  VALID_MULTIPLE_CHOICE,
  VALID_COUNTING,
  VALID_MATCHING_PAIRS,
  VALID_SEQUENCE_ORDER,
  VALID_FLASH_CARD,
  VALID_FILL_IN_BLANK,
  VALID_NUMBER_BOND,
  VALID_TEN_FRAME,
  VALID_NUMBER_LINE,
  VALID_REKENREK,
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("activityContentSchema", () => {
  it.each([
    ["multiple_choice", VALID_MULTIPLE_CHOICE],
    ["counting", VALID_COUNTING],
    ["matching_pairs", VALID_MATCHING_PAIRS],
    ["sequence_order", VALID_SEQUENCE_ORDER],
    ["flash_card", VALID_FLASH_CARD],
    ["fill_in_blank", VALID_FILL_IN_BLANK],
    ["number_bond", VALID_NUMBER_BOND],
    ["ten_frame", VALID_TEN_FRAME],
    ["number_line", VALID_NUMBER_LINE],
    ["rekenrek", VALID_REKENREK],
  ])("parses valid %s content", (_type, content) => {
    const result = activityContentSchema.safeParse(content);
    expect(result.success).toBe(true);
  });

  it("rejects unknown activity type", () => {
    const result = activityContentSchema.safeParse({
      type: "unknown_widget",
      questions: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects multiple_choice with no questions", () => {
    const result = activityContentSchema.safeParse({
      type: "multiple_choice",
      questions: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects ten_frame with invalid frameCount", () => {
    const result = activityContentSchema.safeParse({
      type: "ten_frame",
      questions: [
        { id: "q1", prompt: "Show 5", frameCount: 3 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects rekenrek with targetNumber > 20", () => {
    const result = activityContentSchema.safeParse({
      type: "rekenrek",
      questions: [
        { id: "q1", prompt: "Show 25", targetNumber: 25, mode: "show" },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe("lessonActivityConfigSchema", () => {
  it("parses a valid config with mixed activity types", () => {
    const config = {
      activities: [
        VALID_FLASH_CARD,
        VALID_MULTIPLE_CHOICE,
        VALID_NUMBER_BOND,
      ],
      estimatedMinutes: 5,
      passingScore: 60,
    };

    const result = lessonActivityConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it("parses a config with all 10 widget types", () => {
    const config = {
      activities: ALL_VALID_ACTIVITIES.slice(0, 6), // max 6
    };

    const result = lessonActivityConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it("rejects empty activities array", () => {
    const result = lessonActivityConfigSchema.safeParse({
      activities: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects passingScore > 100", () => {
    const result = lessonActivityConfigSchema.safeParse({
      activities: [VALID_MULTIPLE_CHOICE],
      passingScore: 150,
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields as undefined", () => {
    const result = lessonActivityConfigSchema.safeParse({
      activities: [VALID_MULTIPLE_CHOICE],
    });
    expect(result.success).toBe(true);
  });
});
