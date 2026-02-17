"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Monitor, Play, Square, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { Simulator, type SimulatorHandle } from "@/components/simulator";
import { SimulatorCodeRunner } from "@/lib/simulator/code-runner";
import type { SimulatorOutput } from "@/lib/simulator/types";
import { BuzzerAudio } from "@/lib/simulator/buzzer-audio";
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
  /** Called after a successful run with the output snapshot for lesson validation */
  onRunComplete?: (output: SimulatorOutput) => void;
  /** Show the "no device" tip inside the simulator card */
  showNoDeviceTip?: boolean;
  /** Called when the user dismisses the no-device tip */
  onDismissNoDeviceTip?: () => void;
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
  onRunComplete,
  showNoDeviceTip,
  onDismissNoDeviceTip,
}: SimulatorPanelProps) {
  const simulatorRef = useRef<SimulatorHandle>(null);
  const runnerRef = useRef<SimulatorCodeRunner | null>(null);
  const buzzerRef = useRef<BuzzerAudio | null>(null);

  const [status, setStatus] = useState<SimStatus>("ready");
  const [toneActive, setToneActive] = useState(false);
  const [ledBrightness, setLedBrightness] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [printOutput, setPrintOutput] = useState<string[]>([]);

  // -------------------------------------------------------------------------
  // Initialize buzzer audio (once, lazily)
  // -------------------------------------------------------------------------
  const ensureBuzzer = useCallback((): BuzzerAudio => {
    if (!buzzerRef.current) {
      const buzzer = new BuzzerAudio();
      buzzerRef.current = buzzer;
      // Sync initial mute state from localStorage
      setAudioMuted(buzzer.muted);
    }
    return buzzerRef.current;
  }, []);

  // -------------------------------------------------------------------------
  // Create code runner once simulator is ready
  // -------------------------------------------------------------------------
  const ensureRunner = useCallback((): SimulatorCodeRunner | null => {
    const sim = simulatorRef.current?.getSimulator();
    if (!sim) return null;

    if (!runnerRef.current) {
      const runner = new SimulatorCodeRunner(sim);
      runner.onTone = (freq, durationMs) => {
        // Visual LED indicator
        setToneActive(true);
        setTimeout(() => setToneActive(false), Math.min(durationMs, 1000));
        // Audio output
        const buzzer = ensureBuzzer();
        buzzer.playTone(freq, durationMs);
      };
      runner.onLed = (brightness) => {
        setLedBrightness(brightness);
      };
      runner.onPrint = (text) => {
        setPrintOutput((prev) => {
          const next = [...prev, text];
          // Cap at 50 lines to prevent memory issues
          return next.length > 50 ? next.slice(-50) : next;
        });
      };
      runnerRef.current = runner;
    }

    return runnerRef.current;
  }, [ensureBuzzer]);

  // -------------------------------------------------------------------------
  // Run code
  // -------------------------------------------------------------------------
  const handleRun = useCallback(async () => {
    const runner = ensureRunner();
    if (!runner) return;

    // Eagerly create + resume AudioContext on user gesture (browser autoplay
    // policy requires AudioContext creation within a click handler call stack)
    ensureBuzzer().resume();

    // Stop any previous run
    if (runner.isRunning) {
      runner.stop();
    }

    // Clear output tracking before each run
    const sim = simulatorRef.current?.getSimulator();
    sim?.clearOutputLog();
    setPrintOutput([]);

    setStatus("running");

    try {
      await runner.run(code);
      // Only set "ready" if it finished naturally (not stopped)
      setStatus((prev) => (prev === "running" ? "ready" : prev));

      // Capture output snapshot for lesson validation
      if (sim && onRunComplete) {
        onRunComplete(sim.getOutputSnapshot());
      }

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
  }, [code, ensureBuzzer, ensureRunner, onRunComplete]);

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
    simulatorRef.current?.getSimulator()?.clearOutputLog();
    setLedBrightness(0);
    setPrintOutput([]);
    setStatus("ready");
  }, []);

  // -------------------------------------------------------------------------
  // Mute toggle handler
  // -------------------------------------------------------------------------
  const handleToggleMute = useCallback(() => {
    const buzzer = ensureBuzzer();
    const newMuted = !buzzer.muted;
    buzzer.muted = newMuted;
    setAudioMuted(newMuted);
  }, [ensureBuzzer]);

  // -------------------------------------------------------------------------
  // Button state -- forward press/release to the code runner
  // -------------------------------------------------------------------------
  const handleButtonA = useCallback(
    (pressed: boolean) => {
      const runner = ensureRunner();
      runner?.setButtonState("a", pressed);
    },
    [ensureRunner]
  );

  const handleButtonB = useCallback(
    (pressed: boolean) => {
      const runner = ensureRunner();
      runner?.setButtonState("b", pressed);
    },
    [ensureRunner]
  );

  // -------------------------------------------------------------------------
  // IMU tilt -- forward accelerometer values to the code runner
  // -------------------------------------------------------------------------
  const handleImuChange = useCallback(
    (x: number, y: number, z: number) => {
      const runner = ensureRunner();
      runner?.setImuValues(x, y, z);
    },
    [ensureRunner]
  );

  // -------------------------------------------------------------------------
  // Cleanup on unmount
  // -------------------------------------------------------------------------
  useEffect(() => {
    return () => {
      runnerRef.current?.stop();
      buzzerRef.current?.dispose();
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
      <CardHeader className="flex-row items-center justify-between px-3 py-2">
        <CardTitle className="text-sm font-bold">Simulator</CardTitle>
        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-1.5 px-3 pb-2">
        {/* Device simulator */}
        <Simulator
          ref={simulatorRef}
          scale={0.85}
          toneActive={toneActive}
          ledBrightness={ledBrightness}
          onButtonA={handleButtonA}
          onButtonB={handleButtonB}
          onImuChange={handleImuChange}
          showTiltPad
        />

        {/* Controls */}
        <div className="flex w-full items-center justify-center gap-1.5">
          <Button
            size="sm"
            onClick={handleRun}
            disabled={status === "running"}
            className="h-8 gap-1 rounded-lg bg-emerald-600 px-3 text-xs hover:bg-emerald-700"
          >
            <Play className="size-3" />
            Run
          </Button>

          <Button
            size="sm"
            onClick={handleStop}
            disabled={status !== "running"}
            className="h-8 gap-1 rounded-lg bg-red-600 px-3 text-xs hover:bg-red-700"
          >
            <Square className="size-3" />
            Stop
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleClear}
            className="h-8 gap-1 rounded-lg px-3 text-xs"
          >
            <RotateCcw className="size-3" />
            Clear
          </Button>

          {/* Mute / unmute buzzer audio */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleMute}
            aria-label={audioMuted ? "Unmute buzzer" : "Mute buzzer"}
            title={audioMuted ? "Unmute buzzer" : "Mute buzzer"}
            className="ml-auto size-8 rounded-lg"
          >
            {audioMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
          </Button>
        </div>

        {/* Print output console */}
        {printOutput.length > 0 && (
          <div className="max-h-24 w-full overflow-y-auto rounded-lg bg-muted p-2">
            <pre className="whitespace-pre-wrap break-all font-mono text-xs text-muted-foreground">
              {printOutput.join("\n")}
            </pre>
          </div>
        )}

        {/* No-device tip -- right below the Run button */}
        {showNoDeviceTip && (
          <div className="flex w-full items-center gap-1.5 rounded-lg bg-emerald-50/70 px-2.5 py-1 dark:bg-emerald-950/30">
            <Monitor className="size-3 shrink-0 text-emerald-500" />
            <p className="min-w-0 flex-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              No device? Click <strong>Run</strong> to test here!
            </p>
            <button
              type="button"
              onClick={onDismissNoDeviceTip}
              className="shrink-0 rounded p-0.5 text-emerald-400 hover:text-emerald-600"
              aria-label="Dismiss tip"
            >
              <X className="size-3" />
            </button>
          </div>
        )}
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

