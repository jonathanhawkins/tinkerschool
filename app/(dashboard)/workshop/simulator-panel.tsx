"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Play, Square, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Simulator, type SimulatorHandle } from "@/components/simulator";
import { SimulatorCodeRunner } from "@/lib/simulator/code-runner";
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
  const buzzerRef = useRef<BuzzerAudio | null>(null);

  const [status, setStatus] = useState<SimStatus>("ready");
  const [toneActive, setToneActive] = useState(false);
  const [ledBrightness, setLedBrightness] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);

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

    // Resume AudioContext on user gesture (browser autoplay policy)
    buzzerRef.current?.resume();

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
    setLedBrightness(0);
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
      <CardHeader className="flex-row items-center justify-between px-4 py-3">
        <CardTitle className="text-base font-bold">Simulator</CardTitle>
        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-2 px-4 pb-3">
        {/* Device simulator */}
        <Simulator
          ref={simulatorRef}
          scale={1}
          toneActive={toneActive}
          ledBrightness={ledBrightness}
          onButtonA={handleButtonA}
          onButtonB={handleButtonB}
          onImuChange={handleImuChange}
          showTiltPad
        />

        {/* Controls */}
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            onClick={handleRun}
            disabled={status === "running"}
            className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700"
          >
            <Play className="size-3.5" />
            Run
          </Button>

          <Button
            onClick={handleStop}
            disabled={status !== "running"}
            className="gap-1.5 rounded-xl bg-red-600 hover:bg-red-700"
          >
            <Square className="size-3.5" />
            Stop
          </Button>

          <Button
            variant="outline"
            onClick={handleClear}
            className="gap-1.5 rounded-xl"
          >
            <RotateCcw className="size-3.5" />
            Clear
          </Button>

          {/* Mute / unmute buzzer audio */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleMute}
            aria-label={audioMuted ? "Unmute buzzer" : "Mute buzzer"}
            title={audioMuted ? "Unmute buzzer" : "Mute buzzer"}
            className="ml-auto rounded-xl"
          >
            {audioMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
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

