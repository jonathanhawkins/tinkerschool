import { describe, it, expect } from "vitest";

import { summarizeActivities, buildVoiceLessonContext } from "./lesson-context-builder";
import type { LessonActivityConfig } from "@/lib/activities/types";

// ---------------------------------------------------------------------------
// summarizeActivities
// ---------------------------------------------------------------------------

describe("summarizeActivities", () => {
  it("summarizes multiple_choice activity with correct answers", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "multiple_choice",
          questions: [
            {
              id: "q1",
              prompt: "What is 2 + 2?",
              hint: "Count on your fingers",
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

    const result = summarizeActivities(config);

    expect(result).toHaveLength(1);
    expect(result[0].widgetType).toBe("multiple_choice");
    expect(result[0].questionCount).toBe(1);
    expect(result[0].questions[0].prompt).toBe("What is 2 + 2?");
    expect(result[0].questions[0].correctAnswer).toBe("4");
    expect(result[0].questions[0].hint).toBe("Count on your fingers");
    expect(result[0].questions[0].options).toEqual(["3", "4", "5"]);
  });

  it("summarizes counting activity", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "counting",
          questions: [
            {
              id: "q1",
              prompt: "How many apples?",
              hint: "Count them one by one",
              correctCount: 5,
              items: [],
            },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].widgetType).toBe("counting");
    expect(result[0].questions[0].correctAnswer).toBe("5");
  });

  it("summarizes matching_pairs activity", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "matching_pairs",
          prompt: "Match the animals",
          hint: "Think about where they live",
          pairs: [
            { left: { id: "l1", text: "Dog" }, right: { id: "r1", text: "Bark" } },
            { left: { id: "l2", text: "Cat" }, right: { id: "r2", text: "Meow" } },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].widgetType).toBe("matching_pairs");
    expect(result[0].questions[0].correctAnswer).toContain("Dog");
    expect(result[0].questions[0].correctAnswer).toContain("Bark");
  });

  it("summarizes sequence_order activity", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "sequence_order",
          questions: [
            {
              id: "q1",
              prompt: "Put in order",
              hint: "Smallest to biggest",
              items: [
                { id: "a", text: "Cat", correctPosition: 2 },
                { id: "b", text: "Ant", correctPosition: 1 },
                { id: "c", text: "Elephant", correctPosition: 3 },
              ],
            },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].questions[0].correctAnswer).toBe("Ant, Cat, Elephant");
  });

  it("summarizes flash_card activity", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "flash_card",
          cards: [
            {
              id: "c1",
              front: { text: "2 + 3" },
              back: { text: "5" },
            },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].widgetType).toBe("flash_card");
    expect(result[0].questions[0].prompt).toBe("2 + 3");
    expect(result[0].questions[0].correctAnswer).toBe("5");
  });

  it("summarizes fill_in_blank activity", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "fill_in_blank",
          questions: [
            {
              id: "q1",
              template: "The ___ is round",
              correctAnswer: "ball",
              hint: "You can bounce it",
            },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].questions[0].correctAnswer).toBe("ball");
    expect(result[0].questions[0].prompt).toBe("The ___ is round");
  });

  it("summarizes number_bond activity - missing whole", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "number_bond",
          questions: [
            {
              id: "q1",
              prompt: "What is the whole?",
              hint: "Add the parts",
              whole: null,
              part1: 3,
              part2: 4,
            },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].questions[0].correctAnswer).toBe("7");
  });

  it("summarizes number_bond activity - missing part1", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "number_bond",
          questions: [
            {
              id: "q1",
              prompt: "Find the missing part",
              hint: "Subtract",
              whole: 10,
              part1: null,
              part2: 6,
            },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].questions[0].correctAnswer).toBe("4");
  });

  it("summarizes number_bond activity - missing part2", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "number_bond",
          questions: [
            {
              id: "q1",
              prompt: "Find the missing part",
              hint: "Subtract",
              whole: 8,
              part1: 3,
              part2: null,
            },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].questions[0].correctAnswer).toBe("5");
  });

  it("summarizes ten_frame activity with targetNumber", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "ten_frame",
          questions: [
            {
              id: "q1",
              prompt: "Fill the frame to show 7",
              hint: "Count the circles",
              targetNumber: 7,
            },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].questions[0].correctAnswer).toBe("7");
  });

  it("summarizes ten_frame activity with add operation", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "ten_frame",
          questions: [
            {
              id: "q1",
              prompt: "What is 3 + 4?",
              hint: "Use the frame",
              operation: { type: "add", a: 3, b: 4 },
            },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].questions[0].correctAnswer).toBe("7");
  });

  it("summarizes ten_frame activity with subtract operation", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "ten_frame",
          questions: [
            {
              id: "q1",
              prompt: "What is 9 - 3?",
              hint: "Take away",
              operation: { type: "subtract", a: 9, b: 3 },
            },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].questions[0].correctAnswer).toBe("6");
  });

  it("summarizes number_line activity", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "number_line",
          questions: [
            {
              id: "q1",
              prompt: "Jump to 8",
              hint: "Count the hops",
              min: 0,
              max: 10,
              startPosition: 3,
              correctEndPosition: 8,
            },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].questions[0].correctAnswer).toBe("8");
  });

  it("summarizes rekenrek activity", () => {
    const config: LessonActivityConfig = {
      activities: [
        {
          type: "rekenrek",
          questions: [
            {
              id: "q1",
              prompt: "Show 12 on the rekenrek",
              hint: "Use both rows",
              targetNumber: 12,
              rows: 2,
            },
          ],
        },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].questions[0].correctAnswer).toBe("12");
  });

  it("caps total questions at MAX_QUESTIONS (15)", () => {
    const manyQuestions = Array.from({ length: 20 }, (_, i) => ({
      id: `q${i}`,
      prompt: `Question ${i}?`,
      hint: "hint",
      correctCount: i,
      items: [],
    }));

    const config: LessonActivityConfig = {
      activities: [
        { type: "counting", questions: manyQuestions },
      ],
    };

    const result = summarizeActivities(config);

    expect(result[0].questions).toHaveLength(15);
    expect(result[0].questionCount).toBe(20); // Original count preserved
  });

  it("returns empty array for empty activities", () => {
    const config: LessonActivityConfig = { activities: [] };

    const result = summarizeActivities(config);

    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// buildVoiceLessonContext
// ---------------------------------------------------------------------------

describe("buildVoiceLessonContext", () => {
  const baseLessonData = {
    id: "lesson-001",
    title: "Adding Numbers",
    description: "Learn to add single-digit numbers",
    story_text: "Once upon a time...",
    lesson_type: "interactive",
    estimated_minutes: 15,
    skills_covered: ["addition", "counting"],
    hints: [
      { order: 2, text: "Try using blocks" },
      { order: 1, text: "Start with the display" },
    ],
  };

  const baseSubject = {
    display_name: "Math",
    slug: "math",
    color: "#3B82F6",
  };

  it("builds context with all fields populated", () => {
    const result = buildVoiceLessonContext(
      baseLessonData,
      baseSubject,
      null,
      true,
    );

    expect(result.lessonId).toBe("lesson-001");
    expect(result.title).toBe("Adding Numbers");
    expect(result.subjectName).toBe("Math");
    expect(result.subjectSlug).toBe("math");
    expect(result.subjectColor).toBe("#3B82F6");
    expect(result.isInteractive).toBe(true);
    expect(result.skillsCovered).toEqual(["addition", "counting"]);
    expect(result.storyText).toBe("Once upon a time...");
  });

  it("defaults subject fields when subject is null", () => {
    const result = buildVoiceLessonContext(
      baseLessonData,
      null,
      null,
      true,
    );

    expect(result.subjectName).toBe("General");
    expect(result.subjectSlug).toBe("general");
    expect(result.subjectColor).toBe("#F97316");
  });

  it("includes sorted coding hints for non-interactive lessons", () => {
    const result = buildVoiceLessonContext(
      baseLessonData,
      baseSubject,
      null,
      false, // not interactive
    );

    expect(result.codingHints).toEqual([
      "Start with the display",
      "Try using blocks",
    ]);
  });

  it("excludes coding hints for interactive lessons", () => {
    const result = buildVoiceLessonContext(
      baseLessonData,
      baseSubject,
      null,
      true,
    );

    expect(result.codingHints).toEqual([]);
  });

  it("includes activity summaries from config", () => {
    const activityConfig: LessonActivityConfig = {
      activities: [
        {
          type: "counting",
          questions: [
            {
              id: "q1",
              prompt: "How many?",
              hint: "Count",
              correctCount: 3,
              items: [],
            },
          ],
        },
      ],
    };

    const result = buildVoiceLessonContext(
      baseLessonData,
      baseSubject,
      activityConfig,
      true,
    );

    expect(result.activities).toHaveLength(1);
    expect(result.activities[0].widgetType).toBe("counting");
  });

  it("returns empty activities when config is null", () => {
    const result = buildVoiceLessonContext(
      baseLessonData,
      baseSubject,
      null,
      true,
    );

    expect(result.activities).toEqual([]);
  });
});
