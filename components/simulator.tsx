"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { M5StickSimulator } from "@/lib/simulator/m5stick-simulator";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SimulatorHandle {
  /** Get the underlying M5StickSimulator instance */
  getSimulator: () => M5StickSimulator | null;
  /** Clear the display to black */
  clear: () => void;
}

export interface SimulatorProps {
  /** Scale factor for the display (default: 2) */
  scale?: number;
  /** Callback when Button A press state changes */
  onButtonA?: (pressed: boolean) => void;
  /** Callback when Button B press state changes */
  onButtonB?: (pressed: boolean) => void;
  /** Callback when IMU tilt values change (x, y, z in range -1 to 1) */
  onImuChange?: (x: number, y: number, z: number) => void;
  /** Whether a tone is currently playing (visual indicator) */
  toneActive?: boolean;
  /** LED brightness 0-255 (0 = off, >0 = on, shown as red LED glow) */
  ledBrightness?: number;
  /** Whether to show the tilt control pad (default: false) */
  showTiltPad?: boolean;
  /** Additional CSS class for the outermost wrapper */
  className?: string;
}

// ---------------------------------------------------------------------------
// Device dimensions
// ---------------------------------------------------------------------------

const DISPLAY_W = M5StickSimulator.WIDTH; // 135
const DISPLAY_H = M5StickSimulator.HEIGHT; // 240

/** Extra padding around the screen inside the device frame */
const BEZEL = 12;
/** Corner radius of the device body */
const BODY_RADIUS = 20;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Simulator -- a kid-friendly, browser-based replica of the M5StickC Plus 2.
 *
 * Renders a canvas at the device's native 135x240 resolution, scaled up so
 * it's easy to see. The canvas is wrapped in a visual "device frame" that
 * resembles the real hardware: dark rounded body, screen cutout, two buttons
 * (A + B), and a power LED.
 *
 * Usage:
 * ```tsx
 * const ref = useRef<SimulatorHandle>(null);
 * <Simulator ref={ref} scale={2.5} />
 *
 * // Later:
 * const sim = ref.current?.getSimulator();
 * sim?.drawString("Hello!", 10, 10, "#00FF00");
 * ```
 */
const Simulator = forwardRef<SimulatorHandle, SimulatorProps>(
  function Simulator(
    {
      scale = 2,
      onButtonA,
      onButtonB,
      onImuChange,
      toneActive = false,
      ledBrightness = 0,
      showTiltPad = false,
      className,
    },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [simulator, setSimulator] = useState<M5StickSimulator | null>(null);
    const [btnAPressed, setBtnAPressed] = useState(false);
    const [btnBPressed, setBtnBPressed] = useState(false);

    // -----------------------------------------------------------------------
    // Initialize simulator when canvas mounts
    // -----------------------------------------------------------------------
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const sim = new M5StickSimulator(canvas);
        setSimulator(sim);
      } catch {
        // Canvas context not available (e.g., SSR or test env)
      }
    }, []);

    // -----------------------------------------------------------------------
    // Expose imperative API
    // -----------------------------------------------------------------------
    const clear = useCallback(() => {
      simulator?.clear("#000000");
    }, [simulator]);

    useImperativeHandle(
      ref,
      () => ({
        getSimulator: () => simulator,
        clear,
      }),
      [simulator, clear]
    );

    // -----------------------------------------------------------------------
    // Button handlers -- press/release for realistic hold behaviour
    // -----------------------------------------------------------------------
    const handleButtonADown = useCallback(() => {
      setBtnAPressed(true);
      onButtonA?.(true);
    }, [onButtonA]);

    const handleButtonAUp = useCallback(() => {
      setBtnAPressed(false);
      onButtonA?.(false);
    }, [onButtonA]);

    const handleButtonBDown = useCallback(() => {
      setBtnBPressed(true);
      onButtonB?.(true);
    }, [onButtonB]);

    const handleButtonBUp = useCallback(() => {
      setBtnBPressed(false);
      onButtonB?.(false);
    }, [onButtonB]);

    // -----------------------------------------------------------------------
    // Keyboard shortcuts: 'a' key = Button A, 'b' key = Button B
    // -----------------------------------------------------------------------
    useEffect(() => {
      function handleKeyDown(e: KeyboardEvent) {
        // Ignore if the user is typing in an input/textarea/contenteditable
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) {
          return;
        }

        if (e.key === "a" || e.key === "A") {
          if (!e.repeat) handleButtonADown();
        } else if (e.key === "b" || e.key === "B") {
          if (!e.repeat) handleButtonBDown();
        }
      }

      function handleKeyUp(e: KeyboardEvent) {
        if (e.key === "a" || e.key === "A") {
          handleButtonAUp();
        } else if (e.key === "b" || e.key === "B") {
          handleButtonBUp();
        }
      }

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }, [handleButtonADown, handleButtonAUp, handleButtonBDown, handleButtonBUp]);

    // -----------------------------------------------------------------------
    // Tilt pad state & handlers
    // -----------------------------------------------------------------------
    const tiltPadRef = useRef<HTMLDivElement>(null);
    const [tiltX, setTiltX] = useState(0);
    const [tiltY, setTiltY] = useState(0);
    const [isTilting, setIsTilting] = useState(false);

    const updateTilt = useCallback(
      (clientX: number, clientY: number) => {
        const pad = tiltPadRef.current;
        if (!pad) return;
        const rect = pad.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const radius = rect.width / 2;
        // Normalize to -1..1, clamped
        const rawX = Math.max(-1, Math.min(1, (clientX - cx) / radius));
        const rawY = Math.max(-1, Math.min(1, (clientY - cy) / radius));
        setTiltX(rawX);
        setTiltY(rawY);
        onImuChange?.(rawX, rawY, 1.0 - Math.abs(rawX) * 0.3 - Math.abs(rawY) * 0.3);
      },
      [onImuChange]
    );

    const handleTiltStart = useCallback(
      (e: React.PointerEvent) => {
        setIsTilting(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        updateTilt(e.clientX, e.clientY);
      },
      [updateTilt]
    );

    const handleTiltMove = useCallback(
      (e: React.PointerEvent) => {
        if (!isTilting) return;
        updateTilt(e.clientX, e.clientY);
      },
      [isTilting, updateTilt]
    );

    const handleTiltEnd = useCallback(() => {
      setIsTilting(false);
      setTiltX(0);
      setTiltY(0);
      onImuChange?.(0, 0, 1.0);
    }, [onImuChange]);

    const handleShake = useCallback(() => {
      // Simulate a shake by rapidly cycling IMU values
      onImuChange?.(1.5, 1.2, 0.8);
      setTiltX(0.8);
      setTiltY(0.8);
      setTimeout(() => {
        onImuChange?.(0, 0, 1.0);
        setTiltX(0);
        setTiltY(0);
      }, 300);
    }, [onImuChange]);

    // -----------------------------------------------------------------------
    // Computed sizes
    // -----------------------------------------------------------------------
    const screenW = DISPLAY_W * scale;
    const screenH = DISPLAY_H * scale;
    const bodyW = screenW + BEZEL * 2;
    const bodyH = screenH + BEZEL * 2 + 56; // extra for button row
    const buttonSize = 28 * scale * 0.5;

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
    return (
      <div
        className={cn("flex flex-col items-center select-none", className)}
        style={{ width: bodyW }}
      >
        {/* Device body */}
        <div
          className="relative flex flex-col items-center bg-gradient-to-b from-[#2a2a2e] to-[#1a1a1e] shadow-xl"
          style={{
            width: bodyW,
            height: bodyH,
            borderRadius: BODY_RADIUS,
            border: "2px solid #3a3a40",
          }}
        >
          {/* Programmable LED indicator (red, like real device) */}
          <div
            className={cn(
              "absolute top-2 left-3 rounded-full transition-all duration-200",
              ledBrightness > 0
                ? "bg-red-500 shadow-[0_0_8px_3px_rgba(239,68,68,0.7)]"
                : "bg-[#3a3a40]"
            )}
            style={{ width: 6, height: 6 }}
            title={ledBrightness > 0 ? "LED on" : "LED off"}
          />

          {/* Power LED indicator */}
          <div
            className={cn(
              "absolute top-2 right-3 rounded-full transition-colors duration-300",
              toneActive
                ? "bg-yellow-400 shadow-[0_0_6px_2px_rgba(250,204,21,0.6)]"
                : "bg-green-500 shadow-[0_0_4px_1px_rgba(34,197,94,0.4)]"
            )}
            style={{ width: 6, height: 6 }}
            title={toneActive ? "Speaker active" : "Power on"}
          />

          {/* Screen bezel */}
          <div
            className="overflow-hidden bg-black"
            style={{
              marginTop: BEZEL,
              width: screenW,
              height: screenH,
              borderRadius: 6,
              boxShadow: "inset 0 0 4px rgba(0,0,0,0.8)",
            }}
          >
            {/* Canvas scaled via CSS transform for crisp pixels */}
            <canvas
              ref={canvasRef}
              style={{
                width: DISPLAY_W,
                height: DISPLAY_H,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                imageRendering: "pixelated",
              }}
            />
          </div>

          {/* Buttons row */}
          <div
            className="flex items-center justify-center gap-6"
            style={{ marginTop: 10 }}
          >
            {/* Button A */}
            <button
              type="button"
              className={cn(
                "rounded-full border-2 border-[#555] transition-all duration-100",
                "bg-gradient-to-b from-[#484850] to-[#38383e]",
                "hover:from-[#555560] hover:to-[#444448]",
                "active:from-[#38383e] active:to-[#2a2a2e]",
                "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1e]",
                btnAPressed && "scale-90 from-[#38383e] to-[#2a2a2e]"
              )}
              style={{
                width: Math.max(buttonSize, 44),
                height: Math.max(buttonSize, 44),
                boxShadow: btnAPressed
                  ? "inset 0 2px 4px rgba(0,0,0,0.5)"
                  : "0 2px 4px rgba(0,0,0,0.4)",
              }}
              onPointerDown={handleButtonADown}
              onPointerUp={handleButtonAUp}
              onPointerLeave={handleButtonAUp}
              aria-label="Button A (or press A key)"
              title="Button A (or press A key)"
            >
              <span className="text-[9px] font-bold text-[#888] select-none">
                A
              </span>
            </button>

            {/* Button B */}
            <button
              type="button"
              className={cn(
                "rounded-full border-2 border-[#555] transition-all duration-100",
                "bg-gradient-to-b from-[#484850] to-[#38383e]",
                "hover:from-[#555560] hover:to-[#444448]",
                "active:from-[#38383e] active:to-[#2a2a2e]",
                "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1e]",
                btnBPressed && "scale-90 from-[#38383e] to-[#2a2a2e]"
              )}
              style={{
                width: Math.max(buttonSize, 44),
                height: Math.max(buttonSize, 44),
                boxShadow: btnBPressed
                  ? "inset 0 2px 4px rgba(0,0,0,0.5)"
                  : "0 2px 4px rgba(0,0,0,0.4)",
              }}
              onPointerDown={handleButtonBDown}
              onPointerUp={handleButtonBUp}
              onPointerLeave={handleButtonBUp}
              aria-label="Button B (or press B key)"
              title="Button B (or press B key)"
            >
              <span className="text-[9px] font-bold text-[#888] select-none">
                B
              </span>
            </button>
          </div>

          {/* Bottom accent line (like the real device's USB-C port area) */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#3a3a40]"
            style={{ width: 20, height: 4 }}
          />
        </div>

        {/* Keyboard shortcut hint */}
        <p className="mt-1.5 text-center text-xs font-medium text-muted-foreground">
          Click buttons or press A / B keys
        </p>

        {/* Tilt pad for IMU simulation */}
        {showTiltPad && (
          <div className="mt-3 flex flex-col items-center gap-1.5">
            <p className="text-xs font-semibold text-muted-foreground">
              Tilt Sensor
            </p>
            <div className="flex items-center gap-3">
              {/* Tilt pad -- a circular draggable area */}
              <div
                ref={tiltPadRef}
                className={cn(
                  "relative rounded-full border-2 border-border bg-muted/50 cursor-crosshair touch-none",
                  isTilting && "border-primary/60"
                )}
                style={{ width: 80, height: 80 }}
                onPointerDown={handleTiltStart}
                onPointerMove={handleTiltMove}
                onPointerUp={handleTiltEnd}
                onPointerCancel={handleTiltEnd}
                role="slider"
                aria-label="Tilt sensor pad -- drag to simulate tilting the device"
                aria-valuetext={`Tilt X: ${tiltX.toFixed(1)}, Y: ${tiltY.toFixed(1)}`}
                tabIndex={0}
              >
                {/* Crosshair lines */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-border/50" />
                <div className="absolute top-0 left-1/2 w-px h-full bg-border/50" />
                {/* Tilt indicator dot */}
                <div
                  className={cn(
                    "absolute rounded-full transition-colors duration-150",
                    isTilting ? "bg-primary" : "bg-muted-foreground/60"
                  )}
                  style={{
                    width: 12,
                    height: 12,
                    left: `calc(50% + ${tiltX * 34}px - 6px)`,
                    top: `calc(50% + ${tiltY * 34}px - 6px)`,
                  }}
                />
              </div>

              {/* Shake button */}
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border-2 border-border",
                  "bg-muted/50 transition-all duration-100",
                  "hover:border-primary/50 hover:bg-muted",
                  "active:scale-95",
                  "focus-visible:ring-2 focus-visible:ring-primary/50"
                )}
                style={{ width: 56, height: 56, minHeight: 44 }}
                onClick={handleShake}
                aria-label="Shake the device"
                title="Shake!"
              >
                <ShakeIcon />
                <span className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                  Shake
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Simulator.displayName = "Simulator";

/** Shake icon -- wavy motion lines */
function ShakeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 text-muted-foreground"
      aria-hidden="true"
    >
      <path d="M2 8l3 3-3 3" />
      <path d="M22 8l-3 3 3 3" />
      <rect x="8" y="4" width="8" height="16" rx="2" />
    </svg>
  );
}

export { Simulator };
