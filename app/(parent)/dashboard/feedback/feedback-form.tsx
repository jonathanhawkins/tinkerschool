"use client";

import { useTransition, useState } from "react";
import {
  Bug,
  Lightbulb,
  MessageSquare,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { FeedbackCategory } from "@/lib/supabase/types";
import { submitFeedback } from "./actions";

// ---------------------------------------------------------------------------
// Category config
// ---------------------------------------------------------------------------

interface CategoryOption {
  value: FeedbackCategory;
  label: string;
  description: string;
  icon: typeof Bug;
  color: string;
  bgColor: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    value: "bug",
    label: "Bug Report",
    description: "Something isn't working right",
    icon: Bug,
    color: "text-red-600",
    bgColor: "bg-red-500/10",
  },
  {
    value: "feature_request",
    label: "Feature Request",
    description: "I have an idea for something new",
    icon: Lightbulb,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  {
    value: "general",
    label: "General Feedback",
    description: "Thoughts, praise, or suggestions",
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FeedbackForm() {
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!description.trim()) {
      setError("Please describe your feedback.");
      return;
    }

    startTransition(async () => {
      const result = await submitFeedback({
        category,
        title: title.trim(),
        description: description.trim(),
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      });

      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }

      setSuccess(true);
    });
  }

  function handleReset() {
    setCategory(null);
    setTitle("");
    setDescription("");
    setError(null);
    setSuccess(false);
  }

  // Success state
  if (success) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="size-8 text-emerald-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Thank you for your feedback!
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              We appreciate you taking the time to help us improve TinkerSchool.
              We&apos;ll review your feedback soon.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-2 rounded-xl"
            onClick={handleReset}
          >
            Submit More Feedback
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category selection */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">What type of feedback?</CardTitle>
          <CardDescription>
            Select the category that best matches your feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.value;

              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-transparent bg-muted/30 hover:bg-muted/50",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl",
                      cat.bgColor,
                    )}
                  >
                    <Icon className={cn("size-5", cat.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {cat.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
          <CardDescription>
            {category === "bug"
              ? "Describe what happened, what you expected, and the steps to reproduce."
              : category === "feature_request"
                ? "Describe the feature you'd like to see and how it would help."
                : "Share your thoughts, suggestions, or anything else."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="feedback-title"
              className="text-sm font-medium text-foreground"
            >
              Title
            </label>
            <Input
              id="feedback-title"
              placeholder={
                category === "bug"
                  ? "e.g., Lesson progress not saving after completion"
                  : category === "feature_request"
                    ? "e.g., Add dark mode for the workshop"
                    : "e.g., Great experience with math lessons!"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="feedback-description"
              className="text-sm font-medium text-foreground"
            >
              Description
            </label>
            <Textarea
              id="feedback-description"
              placeholder={
                category === "bug"
                  ? "What happened? What did you expect? What steps led to the issue?"
                  : category === "feature_request"
                    ? "Describe the feature, why it would be useful, and any ideas for how it could work."
                    : "Share your thoughts..."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              rows={5}
              className="min-h-32 rounded-lg"
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/5000 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="rounded-xl"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Submit Feedback
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
