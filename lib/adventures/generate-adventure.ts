/**
 * AI Adventure Generator
 *
 * Uses Claude via AI SDK's `generateObject()` to create personalized daily
 * lessons using the existing activity widget system. The output is a valid
 * `LessonActivityConfig` JSON that can be rendered directly by `ActivityRouter`.
 */

import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

import { lessonActivityConfigSchema } from "./schemas";
import type { ChildContext } from "./gather-child-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GeneratedAdventure {
  title: string;
  description: string;
  storyText: string;
  subjectId: string;
  skillIds: string[];
  config: Record<string, unknown>;
  subjectColor: string;
}

// ---------------------------------------------------------------------------
// Subject selection logic
// ---------------------------------------------------------------------------

/**
 * Pick the best subject for today's adventure, favoring:
 * 1. Subjects with weak/stale skills
 * 2. Subjects not covered in recent adventures (rotation)
 * 3. Subjects aligned with the child's interests
 */
function selectSubject(context: ChildContext): {
  subjectId: string;
  subjectSlug: string;
  subjectName: string;
  subjectColor: string;
} {
  const { subjects, weakSkills, staleSkills, recentAdventureSubjectIds } =
    context;

  if (subjects.length === 0) {
    throw new Error("No subjects available for adventure generation");
  }

  // Score each subject
  const scores = new Map<string, number>();
  for (const subject of subjects) {
    let score = 0;

    // Weak skills in this subject
    const weakCount = weakSkills.filter(
      (s) => s.subjectId === subject.id,
    ).length;
    score += weakCount * 3;

    // Stale skills in this subject
    const staleCount = staleSkills.filter(
      (s) => s.subjectId === subject.id,
    ).length;
    score += staleCount * 2;

    // Not recently covered (rotation bonus)
    if (!recentAdventureSubjectIds.includes(subject.id)) {
      score += 5;
    }

    // Interest alignment
    const interestMatch = context.interests.some(
      (interest) =>
        subject.displayName.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(subject.slug),
    );
    if (interestMatch) {
      score += 2;
    }

    scores.set(subject.id, score);
  }

  // Pick highest-scoring subject
  let bestSubject = subjects[0];
  let bestScore = scores.get(subjects[0].id) ?? 0;

  for (const subject of subjects) {
    const s = scores.get(subject.id) ?? 0;
    if (s > bestScore) {
      bestScore = s;
      bestSubject = subject;
    }
  }

  return {
    subjectId: bestSubject.id,
    subjectSlug: bestSubject.slug,
    subjectName: bestSubject.displayName,
    subjectColor: bestSubject.color,
  };
}

// ---------------------------------------------------------------------------
// Skill selection
// ---------------------------------------------------------------------------

/**
 * Pick 1-3 skills to focus on within the selected subject.
 */
function selectSkills(
  context: ChildContext,
  subjectId: string,
): string[] {
  const subjectSkills = context.skills.filter(
    (s) => s.subjectId === subjectId,
  );

  // Prioritize weak then stale skills
  const weak = subjectSkills.filter(
    (s) => s.level === "beginning" || s.level === "not_started",
  );
  const stale = subjectSkills.filter(
    (s) =>
      s.level !== "beginning" &&
      s.level !== "not_started" &&
      s.lastPracticed &&
      s.lastPracticed <
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  );
  const other = subjectSkills.filter(
    (s) => !weak.includes(s) && !stale.includes(s),
  );

  const ordered = [...weak, ...stale, ...other];
  return ordered.slice(0, 3).map((s) => s.skillId);
}

// ---------------------------------------------------------------------------
// Prompt building
// ---------------------------------------------------------------------------

function buildPrompt(
  context: ChildContext,
  subject: { subjectSlug: string; subjectName: string },
  targetSkillIds: string[],
): string {
  const gradeText = context.gradeLevel
    ? `grade ${context.gradeLevel}`
    : `band ${context.currentBand}`;

  const targetSkills = context.skills
    .filter((s) => targetSkillIds.includes(s.skillId))
    .map((s) => `${s.skillName} (${s.level})`)
    .join(", ");

  const interestsText =
    context.interests.length > 0
      ? context.interests.join(", ")
      : "general curiosity";

  const recentScores = context.recentSessions
    .slice(0, 5)
    .map((s) => `${s.score}%`)
    .join(", ");

  const chipContext = context.chipNotes
    ? `\nChip's notes about this child: ${context.chipNotes}`
    : "";

  return `You are creating a fun, personalized daily learning adventure for a ${gradeText} student named ${context.displayName}.

## Subject: ${subject.subjectName}
## Target Skills: ${targetSkills || "general " + subject.subjectSlug + " skills"}
## Child's Interests: ${interestsText}
## Recent Scores: ${recentScores || "no recent data"}${chipContext}

## Instructions
Create an engaging mini-lesson with 3-4 interactive activities. The lesson should:
1. Tell a short story that connects the activities (2-3 sentences, themed around the child's interests if possible)
2. Mix different widget types for variety (don't repeat the same widget type)
3. Be age-appropriate for ${gradeText}
4. Include helpful hints for harder questions
5. Use emojis to make it fun and visual

## Activity Widget Types Available
- multiple_choice: Pick the right answer from 2-4 options
- counting: Tap objects to count them (math only, ages 5-7)
- matching_pairs: Connect items that go together
- sequence_order: Put items in the correct order
- flash_card: Flip cards to learn (front/back, no scoring)
- fill_in_blank: Complete a sentence or equation with a word bank
- number_bond: Part-part-whole diagram (math only)
- ten_frame: 2x5 grid for visualizing numbers (math only, numbers 0-20)
- number_line: Hop along a number line (math only)
- rekenrek: Virtual counting rack (math only, numbers 0-20)

## Rules
- Use 3-4 activities total
- Each activity should have 2-4 questions (not too long)
- For multiple_choice: exactly 2-4 options per question, one correctOptionId must match an option's id
- For counting: displayCount should equal the number of items shown, correctCount is the answer
- For matching_pairs: 3-5 pairs is ideal
- For sequence_order: correctPosition must be 1-indexed and sequential
- For fill_in_blank: always include a wordBank for young learners
- For number_bond: exactly one of whole, part1, or part2 should be null (the student fills it in)
- For ten_frame: frameCount=1 for numbers 0-10, frameCount=2 for numbers 11-20
- For number_line: min usually 0, max usually 20 for this age
- For rekenrek: targetNumber must be 0-20
- Math widgets (number_bond, ten_frame, number_line, rekenrek, counting) should only be used for Math subject
- Every question needs a unique id (use q1, q2, q3... pattern)
- Flash cards don't count toward scoring, so place them first as a warm-up if used

## Required Field Schemas

### number_line (ALL fields required):
{ "id": string, "prompt": string, "min": number, "max": number, "startPosition": number, "correctEndPosition": number, "operation": "add" | "subtract", "hint"?: string }

### ten_frame (ALL fields required):
{ "id": string, "prompt": string, "targetNumber": number (0-20), "frameCount": 1 | 2, "hint"?: string }

### rekenrek (ALL fields required):
{ "id": string, "prompt": string, "targetNumber": number (0-20), "mode": "show" | "add" | "subtract", "hint"?: string }

### counting (ALL fields required):
{ "id": string, "prompt": string, "emoji": string, "correctCount": number, "displayCount": number, "hint"?: string }

### number_bond (ALL fields required):
{ "id": string, "prompt": string, "whole": number|null, "part1": number|null, "part2": number|null, "hint"?: string }
(exactly one of whole/part1/part2 must be null)

### multiple_choice:
{ "id": string, "prompt": string, "options": [{"id": string, "text": string}], "correctOptionId": string, "hint"?: string }

### matching_pairs:
{ "id": string, "left": {"id": string, "text": string}, "right": {"id": string, "text": string} }

### sequence_order:
{ "id": string, "prompt": string, "items": [{"id": string, "text": string, "correctPosition": number}] }

### fill_in_blank:
{ "id": string, "template": string (use ___ for blank), "correctAnswer": string, "wordBank": [string], "hint"?: string }

### flash_card:
{ "id": string, "front": string | {"text": string, "emoji"?: string}, "back": string | {"text": string, "emoji"?: string} }

## Example: Math Adventure (grade 1)
{
  "activities": [
    {
      "type": "flash_card",
      "prompt": "Let's warm up! Flip each card to see the answer.",
      "cards": [
        { "id": "fc1", "front": { "text": "5 + 3", "emoji": "🤔" }, "back": { "text": "8", "emoji": "⭐" } },
        { "id": "fc2", "front": { "text": "2 + 6", "emoji": "🤔" }, "back": { "text": "8", "emoji": "⭐" } }
      ]
    },
    {
      "type": "number_bond",
      "questions": [
        { "id": "q1", "prompt": "What number goes with 3 to make 8?", "whole": 8, "part1": 3, "part2": null, "hint": "Count up from 3 to 8" }
      ]
    },
    {
      "type": "multiple_choice",
      "questions": [
        { "id": "q2", "prompt": "A cat has 4 legs. How many legs do 2 cats have?", "promptEmoji": "🐱", "options": [{"id": "a", "text": "6"}, {"id": "b", "text": "8", "emoji": "✅"}, {"id": "c", "text": "10"}], "correctOptionId": "b", "hint": "Try counting: 4 + 4" }
      ],
      "shuffleOptions": true
    }
  ],
  "estimatedMinutes": 5,
  "passingScore": 60
}

Generate the activities JSON now. Return ONLY the activities config object.`;
}

// ---------------------------------------------------------------------------
// Post-processing: backfill missing IDs
// ---------------------------------------------------------------------------

let idCounter = 0;
function nextId(prefix: string): string {
  return `${prefix}_${++idCounter}`;
}

/**
 * Walk the raw parsed JSON and fix common AI generation issues:
 * - Add missing `id` fields
 * - Coerce string numbers to actual numbers
 * - Fill in required defaults
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function backfillIds(config: any): void {
  idCounter = 0;
  if (!config?.activities) return;

  for (const activity of config.activities) {
    switch (activity.type) {
      case "multiple_choice":
      case "counting":
      case "sequence_order":
      case "fill_in_blank":
      case "number_bond":
      case "ten_frame":
      case "number_line":
      case "rekenrek":
        if (Array.isArray(activity.questions)) {
          for (const q of activity.questions) {
            if (!q.id) q.id = nextId("q");

            // Multiple choice options
            if (Array.isArray(q.options)) {
              for (const opt of q.options) {
                if (!opt.id) opt.id = nextId("opt");
              }
              if (q.correctOptionId && !q.options.find((o: { id: string }) => o.id === q.correctOptionId)) {
                const idx = parseInt(q.correctOptionId, 10);
                if (!isNaN(idx) && q.options[idx]) {
                  q.correctOptionId = q.options[idx].id;
                }
              }
            }

            // Sequence items
            if (Array.isArray(q.items)) {
              for (const item of q.items) {
                if (!item.id) item.id = nextId("item");
                if (typeof item.correctPosition === "string") {
                  item.correctPosition = parseInt(item.correctPosition, 10);
                }
              }
            }

            // Number line defaults
            if (activity.type === "number_line") {
              if (q.min == null) q.min = 0;
              if (q.max == null) q.max = 20;
              if (q.startPosition == null) q.startPosition = q.min ?? 0;
              if (q.correctEndPosition == null) q.correctEndPosition = q.startPosition;
              if (!q.operation) q.operation = "add";
              // Coerce string numbers
              for (const key of ["min", "max", "startPosition", "correctEndPosition"] as const) {
                if (typeof q[key] === "string") q[key] = parseInt(q[key], 10);
              }
            }

            // Ten frame defaults
            if (activity.type === "ten_frame") {
              if (q.frameCount == null) {
                q.frameCount = (q.targetNumber ?? 0) > 10 ? 2 : 1;
              }
              if (typeof q.targetNumber === "string") q.targetNumber = parseInt(q.targetNumber, 10);
            }

            // Rekenrek defaults
            if (activity.type === "rekenrek") {
              if (!q.mode) q.mode = "show";
              if (typeof q.targetNumber === "string") q.targetNumber = parseInt(q.targetNumber, 10);
            }

            // Counting defaults
            if (activity.type === "counting") {
              if (typeof q.correctCount === "string") q.correctCount = parseInt(q.correctCount, 10);
              if (typeof q.displayCount === "string") q.displayCount = parseInt(q.displayCount, 10);
              if (q.displayCount == null) q.displayCount = q.correctCount;
            }
          }
        }
        break;

      case "matching_pairs":
        if (Array.isArray(activity.pairs)) {
          for (const pair of activity.pairs) {
            if (!pair.id) pair.id = nextId("pair");
            if (pair.left && !pair.left.id) pair.left.id = nextId("l");
            if (pair.right && !pair.right.id) pair.right.id = nextId("r");
          }
        }
        break;

      case "flash_card":
        if (Array.isArray(activity.cards)) {
          for (const card of activity.cards) {
            if (!card.id) card.id = nextId("fc");
          }
        }
        break;
    }
  }
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

const MAX_RETRIES = 2;

export async function generateAdventure(
  context: ChildContext,
): Promise<GeneratedAdventure> {
  const subject = selectSubject(context);
  const skillIds = selectSkills(context, subject.subjectId);

  const prompt = buildPrompt(context, subject, skillIds);

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { text } = await generateText({
        model: anthropic("claude-sonnet-4-5-20250929"),
        prompt: prompt + "\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown, no code fences, no comments (// or /* */), no explanation — just the raw JSON object.",
        maxOutputTokens: 4000,
      });

      // Extract JSON from the response — find the outermost { ... }
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        throw new Error("No valid JSON object found in response");
      }
      // Strip JS-style line comments (model sometimes adds // comments)
      const jsonStr = text
        .slice(firstBrace, lastBrace + 1)
        .replace(/\/\/[^\n]*/g, "");
      const raw = JSON.parse(jsonStr);

      // Backfill missing `id` fields — the model sometimes omits them
      backfillIds(raw);

      // Validate against our strict Zod schema (supports discriminated unions)
      const validated = lessonActivityConfigSchema.parse(raw);

      // Generate a title and story text
      const titleAndStory = generateTitleAndStory(
        context,
        subject.subjectName,
      );

      return {
        title: titleAndStory.title,
        description: titleAndStory.description,
        storyText: titleAndStory.storyText,
        subjectId: subject.subjectId,
        skillIds,
        config: validated as unknown as Record<string, unknown>,
        subjectColor: subject.subjectColor,
      };
    } catch (err) {
      lastError = err;
      console.error(
        `[generate-adventure] Attempt ${attempt + 1} failed:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  throw new Error(
    `Failed to generate adventure after ${MAX_RETRIES + 1} attempts: ${
      lastError instanceof Error ? lastError.message : "Unknown error"
    }`,
  );
}

// ---------------------------------------------------------------------------
// Title and story generation (deterministic, no AI needed)
// ---------------------------------------------------------------------------

const ADVENTURE_THEMES = [
  { prefix: "Treasure Hunt", emoji: "🗺️" },
  { prefix: "Space Mission", emoji: "🚀" },
  { prefix: "Jungle Safari", emoji: "🌿" },
  { prefix: "Ocean Dive", emoji: "🐠" },
  { prefix: "Castle Quest", emoji: "🏰" },
  { prefix: "Robot Lab", emoji: "🤖" },
  { prefix: "Magic Garden", emoji: "🌸" },
  { prefix: "Dino Discovery", emoji: "🦕" },
];

function generateTitleAndStory(
  context: ChildContext,
  subjectName: string,
): { title: string; description: string; storyText: string } {
  // Pick a theme based on the day (rotates through themes)
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const theme = ADVENTURE_THEMES[dayOfYear % ADVENTURE_THEMES.length];

  const title = `${theme.emoji} ${theme.prefix}: ${subjectName}`;
  const description = `A personalized ${subjectName.toLowerCase()} adventure just for ${context.displayName}!`;
  const storyText = `${theme.emoji} Today's ${theme.prefix.toLowerCase()} takes us on an exciting ${subjectName.toLowerCase()} journey! Chip has prepared some fun challenges just for you, ${context.displayName}. Let's see what you can discover!`;

  return { title, description, storyText };
}
