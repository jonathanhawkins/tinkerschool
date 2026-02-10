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

export function MultipleChoice() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as MultipleChoiceContent;
  const question = activity.questions[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Reset selection when question changes
  const questionKey = question?.id ?? state.currentQuestionIndex;

  if (!question) return null;

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

      {/* Options grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option, i) => {
          const isSelected = selectedId === option.id;
          const isCorrectOption = option.id === question.correctOptionId;
          const showCorrect =
            state.showingFeedback &&
            state.feedbackType === "correct" &&
            isCorrectOption;
          const showWrong =
            state.showingFeedback &&
            state.feedbackType === "incorrect" &&
            isSelected &&
            !isCorrectOption;

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
                state.showingFeedback && state.feedbackType === "correct"
              }
              className={cn(
                "relative flex min-h-[56px] items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                "hover:shadow-md active:scale-[0.98]",
                // Default state
                !isSelected &&
                  !showCorrect &&
                  "border-border bg-card hover:border-border/80",
                // Selected + correct
                showCorrect &&
                  "border-emerald-400 bg-emerald-500/10",
                // Selected + wrong
                showWrong &&
                  "border-red-300 bg-red-500/10",
                // Selected but no feedback yet
                isSelected &&
                  !state.showingFeedback &&
                  "border-primary/50 bg-primary/5",
              )}
              style={
                !isSelected && !showCorrect && !showWrong
                  ? undefined
                  : undefined
              }
            >
              {/* Option emoji */}
              {option.emoji && (
                <span className="text-2xl">{option.emoji}</span>
              )}

              {/* Option text */}
              <span className="flex-1 text-base font-medium text-foreground">
                {option.text}
              </span>

              {/* Correct check icon */}
              {showCorrect && (
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
