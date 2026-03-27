import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

import { usePreKNarration } from "./use-prek-narration";

// ---------------------------------------------------------------------------
// Mock useAudioNarration
// ---------------------------------------------------------------------------

const mockSpeak = vi.fn();
const mockStop = vi.fn();
const mockReplay = vi.fn();

vi.mock("@/hooks/use-audio-narration", () => ({
  useAudioNarration: vi.fn(() => ({
    speak: mockSpeak,
    stop: mockStop,
    replay: mockReplay,
    isSpeaking: false,
    isSupported: true,
  })),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
// Auto-speak on mount/text-change has been removed from this hook to avoid
// burning voice/TTS tokens. Narration is now user-initiated only.
// These tests verify the actual current behavior of the hook.
// ---------------------------------------------------------------------------

describe("usePreKNarration", () => {
  beforeEach(() => {
    mockSpeak.mockClear();
    mockStop.mockClear();
    mockReplay.mockClear();
  });

  it("does not auto-speak on mount", () => {
    renderHook(() =>
      usePreKNarration({
        text: "How many bunnies?",
        enabled: true,
      }),
    );

    expect(mockSpeak).not.toHaveBeenCalled();
  });

  it("does not auto-speak even when text changes", () => {
    const { rerender } = renderHook(
      ({ text }) => usePreKNarration({ text, enabled: true }),
      { initialProps: { text: "Question 1" } },
    );

    rerender({ text: "Question 2" });

    expect(mockSpeak).not.toHaveBeenCalled();
  });

  it("stops speaking on unmount", () => {
    const { unmount } = renderHook(() =>
      usePreKNarration({
        text: "Hello",
        enabled: true,
      }),
    );

    unmount();
    expect(mockStop).toHaveBeenCalled();
  });

  it("passes speak through for user-initiated narration", () => {
    const { result } = renderHook(() =>
      usePreKNarration({
        text: "Hello",
        enabled: true,
      }),
    );

    expect(result.current.speak).toBe(mockSpeak);
  });

  it("passes stop through", () => {
    const { result } = renderHook(() =>
      usePreKNarration({
        text: "Hello",
        enabled: true,
      }),
    );

    expect(result.current.stop).toBe(mockStop);
  });

  it("passes replay through", () => {
    const { result } = renderHook(() =>
      usePreKNarration({
        text: "Hello",
        enabled: true,
      }),
    );

    expect(result.current.replay).toBe(mockReplay);
  });

  it("passes through isSpeaking and isSupported", () => {
    const { result } = renderHook(() =>
      usePreKNarration({
        text: "Hello",
        enabled: true,
      }),
    );

    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.isSupported).toBe(true);
  });

  it("returns autoNarrationEnabled matching the enabled option", () => {
    const { result } = renderHook(() =>
      usePreKNarration({
        text: "Hello",
        enabled: true,
      }),
    );

    expect(result.current.autoNarrationEnabled).toBe(true);
  });

  it("returns autoNarrationEnabled false when disabled", () => {
    const { result } = renderHook(() =>
      usePreKNarration({
        text: "Hello",
        enabled: false,
      }),
    );

    expect(result.current.autoNarrationEnabled).toBe(false);
  });
});
