"use client";

import { useState, useTransition } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

import { addChild } from "./actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// Constants (matching onboarding-form.tsx)
// ---------------------------------------------------------------------------

interface AvatarOption {
  id: string;
  emoji: string;
  label: string;
}

const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "robot", emoji: "\uD83E\uDD16", label: "Robot" },
  { id: "fairy", emoji: "\uD83E\uDDDA", label: "Fairy" },
  { id: "astronaut", emoji: "\uD83D\uDE80", label: "Astronaut" },
  { id: "wizard", emoji: "\uD83E\uDDD9", label: "Wizard" },
  { id: "dragon", emoji: "\uD83D\uDC32", label: "Dragon" },
  { id: "unicorn", emoji: "\uD83E\uDD84", label: "Unicorn" },
  { id: "ninja", emoji: "\uD83E\uDD77", label: "Ninja" },
  { id: "scientist", emoji: "\uD83E\uDDEC", label: "Scientist" },
];

const GRADE_OPTIONS = [
  { value: -1, label: "Pre-K", ages: "3-5" },
  { value: 0, label: "Kindergarten", ages: "5-6" },
  { value: 1, label: "1st Grade", ages: "6-7" },
  { value: 2, label: "2nd Grade", ages: "7-8" },
  { value: 3, label: "3rd Grade", ages: "8-9" },
  { value: 4, label: "4th Grade", ages: "9-10" },
  { value: 5, label: "5th Grade", ages: "10-11" },
  { value: 6, label: "6th Grade", ages: "11-12" },
];

// ---------------------------------------------------------------------------
// Step type
// ---------------------------------------------------------------------------

type Step = "name" | "grade" | "avatar" | "pin";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AddChildDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resetForm() {
    setStep("name");
    setName("");
    setGrade(null);
    setAvatar(null);
    setPin("");
    setError(null);
  }

  function handleOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) resetForm();
  }

  function handleNext() {
    setError(null);

    if (step === "name") {
      const trimmed = name.trim();
      if (!trimmed) {
        setError("Please enter a name.");
        return;
      }
      if (trimmed.length > 30) {
        setError("Name must be 30 characters or fewer.");
        return;
      }
      setStep("grade");
    } else if (step === "grade") {
      if (grade === null) {
        setError("Please select a grade level.");
        return;
      }
      setStep("avatar");
    } else if (step === "avatar") {
      if (!avatar) {
        setError("Please pick an avatar.");
        return;
      }
      setStep("pin");
    } else if (step === "pin") {
      if (!/^\d{4}$/.test(pin)) {
        setError("PIN must be exactly 4 digits.");
        return;
      }
      handleSubmit();
    }
  }

  function handleBack() {
    setError(null);
    if (step === "grade") setStep("name");
    else if (step === "avatar") setStep("grade");
    else if (step === "pin") setStep("avatar");
  }

  function handleSubmit() {
    if (grade === null || !avatar) return;

    startTransition(async () => {
      const result = await addChild(name.trim(), grade, avatar, pin);
      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  const stepIndex = ["name", "grade", "avatar", "pin"].indexOf(step);
  const stepLabels = ["Name", "Grade", "Avatar", "PIN"];

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-3 w-full gap-2 rounded-xl border-dashed border-primary/40 py-6 text-primary hover:border-primary hover:bg-primary/5"
        >
          <UserPlus className="size-4" />
          Add Learner
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a New Learner</DialogTitle>
          <DialogDescription>
            Step {stepIndex + 1} of 4: {stepLabels[stepIndex]}
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="flex gap-1.5">
          {stepLabels.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-200",
                i <= stepIndex ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[180px] py-2">
          {step === "name" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <label htmlFor="child-name" className="text-sm font-medium text-foreground">
                What is your child&apos;s name?
              </label>
              <Input
                id="child-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                placeholder="e.g., Hayley"
                maxLength={30}
                autoFocus
                className="rounded-lg text-base"
              />
            </motion.div>
          )}

          {step === "grade" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium text-foreground">
                What grade is {name.trim() || "your child"} in?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {GRADE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setGrade(opt.value);
                      setError(null);
                    }}
                    className={cn(
                      "flex min-h-[44px] flex-col items-center justify-center rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all",
                      "focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:outline-none",
                      grade === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent bg-muted/40 text-foreground hover:border-border hover:bg-muted/70",
                    )}
                  >
                    <span>{opt.label}</span>
                    <span className="text-[10px] text-muted-foreground">Ages {opt.ages}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "avatar" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium text-foreground">
                Pick an avatar for {name.trim() || "your child"}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setAvatar(opt.id);
                      setError(null);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all",
                      "focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:outline-none",
                      avatar === opt.id
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-transparent bg-muted/40 hover:border-border hover:bg-muted/70",
                    )}
                    aria-label={`Select ${opt.label} avatar`}
                    aria-pressed={avatar === opt.id}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-[11px] text-muted-foreground">{opt.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "pin" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium text-foreground">
                Set a 4-digit PIN for {name.trim() || "your child"}
              </p>
              <p className="text-xs text-muted-foreground">
                This PIN will be used when switching to {name.trim() || "this learner"}&apos;s profile.
              </p>
              <Input
                value={pin}
                onChange={(e) => {
                  // Only allow digits, max 4
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setPin(digits);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                placeholder="0000"
                maxLength={4}
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                className="rounded-lg text-center text-2xl tracking-[0.5em] font-mono"
              />
            </motion.div>
          )}

          {error && (
            <p className="mt-2 text-xs text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {step !== "name" ? (
            <Button
              variant="outline"
              onClick={handleBack}
              className="rounded-xl"
              disabled={isPending}
            >
              Back
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl"
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={isPending}
            className="rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating...
              </>
            ) : step === "pin" ? (
              "Add Learner"
            ) : (
              "Next"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
