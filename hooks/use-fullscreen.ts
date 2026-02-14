"use client";

/**
 * useFullscreen -- wraps the browser Fullscreen API with React state.
 *
 * Features:
 *  - enter / exit / toggle helpers
 *  - isFullscreen boolean (synced via fullscreenchange event)
 *  - isSupported check (false on iOS Safari which has limited support)
 *  - SSR-safe (always returns false on the server)
 *  - Cleans up event listeners on unmount
 *
 * The Fullscreen API is the right approach here because:
 *  1. CSS `:fullscreen` pseudo-class lets us hide dashboard chrome (sidebar,
 *     mobile header, bottom nav) purely in CSS -- no React context needed
 *  2. The browser handles Escape key to exit automatically
 *  3. Works on Chrome, Edge, Firefox, and most tablet browsers
 */

import { useCallback, useEffect, useState } from "react";

interface UseFullscreenReturn {
  /** Whether the document is currently in fullscreen mode */
  isFullscreen: boolean;
  /** Whether the Fullscreen API is available in this browser */
  isSupported: boolean;
  /** Request fullscreen on the given element (defaults to documentElement) */
  enter: (element?: HTMLElement) => Promise<void>;
  /** Exit fullscreen mode */
  exit: () => Promise<void>;
  /** Toggle fullscreen on/off */
  toggle: (element?: HTMLElement) => Promise<void>;
}

function getIsFullscreen(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(document.fullscreenElement);
}

function getIsSupported(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(document.documentElement.requestFullscreen);
}

export function useFullscreen(): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported] = useState(getIsSupported);

  // Sync state when fullscreen changes (including via Escape key)
  useEffect(() => {
    function handleChange() {
      setIsFullscreen(getIsFullscreen());
    }

    // Set initial state on mount
    handleChange();

    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  const enter = useCallback(async (element?: HTMLElement) => {
    const target = element ?? document.documentElement;
    try {
      await target.requestFullscreen();
    } catch {
      // Fullscreen request failed (e.g. not triggered by user gesture)
    }
  }, []);

  const exit = useCallback(async () => {
    if (!document.fullscreenElement) return;
    try {
      await document.exitFullscreen();
    } catch {
      // Already exited or not in fullscreen
    }
  }, []);

  const toggle = useCallback(
    async (element?: HTMLElement) => {
      if (getIsFullscreen()) {
        await exit();
      } else {
        await enter(element);
      }
    },
    [enter, exit],
  );

  return { isFullscreen, isSupported, enter, exit, toggle };
}
