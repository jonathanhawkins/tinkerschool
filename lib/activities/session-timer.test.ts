import { describe, it, expect } from "vitest";

import { getTimerConfig } from "./session-timer";

// ---------------------------------------------------------------------------
// getTimerConfig
// ---------------------------------------------------------------------------

describe("getTimerConfig", () => {
  it("returns Pre-K config for band 0", () => {
    const config = getTimerConfig(0);
    expect(config.sessionLimitMinutes).toBe(10);
    expect(config.dailyMaxMinutes).toBe(30);
    expect(config.extendIncrementMinutes).toBe(5);
    expect(config.maxSessionMinutes).toBe(20);
    expect(config.reminderIntervalMinutes).toBe(5);
  });

  it("returns default K-6 config for band 1", () => {
    const config = getTimerConfig(1);
    expect(config.sessionLimitMinutes).toBe(30);
    expect(config.dailyMaxMinutes).toBe(120);
    expect(config.extendIncrementMinutes).toBe(10);
    expect(config.maxSessionMinutes).toBe(60);
    expect(config.reminderIntervalMinutes).toBe(10);
  });

  it("returns default config for band 5", () => {
    const config = getTimerConfig(5);
    expect(config.sessionLimitMinutes).toBe(30);
  });

  it("Pre-K has a shorter session limit than K-6", () => {
    const preK = getTimerConfig(0);
    const k6 = getTimerConfig(1);
    expect(preK.sessionLimitMinutes).toBeLessThan(k6.sessionLimitMinutes);
  });

  it("Pre-K extendIncrementMinutes is 5", () => {
    const config = getTimerConfig(0);
    expect(config.extendIncrementMinutes).toBe(5);
  });

  it("Pre-K maxSessionMinutes is 20", () => {
    const config = getTimerConfig(0);
    expect(config.maxSessionMinutes).toBe(20);
  });

  it("returns default config for an unrecognized band number", () => {
    const config = getTimerConfig(99);
    expect(config.sessionLimitMinutes).toBe(30);
    expect(config.dailyMaxMinutes).toBe(120);
  });
});
