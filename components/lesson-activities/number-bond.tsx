"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { NumberBondContent } from "@/lib/activities/types";
import { ActivityFeedback } from "./activity-feedback";

// ---------------------------------------------------------------------------
// NumberBond - Part-part-whole diagram with three connected circles
// ---------------------------------------------------------------------------
// A whole-number circle at top, two part circles at bottom-left and
// bottom-right. One or two values are pre-filled; the student types
// the missing value(s). Teaches addition/subtraction as related ops.
// ---------------------------------------------------------------------------

export function NumberBond() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as NumberBondContent;
  const question = activity.questions[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const [wholeInput, setWholeInput] = useState("");
  const [part1Input, setPart1Input] = useState("");
  const [part2Input, setPart2Input] = useState("");
  const firstEmptyRef = useRef<HTMLInputElement>(null);

  const questionKey = question?.id ?? state.currentQuestionIndex;

  // Reset inputs when question changes
  useEffect(() => {
    setWholeInput("");
    setPart1Input("");
    setPart2Input("");
    // Focus the first empty field after a tick
    setTimeout(() => firstEmptyRef.current?.focus(), 100);
  }, [questionKey]);

  if (!question) return null;

  // Determine which values are given vs. which the student fills
  const wholeGiven = question.whole !== null;
  const part1Given = question.part1 !== null;
  const part2Given = question.part2 !== null;

  // Compute correct answers for missing fields
  const correctWhole =
    question.whole ?? (question.part1 ?? 0) + (question.part2 ?? 0);
  const correctPart1 =
    question.part1 ?? correctWhole - (question.part2 ?? 0);
  const correctPart2 =
    question.part2 ?? correctWhole - (question.part1 ?? 0);

  // Track which ref should be the first empty input
  let firstEmptyAssigned = false;
  function getFirstEmptyRef() {
    if (!firstEmptyAssigned) {
      firstEmptyAssigned = true;
      return firstEmptyRef;
    }
    return undefined;
  }

  function handleSubmit() {
    let allCorrect = true;

    if (!wholeGiven) {
      if (parseInt(wholeInput.trim(), 10) !== correctWhole) allCorrect = false;
    }
    if (!part1Given) {
      if (parseInt(part1Input.trim(), 10) !== correctPart1) allCorrect = false;
    }
    if (!part2Given) {
      if (parseInt(part2Input.trim(), 10) !== correctPart2) allCorrect = false;
    }

    // Build answer string from user inputs
    const answerParts: string[] = [];
    if (!wholeGiven) answerParts.push(`whole=${wholeInput.trim()}`);
    if (!part1Given) answerParts.push(`part1=${part1Input.trim()}`);
    if (!part2Given) answerParts.push(`part2=${part2Input.trim()}`);

    recordAnswer(answerParts.join(","), allCorrect);

    if (!allCorrect) {
      setTimeout(() => {
        setWholeInput("");
        setPart1Input("");
        setPart2Input("");
        firstEmptyRef.current?.focus();
      }, 2000);
    }
  }

  // Check if user has filled all required fields
  const allFilled =
    (wholeGiven || wholeInput.trim().length > 0) &&
    (part1Given || part1Input.trim().length > 0) &&
    (part2Given || part2Input.trim().length > 0);

  const isCorrectFeedback =
    state.showingFeedback && state.feedbackType === "correct";
  const isIncorrectFeedback =
    state.showingFeedback && state.feedbackType === "incorrect";

  // Render a circle with either a fixed value or an input
  function renderCircle(
    label: string,
    value: number | null,
    input: string,
    setInput: (v: string) => void,
    isGiven: boolean,
    correctValue: number,
  ) {
    return (
      <div className="flex flex-col items-center gap-1">
        <motion.div
          initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "flex size-20 items-center justify-center rounded-full border-3 text-2xl font-bold transition-colors sm:size-24",
            isGiven
              ? "border-border bg-card"
              : isCorrectFeedback
                ? "border-emerald-400 bg-emerald-500/10"
                : isIncorrectFeedback
                  ? "border-red-300 bg-red-500/10"
                  : "border-dashed border-border bg-card focus-within:border-solid",
          )}
          style={
            isGiven
              ? { borderColor: subjectColor, backgroundColor: `${subjectColor}10` }
              : undefined
          }
        >
          {isGiven ? (
            <span style={{ color: subjectColor }}>{value}</span>
          ) : (
            <input
              ref={getFirstEmptyRef()}
              type="number"
              inputMode="numeric"
              value={input}
              onChange={(e) => {
                play("tap");
                setInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (allFilled) handleSubmit();
                }
              }}
              disabled={isCorrectFeedback}
              className="w-12 bg-transparent text-center text-2xl font-bold text-foreground outline-none sm:w-14"
              placeholder="?"
              aria-label={`Enter the ${label}`}
            />
          )}
        </motion.div>
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6" key={questionKey}>
      {/* Prompt */}
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {question.prompt}
        </h3>
        <p className="text-sm text-muted-foreground">
          Fill in the missing number{!wholeGiven && (!part1Given || !part2Given) ? "s" : ""}!
        </p>
      </div>

      {/* Number bond diagram */}
      <div className="flex flex-col items-center gap-2">
        {/* Whole (top) */}
        {renderCircle("Whole", question.whole, wholeInput, setWholeInput, wholeGiven, correctWhole)}

        {/* Connecting lines (SVG) */}
        <svg
          width="160"
          height="40"
          viewBox="0 0 160 40"
          className="text-border"
          aria-hidden
        >
          <line
            x1="80"
            y1="0"
            x2="40"
            y2="40"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={isCorrectFeedback ? "0" : "6 4"}
          />
          <line
            x1="80"
            y1="0"
            x2="120"
            y2="40"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={isCorrectFeedback ? "0" : "6 4"}
          />
        </svg>

        {/* Parts (bottom) */}
        <div className="flex items-center gap-8 sm:gap-12">
          {renderCircle("Part", question.part1, part1Input, setPart1Input, part1Given, correctPart1)}
          {renderCircle("Part", question.part2, part2Input, setPart2Input, part2Given, correctPart2)}
        </div>
      </div>

      {/* Submit button */}
      {!state.showingFeedback && allFilled && (
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
            Check My Answer
          </Button>
        </motion.div>
      )}

      {/* Feedback */}
      <ActivityFeedback hint={question.hint} />
    </div>
  );
}
