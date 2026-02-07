import { describe, it, expect } from "vitest";

import { wrapM5StickCode } from "./wrap-m5stick";

describe("wrapM5StickCode", () => {
  it("wraps simple code with correct boilerplate", () => {
    const result = wrapM5StickCode('M5.Lcd.drawString("Hi", 10, 20)');

    expect(result).toContain("import os, sys, io");
    expect(result).toContain("import M5");
    expect(result).toContain("from M5 import *");
    expect(result).toContain("import time");
    expect(result).toContain("M5.begin()");
    expect(result).toContain('M5.Lcd.drawString("Hi", 10, 20)');
    expect(result).toContain("while True:");
    expect(result).toContain("    M5.update()");
  });

  it("places user code between the marker comments", () => {
    const result = wrapM5StickCode("print('hello')");

    const lines = result.split("\n");
    const startMarkerIdx = lines.findIndex((l) =>
      l.includes("# --- Your Code ---")
    );
    const endMarkerIdx = lines.findIndex((l) =>
      l.includes("# --- End Your Code ---")
    );

    expect(startMarkerIdx).toBeGreaterThan(-1);
    expect(endMarkerIdx).toBeGreaterThan(startMarkerIdx);

    // User code should be between the markers
    const codeBetween = lines
      .slice(startMarkerIdx + 1, endMarkerIdx)
      .join("\n");
    expect(codeBetween).toContain("print('hello')");
  });

  it("preserves user code indentation", () => {
    const indentedCode = `if True:
    print("yes")
    for i in range(5):
        print(i)`;

    const result = wrapM5StickCode(indentedCode);

    expect(result).toContain('    print("yes")');
    expect(result).toContain("    for i in range(5):");
    expect(result).toContain("        print(i)");
  });

  it("handles empty string input", () => {
    const result = wrapM5StickCode("");

    // Should still produce valid boilerplate
    expect(result).toContain("import M5");
    expect(result).toContain("M5.begin()");
    expect(result).toContain("# --- Your Code ---");
    expect(result).toContain("# --- End Your Code ---");
    expect(result).toContain("while True:");
  });

  it("handles multi-line code", () => {
    const multiLine = `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Hello", 10, 20)
M5.Speaker.tone(440, 500)
time.sleep(1)`;

    const result = wrapM5StickCode(multiLine);

    expect(result).toContain("M5.Lcd.fillScreen(0x000000)");
    expect(result).toContain('M5.Lcd.drawString("Hello", 10, 20)');
    expect(result).toContain("M5.Speaker.tone(440, 500)");
    expect(result).toContain("time.sleep(1)");
  });

  it("includes import time for wait block usage", () => {
    const result = wrapM5StickCode("time.sleep(2)");

    expect(result).toContain("import time");
  });

  it("includes import random for random number block usage", () => {
    const result = wrapM5StickCode("x = random.randint(1, 6)");

    expect(result).toContain("import random");
  });

  it("includes shake_detected helper function", () => {
    const result = wrapM5StickCode("if shake_detected(): pass");

    expect(result).toContain("def shake_detected():");
    expect(result).toContain("global _last_accel");
    expect(result).toContain("Imu.getAccel()");
    expect(result).toContain("return diff > 1.5");
  });

  it("trims trailing whitespace from user code", () => {
    const codeWithTrailing = "print('hello')   \n\n\n";
    const result = wrapM5StickCode(codeWithTrailing);

    // The function calls trimEnd() on the generated code, removing trailing
    // blank lines and spaces. Verify the trailing lines are gone.
    const lines = result.split("\n");
    const startMarkerIdx = lines.findIndex((l) =>
      l.includes("# --- Your Code ---")
    );
    const endMarkerIdx = lines.findIndex((l) =>
      l.includes("# --- End Your Code ---")
    );

    // There should be exactly one line of user code between the markers
    // (the template adds ${trimmed}\n which leaves one blank line)
    const codeSection = lines.slice(startMarkerIdx + 1, endMarkerIdx);
    const nonEmptyLines = codeSection.filter((l) => l.trim() !== "");
    expect(nonEmptyLines.length).toBe(1);
    expect(nonEmptyLines[0].trim()).toBe("print('hello')");
  });

  it("produces a program that starts with imports and ends with the update loop", () => {
    const result = wrapM5StickCode("pass");
    const lines = result.split("\n").filter((l) => l.trim() !== "");

    // First non-empty line should be an import
    expect(lines[0]).toMatch(/^import /);

    // Last non-empty line should be M5.update()
    expect(lines[lines.length - 1].trim()).toBe("M5.update()");
  });
});
