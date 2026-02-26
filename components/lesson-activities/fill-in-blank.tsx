"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { FillInBlankContent } from "@/lib/activities/types";
import { ActivityFeedback } from "./activity-feedback";

// ---------------------------------------------------------------------------
// FillInBlank - Complete a sentence or equation with typed/tapped answer
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Normalize fill_in_blank data — seed migrations use 3 different schemas:
//   1. { template, correctAnswer }          (migrations 015-016)
//   2. { prompt, blanks: [{ correctAnswer }] } (migrations 018-021)
//   3. { sentence, correctAnswer }           (migrations 022-025)
// ---------------------------------------------------------------------------
interface RawFillInBlankQuestion {
  id: string;
  template?: string;
  prompt?: string;
  sentence?: string;
  correctAnswer?: string;
  acceptableAnswers?: string[];
  blanks?: { id: string; correctAnswer: string; acceptableAnswers?: string[] }[];
  hint?: string;
  wordBank?: string[];
}

function normalizeQuestion(raw: RawFillInBlankQuestion) {
  const templateText = raw.template ?? raw.sentence ?? raw.prompt ?? "___";
  const correctAnswer =
    raw.correctAnswer ?? raw.blanks?.[0]?.correctAnswer ?? "";
  const acceptableAnswers =
    raw.acceptableAnswers ?? raw.blanks?.[0]?.acceptableAnswers ?? [];
  return { ...raw, template: templateText, correctAnswer, acceptableAnswers };
}

/** Check if the expected answer is purely numeric (digits only) */
function isNumericAnswer(correctAnswer: string, acceptableAnswers: string[]): boolean {
  const isDigits = (s: string) => /^\d+$/.test(s.trim());
  if (!isDigits(correctAnswer)) return false;
  // If all acceptable alternatives are also numeric, treat as numeric
  return acceptableAnswers.every((a) => isDigits(a));
}

export function FillInBlank() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as FillInBlankContent;
  const rawQuestion = activity.questions[state.currentQuestionIndex] as unknown as RawFillInBlankQuestion | undefined;
  const prefersReducedMotion = useReducedMotion();

  const [answer, setAnswer] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const questionKey = rawQuestion?.id ?? state.currentQuestionIndex;

  // Clear answer and focus input on mount / question change
  useEffect(() => {
    setAnswer("");
    // Also clear DOM value directly to override browser form restoration
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    inputRef.current?.focus();
  }, [questionKey]);

  // Clean up retry timer on unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  if (!rawQuestion) return null;

  const question = normalizeQuestion(rawQuestion);
  const numericInput = isNumericAnswer(
    question.correctAnswer,
    question.acceptableAnswers ?? [],
  );

  // Split template on "___" to render the blank inline
  const parts = question.template.split("___");

  function handleSubmit() {
    if (!answer.trim()) return;

    // Clear any pending retry timer from a previous incorrect attempt
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);

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
      retryTimerRef.current = setTimeout(() => {
        setAnswer("");
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        inputRef.current?.focus();
      }, 2000);
    }
  }

  function handleWordBankTap(word: string) {
    play("tap");
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
                  inputMode={numericInput ? "numeric" : "text"}
                  pattern={numericInput ? "[0-9]*" : undefined}
                  name={`answer-${questionKey}`}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={
                    state.showingFeedback && state.feedbackType === "correct"
                  }
                  className={cn(
                    "inline-block w-24 rounded-xl border-2 border-dashed bg-card px-3 py-2.5 text-center text-xl font-bold outline-none transition-colors",
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
                  "rounded-xl border-2 px-5 py-2.5 text-base font-medium transition-all duration-200 touch-manipulation",
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
