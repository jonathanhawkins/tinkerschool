"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Blocks, BookOpen, CheckCircle, ChevronDown, Eye, Info, Lightbulb, PartyPopper, Save, Target, Sparkles } from "lucide-react";

import { useWorkshopBanners } from "@/hooks/use-workshop-banners";

import {
  BadgeCelebration,
  type EarnedBadge,
} from "@/components/badge-celebration";
import { BlocklyTutorial } from "@/components/blockly-tutorial";
import { WorkshopHints, useWorkshopActivity } from "@/components/workshop-hints";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { WorkshopWelcome, type WelcomeData } from "@/components/workshop-welcome";
import { wrapM5StickCode } from "@/lib/codegen/wrap-m5stick";
import type { SimulatorOutput } from "@/lib/simulator/types";
import {
  parseExpectedOutput,
  usesBuzzer,
  validateLessonOutput,
} from "@/lib/lessons/validate-output";
import { saveProject, updateProgress } from "./actions";
import type { BlocklyEditorHandle } from "./blockly-editor";

// ---------------------------------------------------------------------------
// Dynamic imports -- browser-only components loaded on demand
// ---------------------------------------------------------------------------

const BlocklyEditor = dynamic(() => import("./blockly-editor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

const SimulatorPanel = dynamic(() => import("./simulator-panel"), {
  ssr: false,
  loading: () => <Skeleton className="h-[360px] rounded-2xl" />,
});

const DevicePanel = dynamic(() => import("./device-panel"), {
  ssr: false,
  loading: () => <Skeleton className="h-[200px] rounded-2xl" />,
});

const PythonEditor = dynamic(() => import("./python-editor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] overflow-hidden rounded-2xl border-2 border-primary/20 bg-[#1e1e2e] shadow-md">
      {/* macOS dots header -- matches the editor chrome while loading */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-red-400/70" />
          <span className="size-3 rounded-full bg-yellow-400/70" />
          <span className="size-3 rounded-full bg-green-400/70" />
        </div>
        <span className="ml-2 text-xs font-medium text-white/50">
          generated-code.py
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-3/4 rounded bg-white/10" />
        <Skeleton className="h-4 w-1/2 rounded bg-white/10" />
        <Skeleton className="h-4 w-2/3 rounded bg-white/10" />
      </div>
    </div>
  ),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LessonHintData {
  order: number;
  text: string;
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  storyText: string | null;
  starterBlocksXml: string | null;
  solutionCode: string | null;
  hints: LessonHintData[];
}

interface WorkshopContentProps {
  lesson: LessonData | null;
  /** Pre-rendered server component for the AI chat panel */
  chatPanel: ReactNode;
  /** Welcome screen data when no lesson is loaded */
  welcomeData?: WelcomeData | null;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" as const },
};

// ---------------------------------------------------------------------------
// Editor loading skeleton
// ---------------------------------------------------------------------------

function EditorSkeleton() {
  return (
    <div className="flex min-h-[200px] flex-col gap-3">
      <Skeleton className="h-9 w-52 rounded-lg" />
      <Skeleton className="flex-1 rounded-2xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Save feedback banner
// ---------------------------------------------------------------------------

type SaveStatus = "idle" | "saving" | "saved" | "error";

function SaveBanner({ status }: { status: SaveStatus }) {
  return (
    <AnimatePresence>
      {status === "saved" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="rounded-lg bg-emerald-100 px-3 py-1.5 text-base font-medium text-emerald-700"
        >
          Project saved!
        </motion.div>
      )}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="rounded-lg bg-destructive/10 px-3 py-1.5 text-base font-medium text-destructive"
        >
          Could not save. Try again!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Python code preview -- wraps the Monaco-based PythonEditor
// ---------------------------------------------------------------------------

function PythonPreview({
  code,
  readOnly = true,
  onCodeChange,
}: {
  code: string;
  readOnly?: boolean;
  onCodeChange?: (code: string) => void;
}) {
  return (
    <PythonEditor
      code={code}
      readOnly={readOnly}
      onCodeChange={onCodeChange}
    />
  );
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Lesson Goal Panel -- starts collapsed so Blockly editor is visible
// ---------------------------------------------------------------------------

function LessonGoalPanel({
  description,
  solutionCode,
  hints,
}: {
  description: string;
  solutionCode: string | null;
  hints: LessonHintData[];
}) {
  // Start expanded when the lesson has step-by-step hints so the child
  // immediately sees what to do instead of staring at an empty workspace.
  const hasSteps = hints.length > 0;
  const [expanded, setExpanded] = useState(hasSteps);
  const [hintsExpanded, setHintsExpanded] = useState(hasSteps);

  const expectedTexts = solutionCode ? parseExpectedOutput(solutionCode) : [];
  const hasBuzzer = solutionCode ? usesBuzzer(solutionCode) : false;
  const sortedHints = [...hints].sort((a, b) => a.order - b.order);

  return (
    <Card className="rounded-2xl border-2 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
      {/* Header -- always visible, toggles expand */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Target className="size-3.5 text-primary" />
        </div>
        <span className="flex-1 text-xs font-bold text-foreground">
          Your Goal
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <CardContent className="space-y-3 px-4 pb-4 pt-0">
              {/* Description */}
              <p className="text-sm leading-relaxed text-foreground/80">
                {description}
              </p>

              {/* Expected output preview */}
              {expectedTexts.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Expected Screen
                  </p>
                  <div className="rounded-xl bg-black/90 px-3 py-2">
                    {expectedTexts.map((text, i) => (
                      <p
                        key={i}
                        className="font-mono text-xs leading-relaxed text-emerald-400"
                      >
                        {text}
                      </p>
                    ))}
                    {hasBuzzer && (
                      <p className="mt-1 font-mono text-xs text-amber-400/70">
                        + sound effects
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Hints (collapsible) */}
              {sortedHints.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHintsExpanded((v) => !v);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700"
                  >
                    <Lightbulb className="size-3.5" />
                    {hintsExpanded ? "Hide" : "Show"} Steps ({sortedHints.length})
                    <ChevronDown
                      className={cn(
                        "size-3 transition-transform duration-200",
                        hintsExpanded && "rotate-180",
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {hintsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <ol className="mt-2 space-y-2">
                          {sortedHints.map((hint) => (
                            <li
                              key={hint.order}
                              className="flex gap-2 text-xs leading-relaxed"
                            >
                              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                                {hint.order}
                              </span>
                              <span className="text-foreground/80">
                                {hint.text}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// WorkshopContent -- main orchestrator component
// ---------------------------------------------------------------------------

export function WorkshopContent({ lesson, chatPanel, welcomeData }: WorkshopContentProps) {
  // ---- State ---------------------------------------------------------------
  const [showWelcome, setShowWelcome] = useState(!lesson && !!welcomeData);
  const [code, setCode] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);

  // Lesson validation state
  const [lastSimOutput, setLastSimOutput] = useState<SimulatorOutput | null>(null);
  const [validationFeedback, setValidationFeedback] = useState<string | null>(null);

  // Persisted banner dismissal (survives page reloads / sessions)
  const {
    simBannerDismissed,
    dismissSimBanner,
    resetBanners,
  } = useWorkshopBanners();

  const showSimBanner = !simBannerDismissed;
  // Show the "Show tips" affordance when the sim banner has been dismissed
  const canShowTips = simBannerDismissed;

  // Workshop activity tracking for contextual hints
  const {
    hasBlocks: activityHasBlocks,
    hasRunSim: activityHasRunSim,
    recordBlockChange,
    recordSimRun,
  } = useWorkshopActivity();

  const editorRef = useRef<BlocklyEditorHandle>(null);

  // Mark the lesson as in-progress on mount (moved out of server render)
  useEffect(() => {
    if (lesson?.id) {
      updateProgress(lesson.id, "in_progress");
    }
  }, [lesson?.id]);

  // Derive wrapped code for simulator and device
  const wrappedCode = useMemo(() => wrapM5StickCode(code), [code]);

  // ---- Callbacks -----------------------------------------------------------

  const handleCodeChange = useCallback((python: string) => {
    setCode(python);
    // Track whether blocks exist (non-empty code means blocks present)
    recordBlockChange(python.trim().length > 0 ? 1 : 0);
  }, [recordBlockChange]);

  const handleDismissSimBanner = useCallback(() => {
    dismissSimBanner();
  }, [dismissSimBanner]);

  const handleSave = useCallback(() => {
    const blocksXml = editorRef.current?.getWorkspaceXml() ?? "";

    setSaveStatus("saving");

    startTransition(async () => {
      const formData = new FormData();
      formData.set("title", lesson?.title ?? "My Project");
      formData.set("blocks_xml", blocksXml);
      formData.set("python_code", code);
      if (lesson?.id) {
        formData.set("lesson_id", lesson.id);
      }

      const result = await saveProject(formData);

      if (result.success) {
        setSaveStatus("saved");
        // Auto-clear the saved banner after a moment
        setTimeout(() => setSaveStatus("idle"), 2500);
        // Show badge celebration if new badges were earned
        if (result.newBadges && result.newBadges.length > 0) {
          setEarnedBadges(result.newBadges);
        }
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    });
  }, [code, lesson]);

  const handleSimRunComplete = useCallback((output: SimulatorOutput) => {
    setLastSimOutput(output);
    setValidationFeedback(null); // Clear previous feedback on new run
    recordSimRun();
  }, [recordSimRun]);

  const handleCompleteLesson = useCallback(() => {
    if (!lesson) return;

    // Require at least one simulator run
    if (!lastSimOutput) {
      setValidationFeedback("Run your code in the simulator first!");
      return;
    }

    // Validate output if the lesson has solution code
    if (lesson.solutionCode) {
      const result = validateLessonOutput(lastSimOutput, lesson.solutionCode);
      if (!result.passed) {
        setValidationFeedback(result.feedback);
        return;
      }
    }

    // Validation passed — complete the lesson
    setValidationFeedback(null);
    startTransition(async () => {
      const result = await updateProgress(lesson.id, "completed");
      if (result.success) {
        setLessonCompleted(true);
        if (result.newBadges && result.newBadges.length > 0) {
          setEarnedBadges(result.newBadges);
        }
      }
    });
  }, [lesson, lastSimOutput]);

  // Build lesson hint context for the contextual hints system
  const lessonHintContext = useMemo(() => {
    if (!lesson) return null;
    return {
      lessonTitle: lesson.title,
      hints: lesson.hints,
      hasStarterBlocks: Boolean(lesson.starterBlocksXml),
      description: lesson.description,
    };
  }, [lesson]);

  // ---- Render --------------------------------------------------------------

  // Welcome screen when no lesson is loaded
  if (showWelcome && welcomeData) {
    return (
      <WorkshopWelcome
        data={welcomeData}
        onFreePlay={() => setShowWelcome(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-[calc(100vh-6rem)] flex-col gap-3 md:h-[calc(100vh-7rem)] lg:h-[calc(100vh-4rem)]"
    >
      {/* Blockly Tutorial overlay for first-time users */}
      <BlocklyTutorial />

      <Tabs defaultValue="blocks" className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">
          {lesson ? lesson.title : "Workshop"}
        </h1>

        {/* Lesson Info sheet trigger */}
        {lesson && lesson.storyText && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/5"
              >
                <BookOpen className="size-4" />
                <span className="hidden sm:inline">Lesson Info</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{lesson.title}</SheetTitle>
              </SheetHeader>
              <div className="space-y-5 px-1 pt-4">
                {/* Description */}
                <div>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {lesson.description}
                  </p>
                </div>

                {/* Story */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold">The Story</h3>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                    {lesson.storyText}
                  </p>
                </div>

                {/* Hints */}
                {lesson.hints.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="size-4 text-amber-500" />
                      <h3 className="text-sm font-semibold">Hints</h3>
                    </div>
                    <ol className="space-y-2">
                      {[...lesson.hints]
                        .sort((a, b) => a.order - b.order)
                        .map((hint) => (
                          <li
                            key={hint.order}
                            className="flex gap-2.5 rounded-xl bg-muted/40 p-3 text-sm"
                          >
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                              {hint.order}
                            </span>
                            <span className="leading-relaxed text-foreground/80">
                              {hint.text}
                            </span>
                          </li>
                        ))}
                    </ol>
                  </div>
                )}

                {/* Expected output */}
                {lesson.solutionCode && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="size-4 text-primary" />
                      <h3 className="text-sm font-semibold">Expected Output</h3>
                    </div>
                    <div className="rounded-xl bg-black/90 px-3 py-2.5">
                      {parseExpectedOutput(lesson.solutionCode).map(
                        (text, i) => (
                          <p
                            key={i}
                            className="font-mono text-xs leading-relaxed text-emerald-400"
                          >
                            {text}
                          </p>
                        ),
                      )}
                      {usesBuzzer(lesson.solutionCode) && (
                        <p className="mt-1 font-mono text-xs text-amber-400/70">
                          + sound effects
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}

        <TabsList className="w-fit">
          <TabsTrigger value="blocks" className="gap-1.5">
            <Blocks className="size-4" />
            Blocks
          </TabsTrigger>
          <TabsTrigger value="python" className="gap-1.5">
            <Eye className="size-4" />
            Peek at Python
          </TabsTrigger>
        </TabsList>

        <div className="ml-auto flex items-center gap-2">
          <SaveBanner status={saveStatus} />

          {/* Re-show dismissed banners */}
          {canShowTips && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetBanners}
              className="gap-1.5 rounded-xl text-muted-foreground hover:text-foreground"
              aria-label="Show lesson tips again"
            >
              <Info className="size-4" />
              <span className="hidden sm:inline">Show Tips</span>
            </Button>
          )}

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSave}
              disabled={isPending || saveStatus === "saving"}
              className="gap-1.5 rounded-xl"
            >
              <Save className="size-4" />
              {saveStatus === "saving" ? "Saving..." : "Save Project"}
            </Button>
          </motion.div>
          {lesson && !lessonCompleted && (
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleCompleteLesson}
                  disabled={isPending}
                  variant="outline"
                  className={cn(
                    "gap-1.5 rounded-xl",
                    lastSimOutput
                      ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                      : "border-muted-foreground/30 text-muted-foreground",
                  )}
                >
                  <CheckCircle className="size-4" />
                  Complete Lesson
                </Button>
              </motion.div>
              {validationFeedback && (
                <motion.p
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-medium text-amber-600"
                >
                  {validationFeedback}
                </motion.p>
              )}
              {!lastSimOutput && !validationFeedback && (
                <p className="text-xs text-muted-foreground">
                  Run your code first!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lesson completion celebration */}
      <AnimatePresence>
        {lessonCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className="overflow-hidden rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                  <PartyPopper className="size-5 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-emerald-800">
                    You did it! Lesson complete!
                  </p>
                  <p className="mt-0.5 text-sm text-emerald-600">
                    Great job finishing {lesson?.title}.
                  </p>
                </div>
                <Button
                  asChild
                  className="shrink-0 gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link href="/home">Next Lesson</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 2-column grid -- fills the viewport immediately */}
      <div
        className={cn(
          "grid min-h-0 flex-1 gap-2",
          // Desktop: 2 columns (editor+chat | sim+device)
          "lg:grid-cols-[1fr_300px]",
          // Mobile/tablet: single column stack
          "grid-cols-1",
        )}
      >
        {/* ---- Left column: Editor + Chat stacked ---- */}
        <motion.div
          {...fadeInUp}
          className="flex min-h-0 flex-col gap-2"
        >
          {/* Editor -- takes remaining space, with floating hints overlay */}
          <div className="relative flex min-h-0 flex-1 flex-col">
            <TabsContent value="blocks" forceMount className="min-h-0 flex-1 data-[state=inactive]:hidden">
              <BlocklyEditor
                ref={editorRef}
                onCodeChange={handleCodeChange}
                initialXml={lesson?.starterBlocksXml ?? undefined}
              />
            </TabsContent>

            <TabsContent value="python" className="min-h-0 flex-1">
              <PythonPreview code={code} />
            </TabsContent>

          </div>

          {/* Contextual workshop hints -- compact bar below editor */}
          {lesson && (
            <div className="shrink-0">
              <WorkshopHints
                lessonContext={lessonHintContext}
                hasBlocks={activityHasBlocks}
                hasRunSim={activityHasRunSim}
              />
            </div>
          )}

          {/* Chat -- fixed height below editor */}
          <div className="h-[160px] shrink-0 lg:h-[140px]">
            {chatPanel}
          </div>
        </motion.div>

        {/* ---- Right column: Goal + Sim tip + Simulator + Device ---- */}
        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.05 }}
          className="flex flex-col gap-2 overflow-y-auto"
        >
          {/* Goal panel -- starts collapsed so simulator is visible */}
          {lesson && lesson.description && (
            <LessonGoalPanel
              description={lesson.description}
              solutionCode={lesson.solutionCode}
              hints={lesson.hints}
            />
          )}

          <SimulatorPanel
            code={wrappedCode}
            onRunComplete={handleSimRunComplete}
            showNoDeviceTip={showSimBanner}
            onDismissNoDeviceTip={handleDismissSimBanner}
          />
          <DevicePanel code={wrappedCode} />
        </motion.div>
      </div>
      </Tabs>

      {/* Badge celebration toast */}
      {earnedBadges.length > 0 && (
        <BadgeCelebration
          badges={earnedBadges}
          onDismiss={() => setEarnedBadges([])}
        />
      )}
    </motion.div>
  );
}
