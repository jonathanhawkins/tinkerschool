import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFullscreen } from "./use-fullscreen";

// ---------------------------------------------------------------------------
// Mock Fullscreen API
// ---------------------------------------------------------------------------

beforeEach(() => {
  // Reset fullscreen state
  Object.defineProperty(document, "fullscreenElement", {
    writable: true,
    value: null,
  });
  document.documentElement.requestFullscreen = vi.fn().mockResolvedValue(undefined);
  document.exitFullscreen = vi.fn().mockResolvedValue(undefined);
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useFullscreen", () => {
  it("returns isFullscreen=false initially", () => {
    const { result } = renderHook(() => useFullscreen());
    expect(result.current.isFullscreen).toBe(false);
  });

  it("returns isSupported=true when requestFullscreen exists", () => {
    const { result } = renderHook(() => useFullscreen());
    expect(result.current.isSupported).toBe(true);
  });

  it("calls requestFullscreen on enter", async () => {
    const { result } = renderHook(() => useFullscreen());

    await act(async () => {
      await result.current.enter();
    });

    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
  });

  it("calls exitFullscreen on exit when in fullscreen", async () => {
    // Simulate being in fullscreen
    Object.defineProperty(document, "fullscreenElement", {
      writable: true,
      value: document.documentElement,
    });

    const { result } = renderHook(() => useFullscreen());

    await act(async () => {
      await result.current.exit();
    });

    expect(document.exitFullscreen).toHaveBeenCalled();
  });

  it("does not call exitFullscreen when not in fullscreen", async () => {
    const { result } = renderHook(() => useFullscreen());

    await act(async () => {
      await result.current.exit();
    });

    expect(document.exitFullscreen).not.toHaveBeenCalled();
  });

  it("toggle calls enter when not fullscreen", async () => {
    const { result } = renderHook(() => useFullscreen());

    await act(async () => {
      await result.current.toggle();
    });

    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
  });

  it("syncs state on fullscreenchange event", () => {
    const { result } = renderHook(() => useFullscreen());

    // Simulate entering fullscreen
    Object.defineProperty(document, "fullscreenElement", {
      writable: true,
      value: document.documentElement,
    });

    act(() => {
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    expect(result.current.isFullscreen).toBe(true);
  });
});
