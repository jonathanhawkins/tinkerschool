import { describe, it, expect } from "vitest";

import {
  parseActivityConfig,
  isInteractiveLesson,
  parseNarrativeConfig,
  isNarrativeLesson,
  type LessonActivityConfig,
  type MultipleChoiceContent,
  type CountingContent,
} from "./types";

// =============================================================================
// Test Fixtures
// =============================================================================
// Realistic content samples representing the two formats found in the database.

/** Old-format content: 78 Band 2 lessons use this sections-based structure */
const OLD_FORMAT_CONTENT: Record<string, unknown> = {
  sections: {
    story: {
      title: "The Pattern Detective",
      narrative: "Chip discovers patterns everywhere...",
      character_emotion: "analytical",
    },
    explore: {
      title: "Find the Pattern",
      instructions: "Display shows sequences...",
      activity_type: "pattern_finder",
    },
    practice: {
      title: "Pattern Challenges",
      problems: [
        { type: "ab_pattern", elements: "colors", difficulty: "seed" },
      ],
    },
    create: {
      title: "My Pattern",
      prompt: "Create your own pattern...",
      share_enabled: true,
    },
    celebrate: {
      title: "Pattern Spotter!",
      summary: "You can spot patterns like a detective!",
      parent_note: "Your child practiced pattern recognition...",
    },
  },
  standards: ["ISTE:CT.1"],
  cross_subject_connections: ["math:patterns"],
};

/** New-format content: uses the activities array with typed widgets */
const NEW_FORMAT_CONTENT: Record<string, unknown> = {
  activities: [
    {
      type: "multiple_choice",
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
        },
      ],
    },
  ],
};

/** Content with only a story section (no explore) */
const STORY_ONLY_CONTENT: Record<string, unknown> = {
  sections: {
    story: {
      title: "The Colors of Music",
      narrative: "Chip hears different sounds...",
      character_emotion: "excited",
    },
  },
};

/** Content with only an explore section (no story) */
const EXPLORE_ONLY_CONTENT: Record<string, unknown> = {
  sections: {
    explore: {
      title: "Sound Explorer",
      instructions: "Tap the buttons to hear different notes...",
      activity_type: "sound_explorer",
    },
  },
};

/** Content with BOTH activities and sections -- activities should win */
const HYBRID_CONTENT: Record<string, unknown> = {
  activities: [
    {
      type: "counting",
      questions: [
        {
          id: "c1",
          prompt: "Count the birds",
          emoji: "🐦",
          correctCount: 5,
          displayCount: 5,
        },
      ],
    },
  ],
  sections: {
    story: {
      title: "Bird Counting",
      narrative: "Chip sees birds in the park...",
    },
    explore: {
      title: "Count Along",
      instructions: "Count the birds on the screen...",
    },
  },
};

// =============================================================================
// parseActivityConfig
// =============================================================================

describe("parseActivityConfig", () => {
  it("returns null for empty object", () => {
    expect(parseActivityConfig({})).toBeNull();
  });

  it("returns null for null/undefined-ish input", () => {
    expect(
      parseActivityConfig(null as unknown as Record<string, unknown>),
    ).toBeNull();
    expect(
      parseActivityConfig(undefined as unknown as Record<string, unknown>),
    ).toBeNull();
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

  it("returns null when content has sections key but no activities key", () => {
    expect(parseActivityConfig(OLD_FORMAT_CONTENT)).toBeNull();
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

    const result = parseActivityConfig(
      config as unknown as Record<string, unknown>,
    );
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

    const result = parseActivityConfig(
      config as unknown as Record<string, unknown>,
    );
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

  it("returns null when activity type field is a number instead of string", () => {
    expect(
      parseActivityConfig({ activities: [{ type: 42 }] }),
    ).toBeNull();
  });

  it("returns null when activity is null inside the array", () => {
    expect(
      parseActivityConfig({ activities: [null] }),
    ).toBeNull();
  });
});

// =============================================================================
// isInteractiveLesson
// =============================================================================

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

  it("returns false for project lesson_type", () => {
    expect(isInteractiveLesson("project", validContent)).toBe(false);
  });

  it("returns false for interactive type with empty content", () => {
    expect(isInteractiveLesson("interactive", {})).toBe(false);
  });

  it("returns false for interactive type with invalid activities", () => {
    expect(
      isInteractiveLesson("interactive", {
        activities: [{ type: "unknown" }],
      }),
    ).toBe(false);
  });

  it("returns false for interactive type with old-format sections content (KEY REGRESSION)", () => {
    expect(isInteractiveLesson("interactive", OLD_FORMAT_CONTENT)).toBe(false);
  });

  it("returns true for interactive type with new-format activities content", () => {
    expect(isInteractiveLesson("interactive", NEW_FORMAT_CONTENT)).toBe(true);
  });
});

// =============================================================================
// parseNarrativeConfig
// =============================================================================

describe("parseNarrativeConfig", () => {
  it("returns valid config when content has sections with story", () => {
    const result = parseNarrativeConfig(STORY_ONLY_CONTENT);
    expect(result).not.toBeNull();
    expect(result!.sections.story).toBeDefined();
    expect(result!.sections.story!.title).toBe("The Colors of Music");
  });

  it("returns valid config when content has sections with explore", () => {
    const result = parseNarrativeConfig(EXPLORE_ONLY_CONTENT);
    expect(result).not.toBeNull();
    expect(result!.sections.explore).toBeDefined();
    expect(result!.sections.explore!.title).toBe("Sound Explorer");
  });

  it("returns valid config for full old-format content with all sections", () => {
    const result = parseNarrativeConfig(OLD_FORMAT_CONTENT);
    expect(result).not.toBeNull();
    expect(result!.sections.story).toBeDefined();
    expect(result!.sections.explore).toBeDefined();
    expect(result!.sections.practice).toBeDefined();
    expect(result!.sections.create).toBeDefined();
    expect(result!.sections.celebrate).toBeDefined();
  });

  it("preserves standards and cross_subject_connections", () => {
    const result = parseNarrativeConfig(OLD_FORMAT_CONTENT);
    expect(result).not.toBeNull();
    expect(result!.standards).toEqual(["ISTE:CT.1"]);
    expect(result!.cross_subject_connections).toEqual(["math:patterns"]);
  });

  it("returns null when content has no sections key", () => {
    expect(parseNarrativeConfig(NEW_FORMAT_CONTENT)).toBeNull();
  });

  it("returns null when content is empty", () => {
    expect(parseNarrativeConfig({})).toBeNull();
  });

  it("returns null for null/undefined input", () => {
    expect(
      parseNarrativeConfig(null as unknown as Record<string, unknown>),
    ).toBeNull();
    expect(
      parseNarrativeConfig(undefined as unknown as Record<string, unknown>),
    ).toBeNull();
  });

  it("returns null when sections is not an object", () => {
    expect(parseNarrativeConfig({ sections: "not-object" })).toBeNull();
    expect(parseNarrativeConfig({ sections: 42 })).toBeNull();
    expect(parseNarrativeConfig({ sections: true })).toBeNull();
    expect(parseNarrativeConfig({ sections: [] })).toBeNull();
  });

  it("returns null when sections is empty (no story or explore)", () => {
    expect(parseNarrativeConfig({ sections: {} })).toBeNull();
  });

  it("returns null when sections has only practice (no story or explore)", () => {
    expect(
      parseNarrativeConfig({
        sections: {
          practice: {
            title: "Practice Time",
            problems: [{ type: "addition" }],
          },
        },
      }),
    ).toBeNull();
  });

  it("returns null when sections has only celebrate (no story or explore)", () => {
    expect(
      parseNarrativeConfig({
        sections: {
          celebrate: {
            title: "Great Job!",
            summary: "You did it!",
          },
        },
      }),
    ).toBeNull();
  });

  it("returns valid config when story has title but no narrative", () => {
    // Title alone is enough -- the story section object exists
    const content = {
      sections: {
        story: { title: "A Short Title" },
      },
    };
    const result = parseNarrativeConfig(content);
    expect(result).not.toBeNull();
  });

  it("handles empty practice problems array as still valid narrative", () => {
    const content = {
      sections: {
        story: {
          title: "Test",
          narrative: "A test story.",
        },
        practice: {
          title: "Practice",
          problems: [],
        },
      },
    };
    const result = parseNarrativeConfig(content);
    expect(result).not.toBeNull();
  });

  it("handles missing optional sections (no create, no celebrate)", () => {
    const content = {
      sections: {
        story: {
          title: "Test",
          narrative: "Just a story.",
        },
        explore: {
          title: "Explore",
          instructions: "Just explore.",
        },
        // No practice, no create, no celebrate
      },
    };
    const result = parseNarrativeConfig(content);
    expect(result).not.toBeNull();
    expect(result!.sections.create).toBeUndefined();
    expect(result!.sections.celebrate).toBeUndefined();
  });
});

// =============================================================================
// isNarrativeLesson
// =============================================================================

describe("isNarrativeLesson", () => {
  it("returns true for interactive lesson_type with sections-based content", () => {
    expect(isNarrativeLesson("interactive", OLD_FORMAT_CONTENT)).toBe(true);
  });

  it("returns true for quiz lesson_type with sections-based content", () => {
    expect(isNarrativeLesson("quiz", OLD_FORMAT_CONTENT)).toBe(true);
  });

  it("returns true for story-only content", () => {
    expect(isNarrativeLesson("interactive", STORY_ONLY_CONTENT)).toBe(true);
  });

  it("returns true for explore-only content", () => {
    expect(isNarrativeLesson("interactive", EXPLORE_ONLY_CONTENT)).toBe(true);
  });

  it("returns false for interactive lesson_type with valid activities content", () => {
    expect(isNarrativeLesson("interactive", NEW_FORMAT_CONTENT)).toBe(false);
  });

  it("returns false for project lesson_type even with sections content", () => {
    expect(isNarrativeLesson("project", OLD_FORMAT_CONTENT)).toBe(false);
  });

  it("returns false for creative lesson_type even with sections content", () => {
    expect(isNarrativeLesson("creative", OLD_FORMAT_CONTENT)).toBe(false);
  });

  it("returns true for capstone lesson_type with sections content", () => {
    expect(isNarrativeLesson("capstone", OLD_FORMAT_CONTENT)).toBe(true);
  });

  it("returns false for empty content", () => {
    expect(isNarrativeLesson("interactive", {})).toBe(false);
  });

  it("returns false when sections exists but has no story or explore", () => {
    const content = {
      sections: {
        practice: {
          title: "Orphan Practice",
          problems: [],
        },
      },
    };
    expect(isNarrativeLesson("interactive", content)).toBe(false);
  });
});

// =============================================================================
// Old-format vs new-format content identification
// =============================================================================

describe("old-format vs new-format content identification", () => {
  it("old format content is correctly identified as narrative", () => {
    expect(parseNarrativeConfig(OLD_FORMAT_CONTENT)).not.toBeNull();
  });

  it("old format content is NOT identified as interactive", () => {
    expect(parseActivityConfig(OLD_FORMAT_CONTENT)).toBeNull();
  });

  it("new format content IS identified as interactive", () => {
    expect(parseActivityConfig(NEW_FORMAT_CONTENT)).not.toBeNull();
  });

  it("new format content is NOT identified as narrative", () => {
    // New format has activities but no sections, so narrative parse fails
    expect(parseNarrativeConfig(NEW_FORMAT_CONTENT)).toBeNull();
  });

  it("a lesson cannot be BOTH interactive and narrative", () => {
    // For any given content, at most one of these should return true
    const contentSamples = [
      OLD_FORMAT_CONTENT,
      NEW_FORMAT_CONTENT,
      STORY_ONLY_CONTENT,
      EXPLORE_ONLY_CONTENT,
      HYBRID_CONTENT,
      {},
    ];

    for (const content of contentSamples) {
      const interactive = isInteractiveLesson("interactive", content);
      const narrative = isNarrativeLesson("interactive", content);
      // They should NEVER both be true
      expect(interactive && narrative).toBe(false);
    }
  });

  it("coding lessons with old format should be neither interactive nor narrative if lesson_type is project", () => {
    expect(isInteractiveLesson("project", OLD_FORMAT_CONTENT)).toBe(false);
    expect(isNarrativeLesson("project", OLD_FORMAT_CONTENT)).toBe(false);
  });
});

// =============================================================================
// CRITICAL REGRESSION: Non-coding old-format lessons must never render coding UI
// =============================================================================

describe("lesson rendering path regression", () => {
  it("should not show coding UI for non-coding old-format lessons", () => {
    // The 78 old-format lessons span all non-coding subjects.
    // For each subject, the rendering logic checks isInteractiveLesson first.
    // If false, it checks isNarrativeLesson.
    // Old-format content must route to NarrativeLesson, NOT to coding/workshop CTA.
    const nonCodingSubjects = [
      "math",
      "reading",
      "science",
      "music",
      "art",
      "problem-solving",
    ];

    for (const subject of nonCodingSubjects) {
      // isInteractiveLesson must return false -- old format has no activities array
      expect(isInteractiveLesson("interactive", OLD_FORMAT_CONTENT)).toBe(
        false,
      );
      // isNarrativeLesson must return true -- old format has sections
      expect(isNarrativeLesson("interactive", OLD_FORMAT_CONTENT)).toBe(true);

      // Also test with quiz lesson_type (some subjects use quiz)
      expect(isInteractiveLesson("quiz", OLD_FORMAT_CONTENT)).toBe(false);
      expect(isNarrativeLesson("quiz", OLD_FORMAT_CONTENT)).toBe(true);
    }
  });

  it("should render interactive widget lessons correctly for new format", () => {
    expect(isInteractiveLesson("interactive", NEW_FORMAT_CONTENT)).toBe(true);
    expect(isNarrativeLesson("interactive", NEW_FORMAT_CONTENT)).toBe(false);
  });

  it("old-format lesson with only story section routes to narrative", () => {
    expect(isInteractiveLesson("interactive", STORY_ONLY_CONTENT)).toBe(false);
    expect(isNarrativeLesson("interactive", STORY_ONLY_CONTENT)).toBe(true);
  });

  it("old-format lesson with only explore section routes to narrative", () => {
    expect(isInteractiveLesson("interactive", EXPLORE_ONLY_CONTENT)).toBe(
      false,
    );
    expect(isNarrativeLesson("interactive", EXPLORE_ONLY_CONTENT)).toBe(true);
  });
});

// =============================================================================
// Edge cases: content with both activities AND sections, malformed data
// =============================================================================

describe("edge cases", () => {
  it("content with BOTH activities AND sections: activities takes priority", () => {
    // If a lesson somehow has both, it should be treated as interactive
    // because parseActivityConfig checks activities first, and isNarrativeLesson
    // explicitly defers to activities when they are present.
    expect(isInteractiveLesson("interactive", HYBRID_CONTENT)).toBe(true);
    expect(isNarrativeLesson("interactive", HYBRID_CONTENT)).toBe(false);
  });

  it("content with sections that is not an object is not narrative", () => {
    expect(isNarrativeLesson("interactive", { sections: "string" })).toBe(
      false,
    );
    expect(isNarrativeLesson("interactive", { sections: 123 })).toBe(false);
    expect(isNarrativeLesson("interactive", { sections: null })).toBe(false);
    expect(isNarrativeLesson("interactive", { sections: true })).toBe(false);
  });

  it("content with sections as an array is not narrative", () => {
    // Arrays are typeof 'object' but should not qualify
    expect(
      isNarrativeLesson("interactive", {
        sections: [{ story: { title: "Sneaky" } }],
      }),
    ).toBe(false);
  });

  it("content with sections.story but story has no narrative (title only) is still narrative", () => {
    const content = {
      sections: {
        story: { title: "Just a Title" },
      },
    };
    expect(isNarrativeLesson("interactive", content)).toBe(true);
  });

  it("empty practice.problems array still makes valid narrative", () => {
    const content = {
      sections: {
        story: { title: "Test", narrative: "Once upon a time..." },
        practice: { title: "Practice", problems: [] },
      },
    };
    expect(isNarrativeLesson("interactive", content)).toBe(true);
  });

  it("missing optional sections (no create, no celebrate) still valid narrative", () => {
    const content = {
      sections: {
        story: { title: "Minimal", narrative: "A short story." },
      },
    };
    const result = parseNarrativeConfig(content);
    expect(result).not.toBeNull();
    expect(result!.sections.create).toBeUndefined();
    expect(result!.sections.celebrate).toBeUndefined();
    expect(result!.sections.practice).toBeUndefined();
  });

  it("activities array with one valid and one invalid type returns null", () => {
    const content = {
      activities: [
        { type: "multiple_choice", questions: [] },
        { type: "bogus_widget" },
      ],
    };
    expect(parseActivityConfig(content)).toBeNull();
    expect(isInteractiveLesson("interactive", content)).toBe(false);
  });

  it("deeply nested content without top-level activities is not interactive", () => {
    const content = {
      sections: {
        explore: {
          title: "Hidden Activities",
          activities: [{ type: "multiple_choice" }],
        },
      },
    };
    // The activities key is nested inside sections.explore, not at the top level
    expect(isInteractiveLesson("interactive", content)).toBe(false);
    // But it has sections.explore, so it IS narrative
    expect(isNarrativeLesson("interactive", content)).toBe(true);
  });
});
