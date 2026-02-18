"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Monitor,
  Rocket,
  Shield,
  Sparkles,
  Usb,
  Wifi,
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

import { completeOnboarding, updateDeviceMode } from "./actions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OnboardingFormProps {
  parentNameDefault: string;
  /** True when the server detected an existing profile (onboarding step 4 already done). */
  hasProfile: boolean;
}

interface AvatarOption {
  id: string;
  emoji: string;
  label: string;
}

type DeviceMode = "usb" | "wifi" | "simulator" | "none";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 7;

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

const STORAGE_KEY = "tinkerschool_onboarding";

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
// localStorage helpers
// ---------------------------------------------------------------------------

interface SavedOnboardingState {
  step: number;
  familyName: string;
  parentName: string;
  childName: string;
  gradeLevel: string;
  avatarId: string;
  deviceMode: DeviceMode;
  kidProfileId: string;
}

function loadSavedState(): SavedOnboardingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedOnboardingState;
  } catch {
    return null;
  }
}

// Stable snapshot for useSyncExternalStore -- read once, cache until storage changes.
let _cachedSnapshot: SavedOnboardingState | null | undefined;

function getSavedSnapshot(): SavedOnboardingState | null {
  if (_cachedSnapshot === undefined) {
    _cachedSnapshot = loadSavedState();
  }
  return _cachedSnapshot;
}

function getServerSnapshot(): null {
  return null;
}

function subscribeSavedState(callback: () => void): () => void {
  // Re-read on storage events (other tabs) and invalidate cache.
  function onStorage(e: StorageEvent) {
    if (e.key === STORAGE_KEY || e.key === null) {
      _cachedSnapshot = undefined;
      callback();
    }
  }
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function saveState(state: SavedOnboardingState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail -- localStorage might be full or unavailable
  }
}

function clearSavedState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    _cachedSnapshot = undefined;
  } catch {
    // noop
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OnboardingForm({ parentNameDefault, hasProfile }: OnboardingFormProps) {
  // Read saved onboarding progress from localStorage (hydration-safe).
  const saved = useSyncExternalStore(subscribeSavedState, getSavedSnapshot, getServerSnapshot);

  const [step, setStep] = useState(saved?.step ?? 1);
  const [direction, setDirection] = useState(1);

  // Form state
  const [familyName, setFamilyName] = useState(saved?.familyName ?? "");
  const [parentName, setParentName] = useState(saved?.parentName ?? parentNameDefault);
  const [childName, setChildName] = useState(saved?.childName ?? "");
  const [gradeLevel, setGradeLevel] = useState(saved?.gradeLevel ?? "");
  const [avatarId, setAvatarId] = useState(saved?.avatarId ?? "");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinConfirm, setPinConfirm] = useState(["", "", "", ""]);
  const [coppaConsent, setCoppaConsent] = useState(false);

  // Post-submission state
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(saved?.deviceMode ?? "none");
  const [kidProfileId, setKidProfileId] = useState(saved?.kidProfileId ?? "");

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

  // Derive a stable boolean so the dependency array never changes shape
  // (avoids null→object flip between server and client snapshots).
  const hasSavedState = saved != null;

  // ---------------------------------------------------------------------------
  // Client-side redirect: profile exists but no saved step 5-7 state
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (hasProfile && !hasSavedState) {
      // Onboarding was already fully completed in a prior session.
      window.location.href = "/home";
    }
  }, [hasProfile, hasSavedState]);

  // ---------------------------------------------------------------------------
  // Persist state to localStorage on changes
  // ---------------------------------------------------------------------------

  useEffect(() => {
    // Don't persist PIN for security. Don't persist step < 5 since
    // we only need to resume from post-submission steps.
    if (step >= 5 && kidProfileId) {
      saveState({
        step,
        familyName,
        parentName,
        childName,
        gradeLevel,
        avatarId,
        deviceMode,
        kidProfileId,
      });
    }
  }, [step, familyName, parentName, childName, gradeLevel, avatarId, deviceMode, kidProfileId]);

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
          pin.join("") === pinConfirm.join("") &&
          coppaConsent
        );
      case 5:
        return true; // Device step is optional -- can always skip
      case 6:
        return true; // Meet Chip is a celebration -- always proceed
      case 7:
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
      // Submit the form -- create profiles in the database
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
  // Submit (at end of Step 4)
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
    formData.set("coppa_consent", coppaConsent ? "true" : "false");

    startTransition(async () => {
      const result = await completeOnboarding(formData);

      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
      } else {
        // Profiles created -- advance to device setup step.
        setKidProfileId(result.kidProfileId ?? "");
        setDirection(1);
        setStep(5);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Device mode selection (Step 5)
  // ---------------------------------------------------------------------------

  const handleDeviceModeSelected = useCallback(
    (mode: DeviceMode) => {
      setDeviceMode(mode);
      // Persist the device mode to the database
      if (kidProfileId) {
        startTransition(async () => {
          await updateDeviceMode(kidProfileId, mode);
        });
      }
      // Advance to Meet Chip
      setDirection(1);
      setStep(6);
    },
    [kidProfileId],
  );

  // ---------------------------------------------------------------------------
  // Navigate to Mission Control after onboarding (Step 7)
  // ---------------------------------------------------------------------------

  const navigateToHome = useCallback(() => {
    clearSavedState();
    window.location.href = "/home?welcome=true";
  }, []);

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
            coppaConsent={coppaConsent}
            onCoppaConsentChange={setCoppaConsent}
          />
        );
      case 5:
        return (
          <StepDevice
            childName={childName}
            onDeviceModeSelected={handleDeviceModeSelected}
          />
        );
      case 6:
        return (
          <StepMeetChip
            childName={childName}
            avatarId={avatarId}
            onContinue={() => {
              setDirection(1);
              setStep(7);
            }}
          />
        );
      case 7:
        return (
          <StepFirstLesson
            childName={childName}
            onLaunch={navigateToHome}
          />
        );
      default:
        return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Determine navigation visibility
  // ---------------------------------------------------------------------------

  // Steps 1-4: standard back/next. Steps 5+: custom nav inside step components.
  const showStandardNav = step <= 4;
  // Steps 5-7: show skip option (only for step 5)
  const showSkipButton = step === 5;

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

      {/* Navigation buttons (Steps 1-4 only) */}
      {showStandardNav && (
        <div className="flex w-full items-center justify-between gap-3">
          {step > 1 ? (
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
        </div>
      )}

      {/* Skip button for device step */}
      {showSkipButton && (
        <div className="flex w-full justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeviceModeSelected("none")}
            className="text-muted-foreground"
          >
            Skip for now
            <ArrowRight className="ml-1 size-3" />
          </Button>
        </div>
      )}
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

      {/* COPPA Privacy Notice */}
      <div className="flex items-start gap-2 rounded-xl bg-muted/50 px-3 py-2.5">
        <Shield className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          We only collect your child&apos;s first name, grade, and avatar choice.
          All data stays private to your family. We comply with children&apos;s
          privacy protections.
        </p>
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
          We&apos;ll personalize their learning journey
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
            <SelectTrigger className="h-11 w-full rounded-xl text-base" tabIndex={0}>
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
                tabIndex={0}
                onClick={() => onAvatarChange(avatar.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all duration-200",
                  "focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:outline-none",
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
  coppaConsent: boolean;
  onCoppaConsentChange: (checked: boolean) => void;
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
  coppaConsent,
  onCoppaConsentChange,
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

        {/* COPPA Parental Consent */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 size-5 shrink-0 text-primary" />
            <div className="flex flex-col gap-2.5">
              <p className="text-sm font-medium text-foreground">
                Parental Consent
              </p>
              <label
                htmlFor="coppa-consent"
                className="flex cursor-pointer items-start gap-2.5"
              >
                <input
                  id="coppa-consent"
                  type="checkbox"
                  tabIndex={0}
                  checked={coppaConsent}
                  onChange={(e) => onCoppaConsentChange(e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-primary focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:outline-none"
                  aria-describedby="coppa-consent-description"
                />
                <span
                  id="coppa-consent-description"
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  I am this child&apos;s parent or legal guardian and I consent
                  to TinkerSchool collecting and using my child&apos;s
                  information as described in the{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    Privacy Policy
                  </a>{" "}
                  for educational purposes.
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Step 5: Connect Your Device
// ===========================================================================

interface StepDeviceProps {
  childName: string;
  onDeviceModeSelected: (mode: DeviceMode) => void;
}

function StepDevice({ childName, onDeviceModeSelected }: StepDeviceProps) {
  const [selectedPath, setSelectedPath] = useState<
    "have" | "have_wifi" | "not_yet" | "whats_that" | null
  >(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "testing" | "success" | "error"
  >("idle");
  const [connectionError, setConnectionError] = useState("");
  const [wifiIP, setWifiIP] = useState("");

  // Check Web Serial support on mount
  const [serialSupported, setSerialSupported] = useState(false);
  useEffect(() => {
    setSerialSupported(
      typeof navigator !== "undefined" && "serial" in navigator,
    );
  }, []);

  // ---------------------------------------------------------------------------
  // Handle device connection attempt
  // ---------------------------------------------------------------------------

  async function handleConnectDevice() {
    setConnectionStatus("connecting");
    setConnectionError("");

    try {
      // Dynamic import to avoid SSR issues
      const { WebSerialManager } = await import("@/lib/serial/web-serial");
      const { MicroPythonREPL } = await import(
        "@/lib/serial/micropython-repl"
      );

      const serial = new WebSerialManager();
      await serial.connect();

      setConnectionStatus("testing");

      // Test the connection by executing a simple command
      const repl = new MicroPythonREPL(serial);
      const testCode = `print("Hello ${childName || "TinkerSchool"}!")`;
      await repl.executeCode(testCode);

      // Disconnect after test
      await serial.disconnect();

      setConnectionStatus("success");

      // Auto-advance after a brief celebration
      setTimeout(() => {
        onDeviceModeSelected("usb");
      }, 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);

      if (msg === "NO_DEVICE_SELECTED") {
        // User cancelled the picker -- go back to idle
        setConnectionStatus("idle");
        return;
      }

      setConnectionStatus("error");
      setConnectionError(
        msg.includes("NOT_CONNECTED") || msg.includes("PORT_OPEN_FAILED")
          ? "Could not connect to the device. Make sure it is plugged in and try again."
          : msg.includes("Timed out")
            ? "Device connected but MicroPython did not respond. You may need to flash the firmware from the Setup page later."
            : `Connection error: ${msg}`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Path: "I have one!" -- connection UI
  // ---------------------------------------------------------------------------

  if (selectedPath === "have") {
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Connect Your Device
          </h2>
          <p className="text-sm text-muted-foreground">
            Plug in your M5StickC Plus 2 with a USB cable
          </p>
        </div>

        {/* Connection status */}
        <div className="flex flex-col items-center gap-4">
          {connectionStatus === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                <Usb className="size-8 text-primary" />
              </div>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    1
                  </span>
                  Plug the USB cable into your M5Stick and computer
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    2
                  </span>
                  Click the button below to connect
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    3
                  </span>
                  Select your device from the popup
                </li>
              </ol>
              <Button
                size="lg"
                onClick={handleConnectDevice}
                className="rounded-xl"
              >
                <Usb className="size-4" />
                Connect Device
              </Button>
            </motion.div>
          )}

          {connectionStatus === "connecting" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Looking for your M5Stick...
              </p>
            </div>
          )}

          {connectionStatus === "testing" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Testing connection -- saying hello to {childName || "your device"}!
              </p>
            </div>
          )}

          {connectionStatus === "success" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10">
                <CheckCircle2 className="size-8 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-emerald-600">
                Device connected! {childName || "Your device"} says hello!
              </p>
            </motion.div>
          )}

          {connectionStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
                {connectionError}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setConnectionStatus("idle");
                    setConnectionError("");
                  }}
                  className="rounded-xl"
                >
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeviceModeSelected("simulator")}
                  className="rounded-xl text-muted-foreground"
                >
                  Use Simulator Instead
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Back button */}
        {connectionStatus === "idle" && (
          <button
            onClick={() => setSelectedPath(null)}
            className="mx-auto text-xs text-muted-foreground hover:text-foreground"
          >
            Back to options
          </button>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Path: "I have one!" -- WiFi connection UI
  // ---------------------------------------------------------------------------

  if (selectedPath === "have_wifi") {
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Connect Over WiFi
          </h2>
          <p className="text-sm text-muted-foreground">
            Connect your M5Stick wirelessly
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Wifi className="size-8 text-primary" />
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="text-center font-medium text-foreground">
              How to find your M5Stick&apos;s IP address:
            </p>
            <ol className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  1
                </span>
                Turn on your M5Stick and connect it to your WiFi network
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  2
                </span>
                The IP address shows on the M5Stick screen at startup (e.g. 192.168.1.42)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  3
                </span>
                Make sure this device is on the same WiFi network
              </li>
            </ol>
          </div>

          <div className="flex w-full max-w-xs flex-col gap-3">
            <Input
              type="text"
              placeholder="M5Stick IP (e.g. 192.168.1.42)"
              value={wifiIP}
              onChange={(e) => setWifiIP(e.target.value)}
              className="rounded-xl text-center text-sm"
              inputMode="decimal"
              autoComplete="off"
            />
            <Button
              size="lg"
              onClick={() => {
                const ip = wifiIP.trim();
                if (ip && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
                  // Save IP for later use in the Workshop
                  if (typeof localStorage !== "undefined") {
                    localStorage.setItem("tinkerschool-wifi-ip", ip);
                  }
                  onDeviceModeSelected("wifi");
                }
              }}
              disabled={!wifiIP.trim() || !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(wifiIP.trim())}
              className="rounded-xl"
            >
              <Wifi className="size-4" />
              Continue with WiFi
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            You can always change this later in the Workshop.
            The default WiFi password is <span className="font-semibold">tinkerschool</span>.
          </p>
        </div>

        {/* Skip / back options */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => onDeviceModeSelected("simulator")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Skip -- use simulator instead
          </button>
          <button
            onClick={() => setSelectedPath(null)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Back to options
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Path: "What's that?" -- explanation
  // ---------------------------------------------------------------------------

  if (selectedPath === "whats_that") {
    return (
      <div className="flex flex-col gap-5 py-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Meet the M5StickC Plus 2
          </h2>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Monitor className="size-8 text-primary" />
          </div>
          <div className="space-y-3 text-center text-sm text-muted-foreground">
            <p>
              It&apos;s a tiny computer about the size of your thumb! It has a
              color screen, buttons, a speaker, motion sensor, and LED light.
            </p>
            <p>
              {childName || "Your child"} can write code that runs on the
              device -- making it display messages, play sounds, detect motion,
              and more!
            </p>
            <p className="font-medium text-foreground">
              No device? No problem! TinkerSchool includes a built-in simulator
              so you can start learning right away.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            onClick={() => onDeviceModeSelected("simulator")}
            className="rounded-xl"
          >
            <Rocket className="size-4" />
            Continue with Simulator
          </Button>
          <button
            onClick={() => setSelectedPath(null)}
            className="mx-auto text-xs text-muted-foreground hover:text-foreground"
          >
            Back to options
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Default: three path cards
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Connect Your Device
        </h2>
        <p className="text-sm text-muted-foreground">
          Do you have an M5StickC Plus 2?
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Path A: Connect via USB (only on browsers with Web Serial) */}
        {serialSupported && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onClick={() => setSelectedPath("have")}
            className="flex items-center gap-3 rounded-2xl border-2 border-transparent bg-muted/40 p-4 text-left transition-all duration-200 hover:border-primary hover:bg-primary/5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Usb className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Connect via USB
              </p>
              <p className="text-xs text-muted-foreground">
                Plug in your M5Stick with a USB cable
              </p>
            </div>
          </motion.button>
        )}

        {/* Path B: Connect via WiFi (shown on ALL devices, prominent on tablets) */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: serialSupported ? 0.1 : 0.05 }}
          onClick={() => setSelectedPath("have_wifi")}
          className={cn(
            "flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:border-primary hover:bg-primary/5",
            !serialSupported
              ? "border-primary/30 bg-primary/5"
              : "border-transparent bg-muted/40",
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
            <Wifi className="size-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Connect via WiFi
            </p>
            <p className="text-xs text-muted-foreground">
              {!serialSupported
                ? "Best for tablets -- connect wirelessly over your home network"
                : "Connect wirelessly over your home WiFi network"}
            </p>
          </div>
        </motion.button>

        {/* Path C: No device yet */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: serialSupported ? 0.15 : 0.1 }}
          onClick={() => onDeviceModeSelected("simulator")}
          className="flex items-center gap-3 rounded-2xl border-2 border-transparent bg-muted/40 p-4 text-left transition-all duration-200 hover:border-primary hover:bg-primary/5"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <Monitor className="size-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              No device yet
            </p>
            <p className="text-xs text-muted-foreground">
              Use the built-in simulator to start learning
            </p>
          </div>
        </motion.button>

        {/* Path D: What's that? */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: serialSupported ? 0.2 : 0.15 }}
          onClick={() => setSelectedPath("whats_that")}
          className="flex items-center gap-3 rounded-2xl border-2 border-transparent bg-muted/40 p-4 text-left transition-all duration-200 hover:border-primary hover:bg-primary/5"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <HelpCircle className="size-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              What&apos;s that?
            </p>
            <p className="text-xs text-muted-foreground">
              Tell me more about the device
            </p>
          </div>
        </motion.button>
      </div>

      {/* Tablet hint */}
      {!serialSupported && (
        <div className="flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-xs text-muted-foreground">
          <Wifi className="size-4 shrink-0" />
          <span>
            On tablets, connect your M5Stick over WiFi. USB connection requires a desktop with Chrome or Edge.
          </span>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// Step 6: Meet Chip!
// ===========================================================================

interface StepMeetChipProps {
  childName: string;
  avatarId: string;
  onContinue: () => void;
}

function StepMeetChip({ childName, avatarId, onContinue }: StepMeetChipProps) {
  const [showCta, setShowCta] = useState(false);
  const reducedMotion = useReducedMotion();

  // Fire confetti on mount
  useEffect(() => {
    if (!reducedMotion) {
      // Initial burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F97316", "#FACC15", "#22C55E", "#F472B6", "#3B82F6"],
      });

      // Second burst after a short delay
      const timer = setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 90,
          origin: { y: 0.5, x: 0.3 },
          colors: ["#F97316", "#FACC15", "#22C55E"],
        });
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [reducedMotion]);

  // Show CTA after celebration delay
  useEffect(() => {
    const timer = setTimeout(() => setShowCta(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const avatarEmoji = AVATAR_OPTIONS.find((a) => a.id === avatarId)?.emoji ?? "";

  return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      {/* Chip mascot */}
      <motion.div
        initial={{ scale: 0, y: 40, rotate: -10 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 14,
          delay: 0.1,
        }}
        className="relative"
      >
        <Image
          src="/images/chip.png"
          alt="Chip the learning buddy"
          width={120}
          height={120}
          className="rounded-3xl"
          priority
        />
        {/* Child avatar badge */}
        {avatarEmoji && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-full bg-background shadow-md ring-2 ring-primary/20"
          >
            <span className="text-xl">{avatarEmoji}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Greeting text */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-2xl font-bold text-foreground">
          Hi {childName || "there"}!
        </h2>
        <p className="text-lg text-muted-foreground">
          I&apos;m <span className="font-semibold text-primary">Chip</span>,
          your learning buddy!
        </p>
      </motion.div>

      {/* Chip's speech */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        className="max-w-sm rounded-2xl bg-primary/5 px-5 py-3"
      >
        <p className="text-sm leading-relaxed text-foreground">
          We&apos;re going to learn math, reading, science, music, art, and
          coding together! I&apos;ll help you every step of the way. Ready
          for your first adventure?
        </p>
      </motion.div>

      {/* CTA button */}
      <AnimatePresence>
        {showCta && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={reducedMotion ? {} : { scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button
                size="lg"
                onClick={onContinue}
                className="rounded-full px-8"
              >
                <Rocket className="size-4" />
                Start Your First Adventure!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===========================================================================
// Step 7: Heading to Mission Control
// ===========================================================================

interface StepFirstLessonProps {
  childName: string;
  onLaunch: () => void;
}

function StepFirstLesson({ childName, onLaunch }: StepFirstLessonProps) {
  const hasLaunched = useRef(false);

  // Auto-launch after a brief display
  useEffect(() => {
    if (hasLaunched.current) return;
    hasLaunched.current = true;

    const timer = setTimeout(() => {
      onLaunch();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLaunch]);

  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/images/chip.png"
          alt="Chip"
          width={64}
          height={64}
          className="rounded-2xl"
        />
      </motion.div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-foreground">
          Heading to Mission Control...
        </h2>
        <p className="text-sm text-muted-foreground">
          Get ready, {childName || "explorer"}! Let&apos;s explore your dashboard!
        </p>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm">Loading Mission Control...</span>
      </div>

      {/* Manual launch button as fallback */}
      <Button
        variant="outline"
        size="sm"
        onClick={onLaunch}
        className="rounded-xl"
      >
        Go now
        <ArrowRight className="size-3" />
      </Button>
    </div>
  );
}
