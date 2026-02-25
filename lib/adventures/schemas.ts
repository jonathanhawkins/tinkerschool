/**
 * Zod Schemas for Activity Widgets
 *
 * Mirrors the 10 widget types defined in `lib/activities/types.ts` as Zod
 * schemas for use with AI SDK's `generateObject()`. The schemas guarantee
 * that AI-generated lesson content is valid `LessonActivityConfig` JSON.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

const activityOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  emoji: z.string().optional(),
  imageUrl: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Per-widget content schemas
// ---------------------------------------------------------------------------

const multipleChoiceQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  promptEmoji: z.string().optional(),
  options: z.array(activityOptionSchema).min(2),
  correctOptionId: z.string(),
  hint: z.string().optional(),
});

const multipleChoiceContentSchema = z.object({
  type: z.literal("multiple_choice"),
  questions: z.array(multipleChoiceQuestionSchema).min(1),
  shuffleQuestions: z.boolean().optional(),
  shuffleOptions: z.boolean().optional(),
});

const countingQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  emoji: z.string(),
  correctCount: z.number().int().min(0),
  displayCount: z.number().int().min(0),
  hint: z.string().optional(),
});

const countingContentSchema = z.object({
  type: z.literal("counting"),
  questions: z.array(countingQuestionSchema).min(1),
});

const matchingPairSchema = z.object({
  id: z.string(),
  left: activityOptionSchema,
  right: activityOptionSchema,
});

const matchingPairsContentSchema = z.object({
  type: z.literal("matching_pairs"),
  prompt: z.string(),
  pairs: z.array(matchingPairSchema).min(2),
  hint: z.string().optional(),
});

const sequenceItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  emoji: z.string().optional(),
  correctPosition: z.number().int().min(1),
});

const sequenceOrderQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  items: z.array(sequenceItemSchema).min(2),
  hint: z.string().optional(),
});

const sequenceOrderContentSchema = z.object({
  type: z.literal("sequence_order"),
  questions: z.array(sequenceOrderQuestionSchema).min(1),
});

const flashCardFrontBackSchema = z.union([
  z.string(),
  z.object({
    text: z.string(),
    emoji: z.string().optional(),
  }),
]);

const flashCardItemSchema = z.object({
  id: z.string(),
  front: flashCardFrontBackSchema,
  back: flashCardFrontBackSchema,
  color: z.string().optional(),
});

const flashCardContentSchema = z.object({
  type: z.literal("flash_card"),
  prompt: z.string(),
  cards: z.array(flashCardItemSchema).min(1),
  shuffleCards: z.boolean().optional(),
});

const fillInBlankQuestionSchema = z.object({
  id: z.string(),
  template: z.string(),
  correctAnswer: z.string(),
  acceptableAnswers: z.array(z.string()).optional(),
  hint: z.string().optional(),
  wordBank: z.array(z.string()).optional(),
});

const fillInBlankContentSchema = z.object({
  type: z.literal("fill_in_blank"),
  questions: z.array(fillInBlankQuestionSchema).min(1),
});

// ---------------------------------------------------------------------------
// Math-focused widgets
// ---------------------------------------------------------------------------

const numberBondQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  whole: z.number().nullable(),
  part1: z.number().nullable(),
  part2: z.number().nullable(),
  hint: z.string().optional(),
});

const numberBondContentSchema = z.object({
  type: z.literal("number_bond"),
  questions: z.array(numberBondQuestionSchema).min(1),
});

const tenFrameQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  targetNumber: z.number().int().min(0).max(20).optional(),
  operation: z
    .object({
      a: z.number().int().min(0),
      b: z.number().int().min(0),
      type: z.enum(["add", "subtract"]),
    })
    .optional(),
  showMakingTen: z.boolean().optional(),
  frameCount: z.union([z.literal(1), z.literal(2)]),
  hint: z.string().optional(),
});

const tenFrameContentSchema = z.object({
  type: z.literal("ten_frame"),
  questions: z.array(tenFrameQuestionSchema).min(1),
});

const numberLineQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  min: z.number().int(),
  max: z.number().int(),
  startPosition: z.number().int(),
  correctEndPosition: z.number().int(),
  jumpSize: z.number().int().optional(),
  showJumpArcs: z.boolean().optional(),
  operation: z.enum(["add", "subtract"]),
  hint: z.string().optional(),
});

const numberLineContentSchema = z.object({
  type: z.literal("number_line"),
  questions: z.array(numberLineQuestionSchema).min(1),
});

const rekenrekQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  targetNumber: z.number().int().min(0).max(20),
  mode: z.enum(["show", "add", "subtract"]),
  operands: z
    .object({
      a: z.number().int().min(0),
      b: z.number().int().min(0),
    })
    .optional(),
  hint: z.string().optional(),
});

const rekenrekContentSchema = z.object({
  type: z.literal("rekenrek"),
  questions: z.array(rekenrekQuestionSchema).min(1),
});

// ---------------------------------------------------------------------------
// Discriminated union of all activity content types
// ---------------------------------------------------------------------------

export const activityContentSchema = z.discriminatedUnion("type", [
  multipleChoiceContentSchema,
  countingContentSchema,
  matchingPairsContentSchema,
  sequenceOrderContentSchema,
  flashCardContentSchema,
  fillInBlankContentSchema,
  numberBondContentSchema,
  tenFrameContentSchema,
  numberLineContentSchema,
  rekenrekContentSchema,
]);

// ---------------------------------------------------------------------------
// Top-level LessonActivityConfig schema
// ---------------------------------------------------------------------------

export const lessonActivityConfigSchema = z.object({
  activities: z.array(activityContentSchema).min(1),
  subjectColor: z.string().optional(),
  estimatedMinutes: z.number().optional(),
  passingScore: z.number().min(0).max(100).optional(),
});

// Re-export inferred types for convenience
export type ActivityContentSchema = z.infer<typeof activityContentSchema>;
export type LessonActivityConfigSchema = z.infer<typeof lessonActivityConfigSchema>;
