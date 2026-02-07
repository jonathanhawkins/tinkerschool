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
  /** Callback when Button A is pressed */
  onButtonA?: () => void;
  /** Callback when Button B is pressed */
  onButtonB?: () => void;
  /** Whether a tone is currently playing (visual indicator) */
  toneActive?: boolean;
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
    { scale = 2, onButtonA, onButtonB, toneActive = false, className },
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
    // Button handlers
    // -----------------------------------------------------------------------
    const handleButtonA = useCallback(() => {
      setBtnAPressed(true);
      onButtonA?.();
      setTimeout(() => setBtnAPressed(false), 150);
    }, [onButtonA]);

    const handleButtonB = useCallback(() => {
      setBtnBPressed(true);
      onButtonB?.();
      setTimeout(() => setBtnBPressed(false), 150);
    }, [onButtonB]);

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
                "focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1e]",
                btnAPressed && "scale-90 from-[#38383e] to-[#2a2a2e]"
              )}
              style={{
                width: buttonSize,
                height: buttonSize,
                boxShadow: btnAPressed
                  ? "inset 0 2px 4px rgba(0,0,0,0.5)"
                  : "0 2px 4px rgba(0,0,0,0.4)",
              }}
              onClick={handleButtonA}
              aria-label="Button A"
              title="Button A"
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
                "focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1e]",
                btnBPressed && "scale-90 from-[#38383e] to-[#2a2a2e]"
              )}
              style={{
                width: buttonSize,
                height: buttonSize,
                boxShadow: btnBPressed
                  ? "inset 0 2px 4px rgba(0,0,0,0.5)"
                  : "0 2px 4px rgba(0,0,0,0.4)",
              }}
              onClick={handleButtonB}
              aria-label="Button B"
              title="Button B"
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

      </div>
    );
  }
);

Simulator.displayName = "Simulator";

export { Simulator };
