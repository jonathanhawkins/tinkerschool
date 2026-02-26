"use client";

// =============================================================================
// useAudioNarration - Text-to-speech narration for Pre-K activities
// =============================================================================
// Uses the Web Speech API (SpeechSynthesis) to read activity prompts aloud.
// Designed for Pre-K kids (ages 3-5) who can't read yet. Picks a kid-friendly
// voice when available and speaks at a slower, friendlier rate.
// =============================================================================

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseAudioNarrationOptions {
  /** Speech rate -- 0.1 to 10, default 0.85 for young kids */
  rate?: number;
  /** Voice pitch -- 0 to 2, default 1.1 for a friendlier tone */
  pitch?: number;
  /** Automatically narrate on mount (default: true for Pre-K) */
  autoPlay?: boolean;
  /** Enable or disable narration entirely (e.g. based on band/preference) */
  enabled?: boolean;
}

export interface UseAudioNarrationReturn {
  /** Speak the given text aloud. Cancels any ongoing speech first. */
  speak: (text: string) => void;
  /** Stop any ongoing speech */
  stop: () => void;
  /** Whether the browser is currently speaking */
  isSpeaking: boolean;
  /** Whether the Web Speech API is available in this browser */
  isSupported: boolean;
  /** Re-play the last spoken text */
  replay: () => void;
}

// ---------------------------------------------------------------------------
// Voice selection heuristic
// ---------------------------------------------------------------------------

/**
 * Pick a kid-friendly voice from the available SpeechSynthesis voices.
 *
 * Preference order:
 *  1. English female voice with "samantha" or "karen" in the name (macOS/iOS)
 *  2. Any English female voice
 *  3. Any English voice
 *  4. The browser default (null)
 */
function pickKidFriendlyVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  // Filter to English voices
  const englishVoices = voices.filter((v) =>
    v.lang.startsWith("en"),
  );

  if (englishVoices.length === 0) return null;

  // Preferred voice names (case-insensitive partial match)
  const preferredNames = ["samantha", "karen", "victoria", "zira"];

  for (const name of preferredNames) {
    const match = englishVoices.find((v) =>
      v.name.toLowerCase().includes(name),
    );
    if (match) return match;
  }

  // Fall back to any English voice marked as default
  const defaultEnglish = englishVoices.find((v) => v.default);
  if (defaultEnglish) return defaultEnglish;

  // Fall back to first English voice
  return englishVoices[0];
}

// ---------------------------------------------------------------------------
// SpeechSynthesis support detection via useSyncExternalStore
// ---------------------------------------------------------------------------

function getSupportedSnapshot(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined"
  );
}

function getServerSupportedSnapshot(): boolean {
  return false;
}

/** No-op subscribe -- support status never changes at runtime. */
function subscribeToNothing(callback: () => void): () => void {
  // Support status is static; no events to listen for.
  void callback;
  return () => {};
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAudioNarration(
  options: UseAudioNarrationOptions = {},
): UseAudioNarrationReturn {
  const {
    rate = 0.85,
    pitch = 1.1,
    // autoPlay is part of the public API but consumed by the calling component
    // (which calls `speak(text)` in its own useEffect). The hook doesn't need
    // to read it directly.
    enabled = true,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Detect support without triggering a setState inside an effect
  const isSupported = useSyncExternalStore(
    subscribeToNothing,
    getSupportedSnapshot,
    getServerSupportedSnapshot,
  );

  // Store the last spoken text for replay
  const lastTextRef = useRef<string>("");

  // Store the selected voice (resolved asynchronously in some browsers)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Track mount state to avoid setting state after unmount
  const mountedRef = useRef(true);

  // ---------------------------------------------------------------------------
  // Resolve voice on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    mountedRef.current = true;

    if (!isSupported) return;

    const resolveVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current = pickKidFriendlyVoice(voices);
    };

    // Some browsers (Chrome) load voices asynchronously
    resolveVoice();
    window.speechSynthesis.addEventListener("voiceschanged", resolveVoice);

    return () => {
      mountedRef.current = false;
      window.speechSynthesis.removeEventListener("voiceschanged", resolveVoice);
      // Stop speaking on unmount to prevent orphaned audio
      window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  // ---------------------------------------------------------------------------
  // Core speak function
  // ---------------------------------------------------------------------------
  const speak = useCallback(
    (text: string) => {
      if (!enabled || !isSupported) {
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 1;

      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }

      utterance.onstart = () => {
        if (mountedRef.current) {
          setIsSpeaking(true);
        }
      };

      utterance.onend = () => {
        if (mountedRef.current) {
          setIsSpeaking(false);
        }
      };

      utterance.onerror = () => {
        if (mountedRef.current) {
          setIsSpeaking(false);
        }
      };

      lastTextRef.current = text;
      window.speechSynthesis.speak(utterance);
    },
    [enabled, isSupported, rate, pitch],
  );

  // ---------------------------------------------------------------------------
  // Stop
  // ---------------------------------------------------------------------------
  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
    }
    if (mountedRef.current) {
      setIsSpeaking(false);
    }
  }, [isSupported]);

  // ---------------------------------------------------------------------------
  // Replay the last spoken text
  // ---------------------------------------------------------------------------
  const replay = useCallback(() => {
    if (lastTextRef.current) {
      speak(lastTextRef.current);
    }
  }, [speak]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    replay,
  };
}
