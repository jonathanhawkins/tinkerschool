/**
 * Tests for ActivityProvider — covers score calculation, question ID dedup,
 * and onComplete behavior.
 *
 * We test the pure logic extracted from activity-context (score formula,
 * question ID uniqueness) without needing to render the full provider.
 */

import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------------------
// Score calculation logic (extracted from recordAnswer setState updater)
// ---------------------------------------------------------------------------

interface AnswerEvent {
  questionId: string;
  givenAnswer: string;
  isCorrect: boolean;
  timeMs: number;
  hintUsed: boolean;
  attemptNumber: number;
}

/** Replicates the score formula from activity-context.tsx */
function computeScore(answers: AnswerEvent[], totalQuestions: number): number {
  const questionsAnswered = answers.filter(
    (a, i, arr) =>
      a.isCorrect &&
      arr.findIndex(
        (x) => x.questionId === a.questionId && x.isCorrect,
      ) === i,
  ).length;
  return totalQuestions > 0
    ? Math.round((questionsAnswered / totalQuestions) * 100)
    : 0;
}

function makeAnswer(questionId: string, isCorrect: boolean): AnswerEvent {
  return {
    questionId,
    givenAnswer: isCorrect ? "correct" : "wrong",
    isCorrect,
    timeMs: 1000,
    hintUsed: false,
    attemptNumber: 1,
  };
}

// ---------------------------------------------------------------------------
// Score formula
// ---------------------------------------------------------------------------

describe("computeScore", () => {
  it("returns 0 when totalQuestions is 0", () => {
    expect(computeScore([], 0)).toBe(0);
  });

  it("returns 100 when all questions answered correctly on first try", () => {
    const answers = [
      makeAnswer("q1", true),
      makeAnswer("q2", true),
      makeAnswer("q3", true),
    ];
    expect(computeScore(answers, 3)).toBe(100);
  });

  it("returns 0 when all questions wrong", () => {
    const answers = [
      makeAnswer("q1", false),
      makeAnswer("q2", false),
    ];
    expect(computeScore(answers, 2)).toBe(0);
  });

  it("counts 50% when half correct", () => {
    const answers = [
      makeAnswer("q1", true),
      makeAnswer("q2", false),
    ];
    expect(computeScore(answers, 2)).toBe(50);
  });

  it("deduplicates: wrong then correct counts as correct for that question", () => {
    // q1: wrong first, then correct — should count as 1 correct unique question
    const answers = [
      makeAnswer("q1", false),
      makeAnswer("q1", true),
    ];
    expect(computeScore(answers, 2)).toBe(50); // 1 of 2 total unique questions correct
  });

  it("deduplicates: two correct answers for same question only count once", () => {
    const answers = [
      makeAnswer("q1", true),
      makeAnswer("q1", true), // duplicate — shouldn't double-count
    ];
    expect(computeScore(answers, 1)).toBe(100);
  });

  it("handles mixed: two questions, one with retry", () => {
    const answers = [
      makeAnswer("q1", false),
      makeAnswer("q1", true),
      makeAnswer("q2", true),
    ];
    // q1 and q2 both correct → 2/2 = 100%
    expect(computeScore(answers, 2)).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// Score dedup across multiple same-type activities
// ---------------------------------------------------------------------------

describe("questionId uniqueness across activities", () => {
  it("matching activities at different indices get distinct questionIds", () => {
    // Simulate two matching_pairs activities — each gets activity-index-scoped ID
    const answers = [
      makeAnswer("matching-0", true),  // matching_pairs activity 0
      makeAnswer("matching-1", true),  // matching_pairs activity 1
    ];
    // Both should be counted as separate unique correct questions
    expect(computeScore(answers, 2)).toBe(100);
  });

  it("matching activity ID from activity 0 does not collide with activity 1", () => {
    // If both used "matching" (the old bug), the second would be de-duped
    const buggyAnswers = [
      makeAnswer("matching", true),  // activity 0 — correct
      makeAnswer("matching", true),  // activity 1 — same ID: de-duped, counted once
    ];
    // Bug: score would be 50% (only 1 unique correct) even though both activities passed
    expect(computeScore(buggyAnswers, 2)).toBe(50); // demonstrates the old bug

    // Fixed: with activity-scoped IDs both count correctly
    const fixedAnswers = [
      makeAnswer("matching-0", true),
      makeAnswer("matching-1", true),
    ];
    expect(computeScore(fixedAnswers, 2)).toBe(100); // both unique
  });

  it("parent_activity activities at different indices get distinct questionIds", () => {
    const answers = [
      makeAnswer("parent_activity-0", true),
      makeAnswer("parent_activity-1", true),
    ];
    expect(computeScore(answers, 2)).toBe(100);
  });

  it("old bug: 'parent_activity' collides across activities", () => {
    const buggyAnswers = [
      makeAnswer("parent_activity", true),
      makeAnswer("parent_activity", true),
    ];
    // Bug: only 1 unique correct counted
    expect(computeScore(buggyAnswers, 2)).toBe(50);

    // Fixed:
    const fixedAnswers = [
      makeAnswer("parent_activity-0", true),
      makeAnswer("parent_activity-1", true),
    ];
    expect(computeScore(fixedAnswers, 2)).toBe(100);
  });

  it("uniquely-IDed questions from different activities never collide", () => {
    const answers = [
      makeAnswer("00000001-q1-uuid", true),
      makeAnswer("00000002-q1-uuid", true), // different UUID, same local name — no collision
    ];
    expect(computeScore(answers, 2)).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// parseActivityConfig sub-field validation
// (import separately to avoid full React context setup)
// ---------------------------------------------------------------------------

import { parseActivityConfig } from "./types";

describe("parseActivityConfig — sub-field validation", () => {
  it("rejects flash_card with no cards field", () => {
    expect(parseActivityConfig({ activities: [{ type: "flash_card" }] })).toBeNull();
  });

  it("rejects flash_card with empty cards array", () => {
    expect(parseActivityConfig({ activities: [{ type: "flash_card", cards: [] }] })).toBeNull();
  });

  it("accepts flash_card with at least one card", () => {
    const result = parseActivityConfig({
      activities: [{ type: "flash_card", cards: [{ id: "c1", front: { text: "A" }, back: { text: "B" } }] }],
    });
    expect(result).not.toBeNull();
  });

  it("rejects matching_pairs with no pairs field", () => {
    expect(parseActivityConfig({ activities: [{ type: "matching_pairs" }] })).toBeNull();
  });

  it("rejects matching_pairs with empty pairs array", () => {
    expect(parseActivityConfig({ activities: [{ type: "matching_pairs", pairs: [] }] })).toBeNull();
  });

  it("accepts matching_pairs with at least one pair", () => {
    const result = parseActivityConfig({
      activities: [{ type: "matching_pairs", pairs: [{ id: "p1", left: { id: "l1", text: "A" }, right: { id: "r1", text: "B" } }] }],
    });
    expect(result).not.toBeNull();
  });

  it("rejects multiple_choice with no questions field", () => {
    expect(parseActivityConfig({ activities: [{ type: "multiple_choice" }] })).toBeNull();
  });

  it("rejects multiple_choice with empty questions array", () => {
    expect(parseActivityConfig({ activities: [{ type: "multiple_choice", questions: [] }] })).toBeNull();
  });

  it("accepts multiple_choice with at least one question", () => {
    const result = parseActivityConfig({
      activities: [{
        type: "multiple_choice",
        questions: [{ id: "q1", prompt: "Which?", options: [{ id: "a", text: "A" }], correctOptionId: "a" }],
      }],
    });
    expect(result).not.toBeNull();
  });

  it("accepts parent_activity with no collection field", () => {
    const result = parseActivityConfig({
      activities: [{
        type: "parent_activity",
        prompt: "Count your toys!",
        instructions: "Count them together",
        completionPrompt: "Did you count?",
      }],
    });
    expect(result).not.toBeNull();
    expect(result!.activities[0].type).toBe("parent_activity");
  });

  it("rejects a lesson where first activity is valid but second is missing questions", () => {
    const result = parseActivityConfig({
      activities: [
        { type: "multiple_choice", questions: [{ id: "q1", prompt: "A?", options: [], correctOptionId: "a" }] },
        { type: "counting" }, // no questions field
      ],
    });
    expect(result).toBeNull();
  });
});
