import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";

import { usePreKMode } from "./use-pre-k-mode";

// ---------------------------------------------------------------------------
// usePreKMode
// ---------------------------------------------------------------------------

describe("usePreKMode", () => {
  it("returns isPreK: true and band: 0 for gradeLevel = -1", () => {
    const { result } = renderHook(() => usePreKMode(-1));
    expect(result.current.isPreK).toBe(true);
    expect(result.current.band).toBe(0);
  });

  it("returns isPreK: false and band: 1 for gradeLevel = 0 (Kindergarten)", () => {
    const { result } = renderHook(() => usePreKMode(0));
    expect(result.current.isPreK).toBe(false);
    expect(result.current.band).toBe(1);
  });

  it("returns isPreK: false and band: 2 for gradeLevel = 2", () => {
    const { result } = renderHook(() => usePreKMode(2));
    expect(result.current.isPreK).toBe(false);
    expect(result.current.band).toBe(2);
  });

  it("returns isPreK: false and band: 1 for gradeLevel = null", () => {
    const { result } = renderHook(() => usePreKMode(null));
    expect(result.current.isPreK).toBe(false);
    expect(result.current.band).toBe(1);
  });

  it("returns isPreK: false and band: 1 for gradeLevel = undefined", () => {
    const { result } = renderHook(() => usePreKMode(undefined));
    expect(result.current.isPreK).toBe(false);
    expect(result.current.band).toBe(1);
  });
});
