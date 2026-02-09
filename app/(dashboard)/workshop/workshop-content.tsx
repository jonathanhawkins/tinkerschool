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
import { Blocks, CheckCircle, Eye, Info, Monitor, PartyPopper, Play, Save, X, Sparkles } from "lucide-react";

import { useWorkshopBanners } from "@/hooks/use-workshop-banners";

import {
  BadgeCelebration,
  type EarnedBadge,
} from "@/components/badge-celebration";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { wrapM5StickCode } from "@/lib/codegen/wrap-m5stick";
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

interface LessonData {
  id: string;
  title: string;
  storyText: string | null;
  starterBlocksXml: string | null;
}

interface WorkshopContentProps {
  lesson: LessonData | null;
  /** Pre-rendered server component for the AI chat panel */
  chatPanel: ReactNode;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" as const },
};

const storyCardVariants = {
  initial: { opacity: 0, scale: 0.97, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -8 },
  transition: { duration: 0.25, ease: "easeOut" as const },
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
// Simulator encouragement banner (dismissible)
// ---------------------------------------------------------------------------

const simulatorBannerVariants = {
  initial: { opacity: 0, scale: 0.97, y: -8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -8 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

function SimulatorBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div {...simulatorBannerVariants}>
      <Card className="relative overflow-hidden rounded-2xl border-2 border-emerald-300/50 bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
            <Monitor className="size-5 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-emerald-800">
              No device connected? No worries!
            </p>
            <p className="mt-0.5 text-base leading-relaxed text-emerald-700/80">
              Click <Play className="mb-0.5 inline size-3.5" /> <strong>Run</strong> to
              try your code in the simulator. You can test most lessons without
              plugging in your M5Stick!
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="shrink-0 rounded-full text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800"
            aria-label="Dismiss simulator tip"
          >
            <X className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Lesson story card
// ---------------------------------------------------------------------------

function LessonStoryCard({
  title,
  storyText,
  onDismiss,
}: {
  title: string;
  storyText: string;
  onDismiss: () => void;
}) {
  return (
    <motion.div {...storyCardVariants}>
      <Card className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="size-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-base leading-relaxed text-muted-foreground">
              {storyText}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="shrink-0 rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Dismiss lesson story"
          >
            <X className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// WorkshopContent -- main orchestrator component
// ---------------------------------------------------------------------------

export function WorkshopContent({ lesson, chatPanel }: WorkshopContentProps) {
  // ---- State ---------------------------------------------------------------
  const [code, setCode] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);

  // Persisted banner dismissal (survives page reloads / sessions)
  const {
    storyDismissed,
    simBannerDismissed,
    dismissStory,
    dismissSimBanner,
    resetBanners,
  } = useWorkshopBanners();

  // Derive visible state: story shows only if there is story text AND the user
  // has not previously dismissed it.
  const showStory = !!lesson?.storyText && !storyDismissed;
  const showSimBanner = !simBannerDismissed;
  // Show the "Show tips" affordance when at least one banner has been dismissed
  const canShowTips = storyDismissed || simBannerDismissed;

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
  }, []);

  const handleDismissStory = useCallback(() => {
    dismissStory();
  }, [dismissStory]);

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

  const handleCompleteLesson = useCallback(() => {
    if (!lesson) return;

    startTransition(async () => {
      const result = await updateProgress(lesson.id, "completed");
      if (result.success) {
        setLessonCompleted(true);
        if (result.newBadges && result.newBadges.length > 0) {
          setEarnedBadges(result.newBadges);
        }
      }
    });
  }, [lesson]);

  // ---- Render --------------------------------------------------------------

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-[calc(100vh-6rem)] flex-col gap-3 md:h-[calc(100vh-7rem)] lg:h-[calc(100vh-4rem)]"
    >
      <Tabs defaultValue="blocks" className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">
          {lesson ? lesson.title : "Workshop"}
        </h1>

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
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleCompleteLesson}
                disabled={isPending}
                variant="outline"
                className="gap-1.5 rounded-xl border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                <CheckCircle className="size-4" />
                Complete Lesson
              </Button>
            </motion.div>
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

      {/* Lesson story (dismissible) */}
      <AnimatePresence>
        {showStory && lesson?.storyText && (
          <LessonStoryCard
            title={lesson.title}
            storyText={lesson.storyText}
            onDismiss={handleDismissStory}
          />
        )}
      </AnimatePresence>

      {/* Simulator encouragement banner (dismissible) */}
      <AnimatePresence>
        {showSimBanner && (
          <SimulatorBanner onDismiss={handleDismissSimBanner} />
        )}
      </AnimatePresence>

      {/* Main 2-column grid -- fits in one viewport */}
      <div
        className={cn(
          "grid min-h-0 flex-1 gap-3",
          // Desktop: 2 columns (editor+chat | sim+device)
          "lg:grid-cols-[1fr_340px]",
          // Mobile/tablet: single column stack
          "grid-cols-1",
        )}
      >
        {/* ---- Left column: Editor + Chat stacked ---- */}
        <motion.div
          {...fadeInUp}
          className="flex min-h-0 flex-col gap-3"
        >
          {/* Editor -- takes remaining space */}
          <div className="flex min-h-0 flex-1 flex-col">
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

          {/* Chat -- fixed height below editor */}
          <div className="h-[200px] shrink-0 lg:h-[180px]">
            {chatPanel}
          </div>
        </motion.div>

        {/* ---- Right column: Simulator + Device ---- */}
        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.05 }}
          className="flex flex-col gap-3 overflow-y-auto"
        >
          <SimulatorPanel code={wrappedCode} />
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
