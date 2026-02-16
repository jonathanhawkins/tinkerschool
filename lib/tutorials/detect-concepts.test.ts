import { describe, it, expect } from "vitest";

import { detectConceptsForLesson } from "./detect-concepts";

// ---------------------------------------------------------------------------
// detectConceptsForLesson
// ---------------------------------------------------------------------------

describe("detectConceptsForLesson", () => {
  it("returns 'display' as default when no concepts detected", () => {
    const result = detectConceptsForLesson([], null, null);
    expect(result).toEqual(["display"]);
  });

  it("detects display concept from hints mentioning 'screen'", () => {
    const result = detectConceptsForLesson(
      [{ text: "Show something on the screen" }],
      null,
      null,
    );
    expect(result).toContain("display");
  });

  it("detects display concept from starter blocks XML", () => {
    const result = detectConceptsForLesson(
      [],
      '<block type="m5_display_text"></block>',
      null,
    );
    expect(result).toContain("display");
  });

  it("detects sound concept from solution code", () => {
    const result = detectConceptsForLesson(
      [],
      null,
      "Speaker.tone(440, 500)\n",
    );
    expect(result).toContain("sound");
  });

  it("detects sound concept from hints mentioning 'buzzer'", () => {
    const result = detectConceptsForLesson(
      [{ text: "Use the buzzer to play a note" }],
      null,
      null,
    );
    expect(result).toContain("sound");
  });

  it("detects loops concept from hints", () => {
    const result = detectConceptsForLesson(
      [{ text: "Use a loop to repeat the display 10 times" }],
      null,
      null,
    );
    expect(result).toContain("loops");
  });

  it("detects loops concept from blocks XML with controls_repeat", () => {
    const result = detectConceptsForLesson(
      [],
      '<block type="controls_repeat_ext"></block>',
      null,
    );
    expect(result).toContain("loops");
  });

  it("detects logic concept from hints mentioning 'if'", () => {
    const result = detectConceptsForLesson(
      [{ text: "Use an if block to check the button" }],
      null,
      null,
    );
    expect(result).toContain("logic");
  });

  it("detects variables concept from hints", () => {
    const result = detectConceptsForLesson(
      [{ text: "Create a variable to store the score" }],
      null,
      null,
    );
    expect(result).toContain("variables");
  });

  it("detects wait concept from solution code", () => {
    const result = detectConceptsForLesson(
      [],
      null,
      "time.sleep(2)\n",
    );
    expect(result).toContain("wait");
  });

  it("detects buttons concept from hints", () => {
    const result = detectConceptsForLesson(
      [{ text: "Check if button A is pressed" }],
      null,
      null,
    );
    expect(result).toContain("buttons");
  });

  it("detects multiple concepts from combined sources", () => {
    const result = detectConceptsForLesson(
      [{ text: "Display a message on the screen" }],
      '<block type="m5_wait"></block>',
      "Speaker.tone(440, 500)\ntime.sleep(1)\n",
    );
    expect(result).toContain("display");
    expect(result).toContain("sound");
    expect(result).toContain("wait");
  });

  it("returns unique concepts (no duplicates)", () => {
    const result = detectConceptsForLesson(
      [
        { text: "Display text on screen" },
        { text: "Clear display first" },
      ],
      '<block type="m5_display_text"></block>',
      null,
    );
    const displayCount = result.filter((c) => c === "display").length;
    expect(displayCount).toBe(1);
  });

  it("detects wait from m5_wait block type in XML", () => {
    const result = detectConceptsForLesson(
      [],
      '<block type="m5_wait"><field name="SECONDS">2</field></block>',
      null,
    );
    expect(result).toContain("wait");
  });

  it("detects button from m5_button block type in XML", () => {
    const result = detectConceptsForLesson(
      [],
      '<block type="m5_button_pressed"></block>',
      null,
    );
    expect(result).toContain("buttons");
  });

  it("handles empty hints array gracefully", () => {
    const result = detectConceptsForLesson([], null, null);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("handles all null inputs without throwing", () => {
    expect(() => detectConceptsForLesson([], null, null)).not.toThrow();
  });
});
