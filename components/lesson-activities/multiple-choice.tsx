"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { MultipleChoiceContent } from "@/lib/activities/types";
import { ActivityFeedback } from "./activity-feedback";

// ---------------------------------------------------------------------------
// MultipleChoice - Pick the right answer from 2-4 options
// ---------------------------------------------------------------------------

interface MultipleChoiceProps {
  /** Pre-K mode: max 3 options, larger buttons, gentle wrong-answer handling */
  isPreK?: boolean;
}

export function MultipleChoice({ isPreK = false }: MultipleChoiceProps) {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as MultipleChoiceContent;
  const rawQuestion = activity.questions[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preKHighlightCorrect, setPreKHighlightCorrect] = useState(false);

  // Reset selection when question changes
  const questionKey = rawQuestion?.id ?? state.currentQuestionIndex;

  if (!rawQuestion) return null;

  // Pre-K: limit to 3 options max
  const question = isPreK
    ? {
        ...rawQuestion,
        options: rawQuestion.options.slice(0, 3),
      }
    : rawQuestion;

  function handleSelect(optionId: string) {
    // Don't allow selection while showing feedback or if already correct
    if (state.showingFeedback && state.feedbackType === "correct") return;

    // If showing incorrect feedback, dismiss it first
    if (state.showingFeedback && state.feedbackType === "incorrect") {
      // Allow re-selection after wrong answer
    }

    play("tap");
    setSelectedId(optionId);
    const isCorrect = optionId === question.correctOptionId;

    if (isPreK && !isCorrect) {
      // Pre-K: no error state — gently highlight the correct answer
      setPreKHighlightCorrect(true);
      setTimeout(() => {
        setPreKHighlightCorrect(false);
        setSelectedId(null);
      }, 2500);
      return;
    }

    recordAnswer(optionId, isCorrect);
  }

  return (
    <div className="space-y-6" key={questionKey}>
      {/* Question prompt */}
      <div className="space-y-2 text-center">
        {question.promptEmoji && (
          <motion.p
            className="text-5xl"
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            {question.promptEmoji}
          </motion.p>
        )}
        <h3 className="text-lg font-semibold text-foreground">
          {question.prompt}
        </h3>
      </div>

      {/* Pre-K: gentle "try this one" hint */}
      {isPreK && preKHighlightCorrect && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-base font-semibold text-amber-600"
        >
          Hmm, try this one!
        </motion.p>
      )}

      {/* Options grid */}
      <div className={cn(
        "grid gap-3",
        isPreK ? "grid-cols-1" : "sm:grid-cols-2",
      )}>
        {question.options.map((option, i) => {
          const isSelected = selectedId === option.id;
          const isCorrectOption = option.id === question.correctOptionId;
          const showCorrect =
            state.showingFeedback &&
            state.feedbackType === "correct" &&
            isCorrectOption;
          const showWrong =
            !isPreK &&
            state.showingFeedback &&
            state.feedbackType === "incorrect" &&
            isSelected &&
            !isCorrectOption;
          // Pre-K: highlight the correct option when a wrong one is selected
          const preKHint =
            isPreK && preKHighlightCorrect && isCorrectOption;

          return (
            <motion.button
              key={option.id}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 10 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
              onClick={() => handleSelect(option.id)}
              disabled={
                (state.showingFeedback && state.feedbackType === "correct") ||
                preKHighlightCorrect
              }
              className={cn(
                "relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                "hover:shadow-md active:scale-[0.98]",
                isPreK ? "min-h-[64px]" : "min-h-[56px]",
                // Default state
                !isSelected &&
                  !showCorrect &&
                  !preKHint &&
                  "border-border bg-card hover:border-border/80",
                // Selected + correct
                (showCorrect || preKHint) &&
                  "border-emerald-400 bg-emerald-500/10",
                // Selected + wrong (not shown in Pre-K)
                showWrong &&
                  "border-red-300 bg-red-500/10",
                // Selected but no feedback yet
                isSelected &&
                  !state.showingFeedback &&
                  !preKHighlightCorrect &&
                  "border-primary/50 bg-primary/5",
              )}
            >
              {/* Option emoji */}
              {option.emoji && (
                <span className={cn(isPreK ? "text-3xl" : "text-2xl")}>
                  {option.emoji}
                </span>
              )}

              {/* Option text — smaller in Pre-K when emoji is available */}
              <span className={cn(
                "flex-1 font-medium text-foreground",
                isPreK && option.emoji ? "text-sm" : "text-base",
              )}>
                {option.text}
              </span>

              {/* Correct check icon */}
              {(showCorrect || preKHint) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <CheckCircle2 className="size-5 text-emerald-500" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <ActivityFeedback hint={question.hint} />
    </div>
  );
}
