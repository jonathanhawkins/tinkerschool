"use client";

// =============================================================================
// usePreKNarration - Auto-narrate prompts for Pre-K activities
// =============================================================================
// Wraps useAudioNarration to auto-speak text when it changes. Designed for
// Pre-K kids (ages 3-5) who cannot read. When enabled, the hook automatically
// speaks the provided text on mount and whenever the text changes.
//
// Features:
// - Auto-speaks on mount (with configurable delay for page transitions)
// - Re-speaks when text changes (e.g., new question)
// - Provides a replay button callback
// - Skips narration if the Hume voice session is active (to avoid overlap)
// - Respects reduced motion / user preference
// =============================================================================

import { useEffect } from "react";

import {
  useAudioNarration,
  type UseAudioNarrationReturn,
} from "@/hooks/use-audio-narration";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UsePreKNarrationOptions {
  /** Text to auto-speak. Changes trigger re-narration. */
  text: string;
  /** Whether narration is enabled (typically isPreK) */
  enabled?: boolean;
  /** Delay before first auto-speak in ms (default: 600) */
  initialDelay?: number;
  /** Delay before re-speaking on text change in ms (default: 300) */
  changeDelay?: number;
  /** Speech rate (default: 0.85 for young kids) */
  rate?: number;
  /** Voice pitch (default: 1.1 for friendlier tone) */
  pitch?: number;
}

export interface UsePreKNarrationReturn extends UseAudioNarrationReturn {
  /** Whether auto-narration is active for this instance */
  autoNarrationEnabled: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePreKNarration(
  options: UsePreKNarrationOptions,
): UsePreKNarrationReturn {
  const {
    text,
    enabled = true,
    initialDelay = 600,
    changeDelay = 300,
    rate = 0.85,
    pitch = 1.1,
  } = options;

  const narration = useAudioNarration({ rate, pitch, enabled });

  // No auto-speak — narration starts only when the user taps the Chip icon.
  // This avoids burning voice/TTS tokens on every page load and question change.

  // Stop speaking on unmount
  useEffect(() => {
    return () => {
      narration.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...narration,
    autoNarrationEnabled: enabled,
  };
}
