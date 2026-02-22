import { useCallback, useRef } from "react";

// ---------------------------------------------------------------------------
// useRepeatPress - press-and-hold acceleration for +/- buttons
// ---------------------------------------------------------------------------
// Fires `onAction` once immediately, then starts repeating after a delay.
// The repeat rate accelerates the longer you hold:
//   - 0–300ms:     nothing (single tap already fired)
//   - 300ms–1.2s:  repeat every 150ms  (slow)
//   - 1.2s–2.5s:   repeat every 80ms   (medium)
//   - 2.5s+:        repeat every 40ms   (fast)
// ---------------------------------------------------------------------------

interface UseRepeatPressOptions {
  /** Called on each tick (initial press + every repeat) */
  onAction: () => void;
  /** Delay before repeating starts (ms). Default: 300 */
  initialDelay?: number;
  /** Whether the button is disabled */
  disabled?: boolean;
}

export function useRepeatPress({
  onAction,
  initialDelay = 300,
  disabled = false,
}: UseRepeatPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatCount = useRef(0);
  const isPressed = useRef(false);

  const stop = useCallback(() => {
    isPressed.current = false;
    repeatCount.current = 0;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (!isPressed.current) return;

    onAction();
    repeatCount.current += 1;

    // Accelerate based on how long we've been holding
    let nextDelay: number;
    if (repeatCount.current < 6) {
      nextDelay = 150; // slow phase
    } else if (repeatCount.current < 18) {
      nextDelay = 80; // medium phase
    } else {
      nextDelay = 40; // fast phase
    }

    timerRef.current = setTimeout(tick, nextDelay);
  }, [onAction]);

  const start = useCallback(() => {
    if (disabled) return;

    isPressed.current = true;
    repeatCount.current = 0;

    // Fire once immediately
    onAction();

    // Start repeating after initial delay
    timerRef.current = setTimeout(tick, initialDelay);
  }, [onAction, tick, initialDelay, disabled]);

  return {
    /** Spread these onto the button element */
    pressHandlers: {
      onPointerDown: (e: React.PointerEvent) => {
        // Prevent text selection while holding
        e.preventDefault();
        start();
      },
      onPointerUp: stop,
      onPointerLeave: stop,
      onPointerCancel: stop,
      // Prevent context menu on long press (mobile)
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    },
    stop,
  };
}
