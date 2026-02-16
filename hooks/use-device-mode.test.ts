import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isTablet, isMobile, isTouchDevice } from "./use-device-mode";

// ---------------------------------------------------------------------------
// Utility helper tests (no React rendering needed)
// ---------------------------------------------------------------------------

describe("isTablet", () => {
  it("returns true for tablet mode", () => {
    expect(isTablet("tablet")).toBe(true);
  });
  it("returns false for desktop", () => {
    expect(isTablet("desktop")).toBe(false);
  });
  it("returns false for phone", () => {
    expect(isTablet("phone")).toBe(false);
  });
});

describe("isMobile", () => {
  it("returns true for phone mode", () => {
    expect(isMobile("phone")).toBe(true);
  });
  it("returns false for tablet", () => {
    expect(isMobile("tablet")).toBe(false);
  });
  it("returns false for desktop", () => {
    expect(isMobile("desktop")).toBe(false);
  });
});

describe("isTouchDevice", () => {
  it("returns true for tablet", () => {
    expect(isTouchDevice("tablet")).toBe(true);
  });
  it("returns true for phone", () => {
    expect(isTouchDevice("phone")).toBe(true);
  });
  it("returns false for desktop", () => {
    expect(isTouchDevice("desktop")).toBe(false);
  });
});
