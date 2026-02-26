"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import { getTracePath } from "@/lib/activities/trace-paths";
import type { TraceShapeContent } from "@/lib/activities/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Hit zone radius in SVG units — generous for small fingers */
const HIT_RADIUS = 30;

/** SVG viewBox dimensions — all paths are drawn within this coordinate space */
const VIEW_SIZE = 200;

/** Default trace color (TinkerOrange) when not specified */
const DEFAULT_TRACE_COLOR = "#F97316";

/** Guide path stroke color when not specified */
const DEFAULT_GUIDE_COLOR = "#CBD5E1"; // slate-300

// ---------------------------------------------------------------------------
// TraceShape widget
// ---------------------------------------------------------------------------

export function TraceShape() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const prefersReducedMotion = useReducedMotion();
  const activity = currentActivity as TraceShapeContent;
  const question = activity.questions[state.currentQuestionIndex];

  const traceData = useMemo(
    () => (question ? getTracePath(question.shape) : undefined),
    [question],
  );

  // Track which checkpoints have been hit
  const [hitCheckpoints, setHitCheckpoints] = useState<Set<number>>(new Set());
  const [isTracing, setIsTracing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const guideColor = question?.strokeColor ?? subjectColor ?? DEFAULT_GUIDE_COLOR;
  const traceColor = question?.traceColor ?? DEFAULT_TRACE_COLOR;

  const totalCheckpoints = traceData?.checkpoints.length ?? 0;
  const hitCount = hitCheckpoints.size;
  const progress = totalCheckpoints > 0 ? hitCount / totalCheckpoints : 0;

  // ---------------------------------------------------------------------------
  // Pointer -> SVG coordinate conversion
  // ---------------------------------------------------------------------------

  const pointerToSVG = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const svg = svgRef.current;
      if (!svg) return null;

      const rect = svg.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * VIEW_SIZE;
      const y = ((clientY - rect.top) / rect.height) * VIEW_SIZE;
      return { x, y };
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Checkpoint hit detection
  // ---------------------------------------------------------------------------

  const checkHits = useCallback(
    (svgX: number, svgY: number) => {
      if (!traceData || isComplete) return;

      let newHits = false;
      const updated = new Set(hitCheckpoints);

      for (let i = 0; i < traceData.checkpoints.length; i++) {
        if (updated.has(i)) continue;

        const cp = traceData.checkpoints[i];
        const dx = svgX - cp.x;
        const dy = svgY - cp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= HIT_RADIUS) {
          updated.add(i);
          newHits = true;
        }
      }

      if (newHits) {
        setHitCheckpoints(updated);
        play("tap");

        // Check completion
        if (updated.size >= traceData.checkpoints.length) {
          setIsComplete(true);
          setShowCelebration(true);
          play("correct");

          // Auto-advance after celebration
          setTimeout(() => {
            recordAnswer(question?.shape ?? "", true);
          }, 1500);
        }
      }
    },
    [traceData, hitCheckpoints, isComplete, play, recordAnswer, question],
  );

  // ---------------------------------------------------------------------------
  // Pointer event handlers
  // ---------------------------------------------------------------------------

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isComplete) return;
      e.preventDefault();
      setIsTracing(true);

      // Capture pointer so moves outside the SVG still register
      (e.target as Element).setPointerCapture?.(e.pointerId);

      const pt = pointerToSVG(e.clientX, e.clientY);
      if (pt) checkHits(pt.x, pt.y);
    },
    [isComplete, pointerToSVG, checkHits],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isTracing || isComplete) return;
      e.preventDefault();

      const pt = pointerToSVG(e.clientX, e.clientY);
      if (pt) checkHits(pt.x, pt.y);
    },
    [isTracing, isComplete, pointerToSVG, checkHits],
  );

  const handlePointerUp = useCallback(() => {
    setIsTracing(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Retry
  // ---------------------------------------------------------------------------

  const handleRetry = useCallback(() => {
    setHitCheckpoints(new Set());
    setIsComplete(false);
    setShowCelebration(false);
    setIsTracing(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Bail early if no data
  // ---------------------------------------------------------------------------

  if (!question || !traceData) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Shape data not found for &ldquo;{question?.shape}&rdquo;
      </p>
    );
  }

  // ---------------------------------------------------------------------------
  // Build the filled (traced) path segments for visual feedback
  // ---------------------------------------------------------------------------

  // We use stroke-dasharray / stroke-dashoffset to reveal the traced portion.
  // But for a simpler and more forgiving approach, we render individual circles
  // at each checkpoint, colored to show hit/unhit state.

  return (
    <motion.div
      className="space-y-5"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Prompt */}
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {question.prompt}
        </h3>
        <p className="text-sm text-muted-foreground">
          Follow the dots with your finger!
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mx-auto flex max-w-xs items-center gap-2">
        <div
          className="h-2.5 flex-1 overflow-hidden rounded-full"
          style={{ backgroundColor: `${guideColor}30` }}
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Tracing progress: ${Math.round(progress * 100)}%`}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: traceColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
        <span
          className="text-xs font-medium tabular-nums"
          style={{ color: traceColor }}
        >
          {hitCount}/{totalCheckpoints}
        </span>
      </div>

      {/* Tracing area */}
      <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
        <div
          className={cn(
            "relative aspect-square w-full overflow-hidden rounded-2xl border-2 bg-muted/20",
            isTracing && "border-primary/50",
          )}
          style={{
            borderColor: isTracing ? traceColor : undefined,
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
            className="size-full cursor-crosshair"
            style={{ touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-label={`Trace the shape: ${question.shape}`}
            role="img"
          >
            {/* Guide path — dashed stroke */}
            <path
              d={traceData.path}
              fill="none"
              stroke={guideColor}
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 12"
              opacity={0.5}
            />

            {/* Traced path — solid stroke, revealed as checkpoints hit */}
            {isComplete && (
              <motion.path
                d={traceData.path}
                fill="none"
                stroke={traceColor}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={prefersReducedMotion ? {} : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}

            {/* Checkpoint dots */}
            {traceData.checkpoints.map((cp, i) => {
              const isHit = hitCheckpoints.has(i);
              return (
                <circle
                  key={i}
                  cx={cp.x}
                  cy={cp.y}
                  r={isHit ? 6 : 5}
                  fill={isHit ? traceColor : `${guideColor}60`}
                  stroke={isHit ? traceColor : "none"}
                  strokeWidth={isHit ? 2 : 0}
                  opacity={isHit ? 1 : 0.6}
                  data-testid={`checkpoint-${i}`}
                  data-hit={isHit ? "true" : "false"}
                />
              );
            })}

            {/* Start indicator — pulsing dot */}
            {!isComplete && hitCount === 0 && (
              <>
                <circle
                  cx={traceData.startPoint.x}
                  cy={traceData.startPoint.y}
                  r={12}
                  fill={traceColor}
                  opacity={0.3}
                  data-testid="start-pulse"
                >
                  {!prefersReducedMotion && (
                    <animate
                      attributeName="r"
                      values="12;18;12"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  )}
                  {!prefersReducedMotion && (
                    <animate
                      attributeName="opacity"
                      values="0.3;0.1;0.3"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
                <circle
                  cx={traceData.startPoint.x}
                  cy={traceData.startPoint.y}
                  r={8}
                  fill={traceColor}
                  data-testid="start-dot"
                />
              </>
            )}
          </svg>

          {/* Celebration overlay */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                data-testid="celebration"
              >
                {/* Star burst */}
                {!prefersReducedMotion &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1.5],
                        opacity: [1, 0],
                        x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 15)],
                        y: [0, (i < 3 ? -1 : 1) * (20 + i * 10)],
                      }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.08,
                        ease: "easeOut",
                      }}
                    >
                      <Sparkles
                        className="size-6"
                        style={{ color: traceColor }}
                      />
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Retry button */}
      {!isComplete && hitCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl"
            onClick={handleRetry}
          >
            <RotateCcw className="size-4" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
