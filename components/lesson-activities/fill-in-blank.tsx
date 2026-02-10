"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import type { FillInBlankContent } from "@/lib/activities/types";
import { ActivityFeedback } from "./activity-feedback";

// ---------------------------------------------------------------------------
// FillInBlank - Complete a sentence or equation with typed/tapped answer
// ---------------------------------------------------------------------------

export function FillInBlank() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const activity = currentActivity as FillInBlankContent;
  const question = activity.questions[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const [answer, setAnswer] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const questionKey = question?.id ?? state.currentQuestionIndex;

  // Auto-focus the input on mount / question change
  useEffect(() => {
    setAnswer("");
    inputRef.current?.focus();
  }, [questionKey]);

  if (!question) return null;

  // Split template on "___" to render the blank inline
  const parts = question.template.split("___");

  function handleSubmit() {
    if (!answer.trim()) return;

    const trimmed = answer.trim().toLowerCase();
    const correct = question.correctAnswer.toLowerCase();
    const alternatives = (question.acceptableAnswers ?? []).map((a) =>
      a.toLowerCase(),
    );

    const isCorrect =
      trimmed === correct || alternatives.includes(trimmed);

    recordAnswer(answer.trim(), isCorrect);

    if (!isCorrect) {
      // Reset for retry after feedback dismisses
      setTimeout(() => {
        setAnswer("");
        inputRef.current?.focus();
      }, 2000);
    }
  }

  function handleWordBankTap(word: string) {
    setAnswer(word);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="space-y-6" key={questionKey}>
      {/* Template with inline blank */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-muted/20 p-6 text-center">
        {parts.map((part, i) => (
          <span key={i} className="text-xl font-semibold text-foreground">
            {part}
            {i < parts.length - 1 && (
              <span className="relative mx-1 inline-block">
                <input
                  ref={i === 0 ? inputRef : undefined}
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={
                    state.showingFeedback && state.feedbackType === "correct"
                  }
                  className={cn(
                    "inline-block w-24 rounded-xl border-2 border-dashed bg-card px-3 py-2 text-center text-xl font-bold outline-none transition-colors",
                    "focus:border-solid",
                    state.showingFeedback && state.feedbackType === "correct"
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-700"
                      : state.showingFeedback && state.feedbackType === "incorrect"
                        ? "border-red-300 bg-red-500/10 text-red-700"
                        : "border-border focus:border-primary",
                  )}
                  style={{
                    width: `${Math.max(3, (question.correctAnswer.length + 2)) * 0.8}em`,
                  }}
                  placeholder="?"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Type your answer"
                />
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Word bank (optional, for younger kids) */}
      {question.wordBank && question.wordBank.length > 0 && (
        <div className="space-y-2">
          <p className="text-center text-xs font-medium text-muted-foreground">
            Choose from these words:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {question.wordBank.map((word) => (
              <motion.button
                key={word}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                onClick={() => handleWordBankTap(word)}
                disabled={
                  state.showingFeedback && state.feedbackType === "correct"
                }
                className={cn(
                  "rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all duration-200",
                  answer.toLowerCase() === word.toLowerCase()
                    ? "shadow-sm"
                    : "border-border bg-card hover:border-border/80 hover:shadow-sm",
                )}
                style={
                  answer.toLowerCase() === word.toLowerCase()
                    ? {
                        borderColor: subjectColor,
                        backgroundColor: `${subjectColor}10`,
                        color: subjectColor,
                      }
                    : undefined
                }
              >
                {word}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Submit button */}
      {!state.showingFeedback && answer.trim().length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleSubmit}
            size="lg"
            className="rounded-xl px-8"
            style={{ backgroundColor: subjectColor }}
          >
            <Check className="size-4" />
            Check Answer
          </Button>
        </motion.div>
      )}

      {/* Feedback */}
      <ActivityFeedback hint={question.hint} />
    </div>
  );
}
