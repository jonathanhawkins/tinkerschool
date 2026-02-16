import { describe, it, expect } from "vitest";

import {
  parseExpectedOutput,
  usesBuzzer,
  validateLessonOutput,
} from "./validate-output";
import type { SimulatorOutput } from "@/lib/simulator/types";

// ---------------------------------------------------------------------------
// parseExpectedOutput
// ---------------------------------------------------------------------------

describe("parseExpectedOutput", () => {
  it("extracts double-quoted drawString text", () => {
    const code = `Lcd.drawString("Hello World", 10, 20, 0xFFFFFF)`;
    expect(parseExpectedOutput(code)).toEqual(["Hello World"]);
  });

  it("extracts single-quoted drawString text", () => {
    const code = `Lcd.drawString('Goodbye', 10, 20, 0xFFFFFF)`;
    expect(parseExpectedOutput(code)).toEqual(["Goodbye"]);
  });

  it("extracts multiple drawString calls", () => {
    const code = `
Lcd.drawString("Line 1", 10, 20, 0xFFFFFF)
Lcd.drawString("Line 2", 10, 40, 0xFFFFFF)
    `;
    expect(parseExpectedOutput(code)).toEqual(["Line 1", "Line 2"]);
  });

  it("deduplicates repeated text", () => {
    const code = `
Lcd.drawString("Same", 10, 20, 0xFFFFFF)
Lcd.drawString("Same", 30, 40, 0xFFFFFF)
    `;
    expect(parseExpectedOutput(code)).toEqual(["Same"]);
  });

  it("extracts both quote styles in same code", () => {
    const code = `
Lcd.drawString("Double", 10, 20, 0xFFFFFF)
Lcd.drawString('Single', 10, 40, 0xFFFFFF)
    `;
    expect(parseExpectedOutput(code)).toEqual(["Double", "Single"]);
  });

  it("returns empty array when no drawString calls", () => {
    const code = `Speaker.tone(440, 500)\ntime.sleep(1)`;
    expect(parseExpectedOutput(code)).toEqual([]);
  });

  it("handles drawString with extra whitespace", () => {
    const code = `Lcd.drawString(  "Spaced" , 10, 20, 0xFFFFFF)`;
    expect(parseExpectedOutput(code)).toEqual(["Spaced"]);
  });

  it("returns empty for empty string input", () => {
    expect(parseExpectedOutput("")).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// usesBuzzer
// ---------------------------------------------------------------------------

describe("usesBuzzer", () => {
  it("returns true when Speaker.tone is in the code", () => {
    const code = `Speaker.tone(440, 500)`;
    expect(usesBuzzer(code)).toBe(true);
  });

  it("returns false when no buzzer calls", () => {
    const code = `Lcd.drawString("Hello", 10, 20, 0xFFFFFF)`;
    expect(usesBuzzer(code)).toBe(false);
  });

  it("returns true when Speaker.tone is among other code", () => {
    const code = `
Lcd.fillScreen(0x000000)
Speaker.tone(880, 200)
time.sleep(1)
    `;
    expect(usesBuzzer(code)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// validateLessonOutput
// ---------------------------------------------------------------------------

describe("validateLessonOutput", () => {
  function makeOutput(
    texts: string[] = [],
    hasBuzzer = false,
  ): SimulatorOutput {
    return { texts, hasBuzzer };
  }

  it("passes when all expected texts appear in actual output", () => {
    const solution = `
Lcd.drawString("Hello", 10, 20, 0xFFFFFF)
Lcd.drawString("World", 10, 40, 0xFFFFFF)
    `;
    const actual = makeOutput(["Hello", "World"]);

    const result = validateLessonOutput(actual, solution);

    expect(result.passed).toBe(true);
    expect(result.feedback).toBe("Perfect! Your code matches the goal!");
  });

  it("text matching is case-insensitive", () => {
    const solution = `Lcd.drawString("Hello", 10, 20, 0xFFFFFF)`;
    const actual = makeOutput(["hello"]);

    const result = validateLessonOutput(actual, solution);

    expect(result.passed).toBe(true);
  });

  it("fails when expected text is missing", () => {
    const solution = `
Lcd.drawString("Hello", 10, 20, 0xFFFFFF)
Lcd.drawString("World", 10, 40, 0xFFFFFF)
    `;
    const actual = makeOutput(["Hello"]); // Missing "World"

    const result = validateLessonOutput(actual, solution);

    expect(result.passed).toBe(false);
    expect(result.feedback).toContain("World");
  });

  it("shows at most 2 missing items in feedback", () => {
    const solution = `
Lcd.drawString("A", 10, 20, 0xFFFFFF)
Lcd.drawString("B", 10, 40, 0xFFFFFF)
Lcd.drawString("C", 10, 60, 0xFFFFFF)
    `;
    const actual = makeOutput([]); // All missing

    const result = validateLessonOutput(actual, solution);

    expect(result.passed).toBe(false);
    // Should mention at most 2
    expect(result.feedback).toContain("A");
    expect(result.feedback).toContain("B");
    expect(result.feedback).not.toContain('"C"');
  });

  it("fails when buzzer is expected but not present", () => {
    const solution = `Speaker.tone(440, 500)`;
    const actual = makeOutput([], false);

    const result = validateLessonOutput(actual, solution);

    expect(result.passed).toBe(false);
    expect(result.feedback).toContain("buzzer");
  });

  it("passes when buzzer is expected and present", () => {
    const solution = `Speaker.tone(440, 500)`;
    const actual = makeOutput([], true);

    const result = validateLessonOutput(actual, solution);

    expect(result.passed).toBe(true);
  });

  it("passes with generic message when solution has no static expectations", () => {
    // Dynamic code with str() variable -- no static text, no buzzer
    const solution = `Lcd.drawString(str(count), 10, 20, 0xFFFFFF)`;
    const actual = makeOutput([]);

    const result = validateLessonOutput(actual, solution);

    expect(result.passed).toBe(true);
    expect(result.feedback).toBe("Great job running your code!");
  });

  it("handles whitespace in actual texts with trimming", () => {
    const solution = `Lcd.drawString("Hello", 10, 20, 0xFFFFFF)`;
    const actual = makeOutput(["  Hello  "]);

    const result = validateLessonOutput(actual, solution);

    expect(result.passed).toBe(true);
  });

  it("validates both text and buzzer together", () => {
    const solution = `
Lcd.drawString("Sound Test", 10, 20, 0xFFFFFF)
Speaker.tone(440, 500)
    `;

    // Has text but no buzzer
    const result1 = validateLessonOutput(makeOutput(["Sound Test"], false), solution);
    expect(result1.passed).toBe(false);
    expect(result1.feedback).toContain("buzzer");

    // Has both
    const result2 = validateLessonOutput(makeOutput(["Sound Test"], true), solution);
    expect(result2.passed).toBe(true);
  });
});
