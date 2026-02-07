"use client";

import { useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  PartyPopper,
  Rocket,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { completeOnboarding } from "./actions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OnboardingFormProps {
  parentNameDefault: string;
}

interface AvatarOption {
  id: string;
  emoji: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 5;

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
  { value: "0", label: "Kindergarten", ages: "5-6" },
  { value: "1", label: "1st Grade", ages: "6-7" },
  { value: "2", label: "2nd Grade", ages: "7-8" },
  { value: "3", label: "3rd Grade", ages: "8-9" },
  { value: "4", label: "4th Grade", ages: "9-10" },
  { value: "5", label: "5th Grade", ages: "10-11" },
  { value: "6", label: "6th Grade", ages: "11-12" },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

const stepTransition = {
  x: { type: "tween" as const, duration: 0.25, ease: "easeOut" as const },
  opacity: { duration: 0.2 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OnboardingForm({ parentNameDefault }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Form state
  const [familyName, setFamilyName] = useState("");
  const [parentName, setParentName] = useState(parentNameDefault);
  const [childName, setChildName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [avatarId, setAvatarId] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinConfirm, setPinConfirm] = useState(["", "", "", ""]);

  // Submission state
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  // Refs for PIN inputs
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const pinConfirmRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------

  const progressPercent = (step / TOTAL_STEPS) * 100;

  const selectedGrade = GRADE_OPTIONS.find((g) => g.value === gradeLevel);

  // ---------------------------------------------------------------------------
  // Step validation
  // ---------------------------------------------------------------------------

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return true;
      case 2:
        return familyName.trim().length > 0 && parentName.trim().length > 0;
      case 3:
        return (
          childName.trim().length > 0 &&
          gradeLevel !== "" &&
          avatarId !== ""
        );
      case 4:
        return (
          pin.every((d) => /^\d$/.test(d)) &&
          pinConfirm.every((d) => /^\d$/.test(d)) &&
          pin.join("") === pinConfirm.join("")
        );
      case 5:
        return true;
      default:
        return false;
    }
  }

  function pinMismatchError(): string {
    const pinStr = pin.join("");
    const confirmStr = pinConfirm.join("");

    if (pinStr.length < 4 || confirmStr.length < 4) return "";
    if (pinStr !== confirmStr) return "PINs don't match. Try again!";
    return "";
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  function goNext() {
    if (!canProceed()) return;
    setDirection(1);
    setError("");

    if (step === 4) {
      // Submit the form
      handleSubmit();
      return;
    }

    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setDirection(-1);
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  // ---------------------------------------------------------------------------
  // PIN input handler
  // ---------------------------------------------------------------------------

  function handlePinChange(
    index: number,
    value: string,
    isConfirm: boolean,
  ) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const setter = isConfirm ? setPinConfirm : setPin;
    const refs = isConfirm ? pinConfirmRefs : pinRefs;

    setter((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    // Auto-advance to next input
    if (digit && index < 3) {
      refs[index + 1].current?.focus();
    }
  }

  function handlePinKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    isConfirm: boolean,
  ) {
    const refs = isConfirm ? pinConfirmRefs : pinRefs;
    const values = isConfirm ? pinConfirm : pin;

    if (e.key === "Backspace" && !values[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  function handleSubmit() {
    const pinStr = pin.join("");
    const confirmStr = pinConfirm.join("");

    if (pinStr !== confirmStr) {
      setError("PINs don't match. Try again!");
      return;
    }

    const formData = new FormData();
    formData.set("family_name", familyName.trim());
    formData.set("parent_name", parentName.trim());
    formData.set("child_name", childName.trim());
    formData.set("grade_level", gradeLevel);
    formData.set("avatar_id", avatarId);
    formData.set("pin", pinStr);

    startTransition(async () => {
      const result = await completeOnboarding(formData);

      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
      } else {
        // On success the action will redirect, but we also advance
        // the step locally for the celebration screen.
        setDirection(1);
        setStep(5);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  function renderStep() {
    switch (step) {
      case 1:
        return <StepWelcome />;
      case 2:
        return (
          <StepFamily
            familyName={familyName}
            onFamilyNameChange={setFamilyName}
            parentName={parentName}
            onParentNameChange={setParentName}
          />
        );
      case 3:
        return (
          <StepChild
            childName={childName}
            onChildNameChange={setChildName}
            gradeLevel={gradeLevel}
            onGradeLevelChange={setGradeLevel}
            selectedGrade={selectedGrade}
            avatarId={avatarId}
            onAvatarChange={setAvatarId}
          />
        );
      case 4:
        return (
          <StepPin
            childName={childName}
            pin={pin}
            pinConfirm={pinConfirm}
            pinRefs={pinRefs}
            pinConfirmRefs={pinConfirmRefs}
            onPinChange={handlePinChange}
            onPinKeyDown={handlePinKeyDown}
            mismatchError={pinMismatchError()}
          />
        );
      case 5:
        return <StepDone childName={childName} />;
      default:
        return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Progress indicator */}
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
          <span>
            Step {step} of {TOTAL_STEPS}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-3 rounded-full" />
      </div>

      {/* Step card */}
      <Card className="w-full rounded-2xl border-border/60 shadow-md">
        <CardContent className="pb-2 pt-2">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex w-full items-center justify-between gap-3">
        {step > 1 && step < 5 ? (
          <Button
            variant="outline"
            size="lg"
            onClick={goBack}
            disabled={isPending}
            className="rounded-xl"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < 5 && (
          <Button
            size="lg"
            onClick={goNext}
            disabled={!canProceed() || isPending}
            className="rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Setting up...
              </>
            ) : step === 4 ? (
              <>
                Finish Setup
                <Sparkles className="size-4" />
              </>
            ) : step === 1 ? (
              <>
                Get Started
                <Rocket className="size-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// Step 1: Welcome
// ===========================================================================

function StepWelcome() {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
        className="flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-4xl"
      >
        {"\uD83D\uDE80"}
      </motion.div>
      <h1 className="text-2xl font-semibold text-foreground">
        Welcome to TinkerSchool!
      </h1>
      <p className="max-w-sm text-muted-foreground">
        Let&apos;s set up your family&apos;s learning adventure. It only takes a
        minute to get your child started with hands-on lessons across every subject.
      </p>
    </div>
  );
}

// ===========================================================================
// Step 2: Family Setup
// ===========================================================================

interface StepFamilyProps {
  familyName: string;
  onFamilyNameChange: (value: string) => void;
  parentName: string;
  onParentNameChange: (value: string) => void;
}

function StepFamily({
  familyName,
  onFamilyNameChange,
  parentName,
  onParentNameChange,
}: StepFamilyProps) {
  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Family Setup
        </h2>
        <p className="text-sm text-muted-foreground">
          Tell us a bit about your family
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="family-name"
            className="text-sm font-medium text-foreground"
          >
            Family Name
          </label>
          <Input
            id="family-name"
            placeholder='e.g. "The Smith Family"'
            value={familyName}
            onChange={(e) => onFamilyNameChange(e.target.value)}
            className="h-11 rounded-xl text-base"
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="parent-name"
            className="text-sm font-medium text-foreground"
          >
            Your Name
          </label>
          <Input
            id="parent-name"
            placeholder="Your display name"
            value={parentName}
            onChange={(e) => onParentNameChange(e.target.value)}
            className="h-11 rounded-xl text-base"
          />
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Step 3: Add Your Child
// ===========================================================================

interface StepChildProps {
  childName: string;
  onChildNameChange: (value: string) => void;
  gradeLevel: string;
  onGradeLevelChange: (value: string) => void;
  selectedGrade: (typeof GRADE_OPTIONS)[number] | undefined;
  avatarId: string;
  onAvatarChange: (value: string) => void;
}

function StepChild({
  childName,
  onChildNameChange,
  gradeLevel,
  onGradeLevelChange,
  selectedGrade,
  avatarId,
  onAvatarChange,
}: StepChildProps) {
  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Add Your Child
        </h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ll personalize their coding journey
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Child name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="child-name"
            className="text-sm font-medium text-foreground"
          >
            Child&apos;s Name
          </label>
          <Input
            id="child-name"
            placeholder='e.g. "Cassidy"'
            value={childName}
            onChange={(e) => onChildNameChange(e.target.value)}
            className="h-11 rounded-xl text-base"
            autoFocus
          />
        </div>

        {/* Grade level */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Grade Level
          </label>
          <Select value={gradeLevel} onValueChange={onGradeLevelChange}>
            <SelectTrigger className="h-11 w-full rounded-xl text-base">
              <SelectValue placeholder="Select a grade" />
            </SelectTrigger>
            <SelectContent>
              {GRADE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedGrade && (
            <p className="text-xs text-muted-foreground">
              Typical ages: {selectedGrade.ages}
            </p>
          )}
        </div>

        {/* Avatar picker */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Pick an Avatar
          </label>
          <div className="grid grid-cols-4 gap-2">
            {AVATAR_OPTIONS.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                onClick={() => onAvatarChange(avatar.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all duration-200",
                  avatarId === avatar.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-transparent bg-muted/40 hover:border-border hover:bg-muted/70",
                )}
                aria-label={`Select ${avatar.label} avatar`}
                aria-pressed={avatarId === avatar.id}
              >
                <span className="text-2xl">{avatar.emoji}</span>
                <span className="text-[11px] text-muted-foreground">
                  {avatar.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Step 4: Set PIN
// ===========================================================================

interface StepPinProps {
  childName: string;
  pin: string[];
  pinConfirm: string[];
  pinRefs: React.RefObject<HTMLInputElement | null>[];
  pinConfirmRefs: React.RefObject<HTMLInputElement | null>[];
  onPinChange: (index: number, value: string, isConfirm: boolean) => void;
  onPinKeyDown: (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    isConfirm: boolean,
  ) => void;
  mismatchError: string;
}

function StepPin({
  childName,
  pin,
  pinConfirm,
  pinRefs,
  pinConfirmRefs,
  onPinChange,
  onPinKeyDown,
  mismatchError,
}: StepPinProps) {
  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Create a Secret Code
        </h2>
        <p className="text-sm text-muted-foreground">
          {childName || "Your child"} will use this 4-digit code to log in
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* PIN entry */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-foreground">
            Secret Code
          </label>
          <div className="flex items-center gap-3">
            {pin.map((digit, i) => (
              <input
                key={`pin-${i}`}
                ref={pinRefs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => onPinChange(i, e.target.value, false)}
                onKeyDown={(e) => onPinKeyDown(i, e, false)}
                autoFocus={i === 0}
                className={cn(
                  "size-14 rounded-xl border-2 bg-muted/30 text-center text-2xl font-semibold text-foreground outline-none transition-all duration-200",
                  "focus:border-primary focus:ring-primary/30 focus:ring-[3px]",
                  digit ? "border-primary/50" : "border-border",
                )}
                aria-label={`PIN digit ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* PIN confirmation */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-foreground">
            Confirm Secret Code
          </label>
          <div className="flex items-center gap-3">
            {pinConfirm.map((digit, i) => (
              <input
                key={`pin-confirm-${i}`}
                ref={pinConfirmRefs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => onPinChange(i, e.target.value, true)}
                onKeyDown={(e) => onPinKeyDown(i, e, true)}
                className={cn(
                  "size-14 rounded-xl border-2 bg-muted/30 text-center text-2xl font-semibold text-foreground outline-none transition-all duration-200",
                  "focus:border-primary focus:ring-primary/30 focus:ring-[3px]",
                  digit ? "border-primary/50" : "border-border",
                )}
                aria-label={`Confirm PIN digit ${i + 1}`}
              />
            ))}
          </div>
          {mismatchError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive"
            >
              {mismatchError}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Step 5: All Done
// ===========================================================================

interface StepDoneProps {
  childName: string;
}

function StepDone({ childName }: StepDoneProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 12 }}
        className="flex size-20 items-center justify-center rounded-3xl bg-primary/10"
      >
        <PartyPopper className="size-10 text-primary" />
      </motion.div>
      <h2 className="text-2xl font-semibold text-foreground">
        You&apos;re All Set!
      </h2>
      <p className="max-w-sm text-muted-foreground">
        {childName || "Your child"}&apos;s coding adventure is ready. Time to
        start building amazing things with Chip!
      </p>
      <Button
        size="lg"
        className="mt-2 rounded-xl"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <Rocket className="size-4" />
        Start Coding!
      </Button>
    </div>
  );
}
