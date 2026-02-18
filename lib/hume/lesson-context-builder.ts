/**
 * Builds structured lesson context for Chip's voice sessions.
 *
 * Summarizes lesson data (activities, questions, answers, hints) into a
 * compact format that can be injected into the voice prompt so Chip acts
 * as a real teacher who knows the lesson content.
 */

import type {
  LessonActivityConfig,
  MultipleChoiceContent,
  CountingContent,
  MatchingPairsContent,
  SequenceOrderContent,
  FlashCardContent,
  FillInBlankContent,
  NumberBondContent,
  TenFrameContent,
  NumberLineContent,
  RekenrekContent,
  ActivityContent,
} from "@/lib/activities/types";
import type {
  VoiceActivitySummary,
  VoiceQuestionSummary,
  VoiceLessonContext,
} from "./types";

/** Max total questions across all activities to keep the prompt compact. */
const MAX_QUESTIONS = 15;

// ---------------------------------------------------------------------------
// Per-widget question extraction
// ---------------------------------------------------------------------------

function extractMultipleChoice(
  activity: MultipleChoiceContent,
): VoiceQuestionSummary[] {
  return activity.questions.map((q) => {
    const correctOption = q.options.find((o) => o.id === q.correctOptionId);
    return {
      prompt: q.prompt,
      correctAnswer: correctOption?.text ?? q.correctOptionId,
      hint: q.hint,
      options: q.options.map((o) => o.text),
    };
  });
}

function extractCounting(
  activity: CountingContent,
): VoiceQuestionSummary[] {
  return activity.questions.map((q) => ({
    prompt: q.prompt,
    correctAnswer: String(q.correctCount),
    hint: q.hint,
  }));
}

function extractMatchingPairs(
  activity: MatchingPairsContent,
): VoiceQuestionSummary[] {
  const pairsText = activity.pairs
    .map((p) => `${p.left.text} → ${p.right.text}`)
    .join(", ");
  return [
    {
      prompt: activity.prompt,
      correctAnswer: pairsText,
      hint: activity.hint,
    },
  ];
}

function extractSequenceOrder(
  activity: SequenceOrderContent,
): VoiceQuestionSummary[] {
  return activity.questions.map((q) => {
    const sorted = [...q.items].sort(
      (a, b) => a.correctPosition - b.correctPosition,
    );
    return {
      prompt: q.prompt,
      correctAnswer: sorted.map((item) => item.text).join(", "),
      hint: q.hint,
    };
  });
}

function extractFlashCards(
  activity: FlashCardContent,
): VoiceQuestionSummary[] {
  return activity.cards.map((card) => ({
    prompt: typeof card.front === "string" ? card.front : card.front.text,
    correctAnswer: typeof card.back === "string" ? card.back : card.back.text,
  }));
}

function extractFillInBlank(
  activity: FillInBlankContent,
): VoiceQuestionSummary[] {
  return activity.questions.map((q) => ({
    prompt: q.template,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
  }));
}

function extractNumberBond(
  activity: NumberBondContent,
): VoiceQuestionSummary[] {
  return activity.questions.map((q) => {
    let answer: string;
    if (q.whole === null && q.part1 !== null && q.part2 !== null) {
      answer = String(q.part1 + q.part2);
    } else if (q.part1 === null && q.whole !== null && q.part2 !== null) {
      answer = String(q.whole - q.part2);
    } else if (q.part2 === null && q.whole !== null && q.part1 !== null) {
      answer = String(q.whole - q.part1);
    } else {
      answer = "unknown";
    }
    return {
      prompt: q.prompt,
      correctAnswer: answer,
      hint: q.hint,
    };
  });
}

function extractTenFrame(
  activity: TenFrameContent,
): VoiceQuestionSummary[] {
  return activity.questions.map((q) => {
    let answer: string;
    if (q.targetNumber !== undefined) {
      answer = String(q.targetNumber);
    } else if (q.operation) {
      const result =
        q.operation.type === "add"
          ? q.operation.a + q.operation.b
          : q.operation.a - q.operation.b;
      answer = String(result);
    } else {
      answer = "unknown";
    }
    return {
      prompt: q.prompt,
      correctAnswer: answer,
      hint: q.hint,
    };
  });
}

function extractNumberLine(
  activity: NumberLineContent,
): VoiceQuestionSummary[] {
  return activity.questions.map((q) => ({
    prompt: q.prompt,
    correctAnswer: String(q.correctEndPosition),
    hint: q.hint,
  }));
}

function extractRekenrek(
  activity: RekenrekContent,
): VoiceQuestionSummary[] {
  return activity.questions.map((q) => ({
    prompt: q.prompt,
    correctAnswer: String(q.targetNumber),
    hint: q.hint,
  }));
}

// ---------------------------------------------------------------------------
// Activity summarizer
// ---------------------------------------------------------------------------

function extractQuestions(
  activity: ActivityContent,
): VoiceQuestionSummary[] {
  switch (activity.type) {
    case "multiple_choice":
      return extractMultipleChoice(activity);
    case "counting":
      return extractCounting(activity);
    case "matching_pairs":
      return extractMatchingPairs(activity);
    case "sequence_order":
      return extractSequenceOrder(activity);
    case "flash_card":
      return extractFlashCards(activity);
    case "fill_in_blank":
      return extractFillInBlank(activity);
    case "number_bond":
      return extractNumberBond(activity);
    case "ten_frame":
      return extractTenFrame(activity);
    case "number_line":
      return extractNumberLine(activity);
    case "rekenrek":
      return extractRekenrek(activity);
  }
}

/**
 * Summarize all activities in a lesson config into a compact format
 * suitable for the voice prompt. Caps total questions at MAX_QUESTIONS.
 */
export function summarizeActivities(
  config: LessonActivityConfig,
): VoiceActivitySummary[] {
  const summaries: VoiceActivitySummary[] = [];
  let totalQuestions = 0;

  for (const activity of config.activities) {
    const allQuestions = extractQuestions(activity);
    const remaining = MAX_QUESTIONS - totalQuestions;
    if (remaining <= 0) break;

    const capped = allQuestions.slice(0, remaining);
    totalQuestions += capped.length;

    summaries.push({
      widgetType: activity.type,
      questionCount: allQuestions.length,
      questions: capped,
    });
  }

  return summaries;
}

// ---------------------------------------------------------------------------
// Full context builder
// ---------------------------------------------------------------------------

interface LessonData {
  id: string;
  title: string;
  description: string;
  story_text: string | null;
  lesson_type: string;
  estimated_minutes: number;
  skills_covered: string[];
  hints: Array<{ order: number; text: string }>;
}

interface SubjectData {
  display_name: string;
  slug: string;
  color: string;
}

/**
 * Assembles the full VoiceLessonContext from existing server-side data.
 * No new DB queries needed — all inputs come from the lesson page's
 * existing data fetching.
 */
export function buildVoiceLessonContext(
  lesson: LessonData,
  subject: SubjectData | null,
  activityConfig: LessonActivityConfig | null,
  isInteractive: boolean,
): VoiceLessonContext {
  const activities = activityConfig
    ? summarizeActivities(activityConfig)
    : [];

  const codingHints = (!isInteractive && lesson.hints.length > 0)
    ? [...lesson.hints]
        .sort((a, b) => a.order - b.order)
        .map((h) => h.text)
    : [];

  return {
    lessonId: lesson.id,
    title: lesson.title,
    description: lesson.description,
    storyText: lesson.story_text,
    subjectName: subject?.display_name ?? "General",
    subjectSlug: subject?.slug ?? "general",
    subjectColor: subject?.color ?? "#F97316",
    lessonType: lesson.lesson_type,
    estimatedMinutes: lesson.estimated_minutes,
    skillsCovered: lesson.skills_covered,
    activities,
    codingHints,
    isInteractive,
  };
}
