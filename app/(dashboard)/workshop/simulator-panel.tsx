"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Simulator, type SimulatorHandle } from "@/components/simulator";
import { SimulatorCodeRunner } from "@/lib/simulator/code-runner";
import {
  BadgeCelebration,
  type EarnedBadge,
} from "@/components/badge-celebration";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { recordDeviceFlash } from "./actions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SimStatus = "ready" | "running" | "stopped" | "error";

interface SimulatorPanelProps {
  /** MicroPython code to simulate when "Run" is clicked */
  code: string;
  /** Additional CSS class for the card wrapper */
  className?: string;
}

// ---------------------------------------------------------------------------
// Status badge config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  SimStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  ready: { label: "Ready", variant: "outline" },
  running: { label: "Running...", variant: "default" },
  stopped: { label: "Stopped", variant: "secondary" },
  error: { label: "Error", variant: "destructive" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * SimulatorPanel -- the workshop sidebar panel that wraps the device
 * simulator in a Card with Run / Stop / Clear controls.
 *
 * Accepts a `code` prop containing MicroPython source. When "Run" is
 * clicked the code is parsed and executed on the simulator canvas.
 */
export default function SimulatorPanel({
  code,
  className,
}: SimulatorPanelProps) {
  const simulatorRef = useRef<SimulatorHandle>(null);
  const runnerRef = useRef<SimulatorCodeRunner | null>(null);

  const [status, setStatus] = useState<SimStatus>("ready");
  const [toneActive, setToneActive] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);

  // -------------------------------------------------------------------------
  // Create code runner once simulator is ready
  // -------------------------------------------------------------------------
  const ensureRunner = useCallback((): SimulatorCodeRunner | null => {
    const sim = simulatorRef.current?.getSimulator();
    if (!sim) return null;

    if (!runnerRef.current) {
      const runner = new SimulatorCodeRunner(sim);
      runner.onTone = (_freq, durationMs) => {
        setToneActive(true);
        setTimeout(() => setToneActive(false), Math.min(durationMs, 1000));
      };
      runnerRef.current = runner;
    }

    return runnerRef.current;
  }, []);

  // -------------------------------------------------------------------------
  // Run code
  // -------------------------------------------------------------------------
  const handleRun = useCallback(async () => {
    const runner = ensureRunner();
    if (!runner) return;

    // Stop any previous run
    if (runner.isRunning) {
      runner.stop();
    }

    setStatus("running");

    try {
      await runner.run(code);
      // Only set "ready" if it finished naturally (not stopped)
      setStatus((prev) => (prev === "running" ? "ready" : prev));

      // Record the simulator run server-side for badge tracking
      try {
        const flashResult = await recordDeviceFlash("simulator");
        if (flashResult.newBadges && flashResult.newBadges.length > 0) {
          setEarnedBadges(flashResult.newBadges);
        }
      } catch (err) {
        console.error("[simulator-panel] Failed to record flash:", err);
      }
    } catch {
      setStatus("error");
    }
  }, [code, ensureRunner]);

  // -------------------------------------------------------------------------
  // Stop code
  // -------------------------------------------------------------------------
  const handleStop = useCallback(() => {
    const runner = runnerRef.current;
    if (runner?.isRunning) {
      runner.stop();
    }
    setStatus("stopped");
  }, []);

  // -------------------------------------------------------------------------
  // Clear display
  // -------------------------------------------------------------------------
  const handleClear = useCallback(() => {
    const runner = runnerRef.current;
    if (runner?.isRunning) {
      runner.stop();
    }
    simulatorRef.current?.clear();
    setStatus("ready");
  }, []);

  // -------------------------------------------------------------------------
  // Cleanup on unmount
  // -------------------------------------------------------------------------
  useEffect(() => {
    return () => {
      runnerRef.current?.stop();
    };
  }, []);

  // -------------------------------------------------------------------------
  // Status badge
  // -------------------------------------------------------------------------
  const statusCfg = STATUS_CONFIG[status];

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <Card className={cn("rounded-2xl", className)}>
      <CardHeader className="flex-row items-center justify-between px-4 py-3">
        <CardTitle className="text-sm font-bold">Simulator</CardTitle>
        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-2 px-4 pb-3">
        {/* Device simulator */}
        <Simulator
          ref={simulatorRef}
          scale={1}
          toneActive={toneActive}
        />

        {/* Controls */}
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            size="sm"
            onClick={handleRun}
            disabled={status === "running"}
            className="gap-1.5"
          >
            <PlayIcon />
            Run
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleStop}
            disabled={status !== "running"}
            className="gap-1.5"
          >
            <StopIcon />
            Stop
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleClear}
            className="gap-1.5"
          >
            <ClearIcon />
            Clear
          </Button>
        </div>
      </CardContent>

      {/* Badge celebration toast */}
      {earnedBadges.length > 0 && (
        <BadgeCelebration
          badges={earnedBadges}
          onDismiss={() => setEarnedBadges([])}
        />
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Inline SVG icons (tiny, no external dependency needed)
// ---------------------------------------------------------------------------

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="size-3.5"
      aria-hidden="true"
    >
      <path d="M3 2.5a.75.75 0 0 1 1.145-.638l9 5.5a.75.75 0 0 1 0 1.276l-9 5.5A.75.75 0 0 1 3 13.5v-11Z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="size-3.5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="10" height="10" rx="1" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="size-3.5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 0 0-1.5 0v4.69L5.78 7.97a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 1 0-1.06-1.06l-1.47 1.47V4.75Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
