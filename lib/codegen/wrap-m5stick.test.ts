import { describe, it, expect } from "vitest";

import { wrapM5StickCode } from "./wrap-m5stick";

// ---------------------------------------------------------------
// Test helper
// ---------------------------------------------------------------

/** Extract the user code section between the marker comments. */
function extractUserCode(wrappedOutput: string): string {
  const startMarker = "# --- Your Code ---\n";
  const endMarker = "\n# --- End Your Code ---";
  const startIdx = wrappedOutput.indexOf(startMarker);
  const endIdx = wrappedOutput.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error("Could not find user code markers in wrapped output");
  }

  return wrappedOutput.slice(startIdx + startMarker.length, endIdx);
}

describe("wrapM5StickCode", () => {
  // ---------------------------------------------------------------
  // Basic wrapping adds required imports and boilerplate
  // ---------------------------------------------------------------

  describe("boilerplate structure", () => {
    it("includes all required imports", () => {
      const result = wrapM5StickCode("");

      expect(result).toContain("import os, sys, io");
      expect(result).toContain("import M5");
      expect(result).toContain("from M5 import *");
      expect(result).toContain("import time");
      expect(result).toContain("import random");
    });

    it("calls M5.begin() to initialise hardware", () => {
      const result = wrapM5StickCode("");

      expect(result).toContain("M5.begin()");
    });

    it("includes the shake_detected helper function", () => {
      const result = wrapM5StickCode("");

      expect(result).toContain("def shake_detected():");
      expect(result).toContain("global _last_accel");
      expect(result).toContain("Imu.getAccel()");
      expect(result).toContain("return diff > 1.5");
    });

    it("ends with the M5.update() main loop", () => {
      const result = wrapM5StickCode("");
      const lines = result.trimEnd().split("\n");
      const lastTwoLines = lines.slice(-2).map((l) => l.trimEnd());

      expect(lastTwoLines[0]).toBe("while True:");
      expect(lastTwoLines[1]).toBe("    M5.update()");
    });

    it("wraps user code between marker comments", () => {
      const result = wrapM5StickCode("Lcd.print('hi')");

      expect(result).toContain("# --- Your Code ---");
      expect(result).toContain("# --- End Your Code ---");
    });

    it("places user code after the start marker and before the end marker", () => {
      const code = "Lcd.print('hello')";
      const result = wrapM5StickCode(code);
      const startIdx = result.indexOf("# --- Your Code ---");
      const codeIdx = result.indexOf(code);
      const endIdx = result.indexOf("# --- End Your Code ---");

      expect(startIdx).toBeLessThan(codeIdx);
      expect(codeIdx).toBeLessThan(endIdx);
    });

    it("places M5.begin() before user code", () => {
      const code = "Lcd.print('hello')";
      const result = wrapM5StickCode(code);
      const beginIdx = result.indexOf("M5.begin()");
      const codeIdx = result.indexOf(code);

      expect(beginIdx).toBeLessThan(codeIdx);
    });

    it("places user code before the main loop", () => {
      const code = "Speaker.tone(440, 200)";
      const result = wrapM5StickCode(code);
      const codeIdx = result.indexOf(code);
      const loopIdx = result.indexOf("while True:");

      expect(codeIdx).toBeLessThan(loopIdx);
    });
  });

  // ---------------------------------------------------------------
  // Empty code input produces valid wrapper
  // ---------------------------------------------------------------

  describe("empty input", () => {
    it("returns a valid program for an empty string", () => {
      const result = wrapM5StickCode("");

      expect(result).toContain("import M5");
      expect(result).toContain("M5.begin()");
      expect(result).toContain("# --- Your Code ---");
      expect(result).toContain("# --- End Your Code ---");
      expect(result).toContain("while True:");
      expect(result).toContain("    M5.update()");
    });

    it("returns a valid program for whitespace-only input", () => {
      const result = wrapM5StickCode("   \n\n  \t  ");

      expect(result).toContain("import M5");
      expect(result).toContain("M5.begin()");
      expect(result).toContain("while True:");
    });

    it("trims trailing whitespace from user code", () => {
      const result = wrapM5StickCode("print('hello')   \n\n\n");

      const lines = result.split("\n");
      const startMarkerIdx = lines.findIndex((l) =>
        l.includes("# --- Your Code ---"),
      );
      const endMarkerIdx = lines.findIndex((l) =>
        l.includes("# --- End Your Code ---"),
      );

      const codeSection = lines.slice(startMarkerIdx + 1, endMarkerIdx);
      const nonEmptyLines = codeSection.filter((l) => l.trim() !== "");
      expect(nonEmptyLines).toHaveLength(1);
      expect(nonEmptyLines[0].trim()).toBe("print('hello')");
    });
  });

  // ---------------------------------------------------------------
  // Code with existing imports doesn't duplicate them
  // ---------------------------------------------------------------

  describe("user code with existing imports", () => {
    it("preserves user import statements in the code section", () => {
      const code = "import time\ntime.sleep(1)";
      const result = wrapM5StickCode(code);

      // The user's import time should appear in the user code section
      const userSection = extractUserCode(result);
      expect(userSection).toContain("import time");
    });

    it("still includes boilerplate imports even when user code has them", () => {
      const code =
        "import M5\nfrom M5 import *\nimport time\nLcd.print('hi')";
      const result = wrapM5StickCode(code);

      // Boilerplate imports appear before the user code section
      const beforeUserCode = result.split("# --- Your Code ---")[0];
      expect(beforeUserCode).toContain("import M5");
      expect(beforeUserCode).toContain("from M5 import *");
      expect(beforeUserCode).toContain("import time");
    });

    it("does not mangle user from-imports for other modules", () => {
      const code = "from machine import Pin\nPin(26).value(1)";
      const result = wrapM5StickCode(code);
      const userSection = extractUserCode(result);

      expect(userSection).toContain("from machine import Pin");
      expect(userSection).toContain("Pin(26).value(1)");
    });

    it("handles user code that re-imports random", () => {
      const code = "import random\nx = random.randint(1, 6)";
      const result = wrapM5StickCode(code);

      // Boilerplate has import random
      const beforeUserCode = result.split("# --- Your Code ---")[0];
      expect(beforeUserCode).toContain("import random");

      // User code also has it and that is fine
      const userSection = extractUserCode(result);
      expect(userSection).toContain("import random");
      expect(userSection).toContain("x = random.randint(1, 6)");
    });
  });

  // ---------------------------------------------------------------
  // Special characters in code are preserved
  // ---------------------------------------------------------------

  describe("special characters preservation", () => {
    it("preserves single quotes in strings", () => {
      const code = "Lcd.print('Hello, World!')";
      const result = wrapM5StickCode(code);

      expect(result).toContain("Lcd.print('Hello, World!')");
    });

    it("preserves double quotes in strings", () => {
      const code = 'Lcd.print("Hello, World!")';
      const result = wrapM5StickCode(code);

      expect(result).toContain('Lcd.print("Hello, World!")');
    });

    it("preserves backslashes and escape sequences", () => {
      const code = "Lcd.print('line1\\nline2')";
      const result = wrapM5StickCode(code);

      expect(result).toContain("Lcd.print('line1\\nline2')");
    });

    it("preserves Unicode characters", () => {
      const code = "Lcd.print('\u2605 Star \u2764 Heart')";
      const result = wrapM5StickCode(code);

      expect(result).toContain("\u2605 Star \u2764 Heart");
    });

    it("preserves f-string syntax (dollar-brace-like in Python)", () => {
      const code = "x = f'{value}'";
      const result = wrapM5StickCode(code);

      expect(result).toContain("x = f'{value}'");
    });

    it("preserves Python indentation with spaces", () => {
      const code =
        "if True:\n    Lcd.print('yes')\n    Speaker.tone(440, 200)";
      const result = wrapM5StickCode(code);
      const userSection = extractUserCode(result);

      expect(userSection).toContain("    Lcd.print('yes')");
      expect(userSection).toContain("    Speaker.tone(440, 200)");
    });

    it("preserves triple-quoted multi-line strings", () => {
      const code = 'msg = """Hello\nWorld"""';
      const result = wrapM5StickCode(code);

      expect(result).toContain('msg = """Hello\nWorld"""');
    });

    it("preserves Python comments", () => {
      const code = "# This is a comment\nx = 42  # inline comment";
      const result = wrapM5StickCode(code);
      const userSection = extractUserCode(result);

      expect(userSection).toContain("# This is a comment");
      expect(userSection).toContain("x = 42  # inline comment");
    });

    it("preserves tab characters inside strings", () => {
      const code = "Lcd.print('col1\\tcol2')";
      const result = wrapM5StickCode(code);

      expect(result).toContain("Lcd.print('col1\\tcol2')");
    });

    it("preserves bitwise and comparison operators", () => {
      const code = "x = (a & 0xFF) | (b << 8)\ny = a >= b and c != d";
      const result = wrapM5StickCode(code);
      const userSection = extractUserCode(result);

      expect(userSection).toContain("x = (a & 0xFF) | (b << 8)");
      expect(userSection).toContain("y = a >= b and c != d");
    });
  });

  // ---------------------------------------------------------------
  // Output is valid Python (basic structural checks)
  // ---------------------------------------------------------------

  describe("valid Python structure", () => {
    it("starts with imports on the very first line", () => {
      const result = wrapM5StickCode("pass");
      const firstLine = result.split("\n")[0];

      expect(firstLine).toBe("import os, sys, io");
    });

    it("has no blank line between while True: and its body", () => {
      const result = wrapM5StickCode("x = 1");
      const loopSection = result.slice(result.indexOf("while True:"));
      const loopLines = loopSection.trimEnd().split("\n");

      expect(loopLines[0]).toBe("while True:");
      expect(loopLines[1]).toBe("    M5.update()");
    });

    it("uses consistent 4-space indentation in generated code", () => {
      const result = wrapM5StickCode("");

      // Main loop body
      expect(result).toContain("    M5.update()");

      // shake_detected function body
      expect(result).toContain("    global _last_accel");
      expect(result).toContain("    a = Imu.getAccel()");
      expect(result).toContain("    _last_accel = a");
      expect(result).toContain("    return diff > 1.5");
    });

    it("produces identical boilerplate regardless of user code content", () => {
      const result1 = wrapM5StickCode("x = 1");
      const result2 = wrapM5StickCode("Lcd.print('hello')");

      const boilerplateBefore1 = result1.split("# --- Your Code ---")[0];
      const boilerplateBefore2 = result2.split("# --- Your Code ---")[0];
      const boilerplateAfter1 = result1.split("# --- End Your Code ---")[1];
      const boilerplateAfter2 = result2.split("# --- End Your Code ---")[1];

      expect(boilerplateBefore1).toBe(boilerplateBefore2);
      expect(boilerplateAfter1).toBe(boilerplateAfter2);
    });

    it("contains exactly one M5.begin() call in the boilerplate", () => {
      const result = wrapM5StickCode("");
      const boilerplate = result.split("# --- Your Code ---")[0];
      const matches = boilerplate.match(/M5\.begin\(\)/g);

      expect(matches).toHaveLength(1);
    });

    it("contains exactly one main loop", () => {
      const result = wrapM5StickCode("x = 1");
      const matches = result.match(/^while True:$/gm);

      expect(matches).toHaveLength(1);
    });

    it("last non-empty line is M5.update()", () => {
      const result = wrapM5StickCode("pass");
      const lines = result.split("\n").filter((l) => l.trim() !== "");

      expect(lines[lines.length - 1].trim()).toBe("M5.update()");
    });

    it("does not contain any tab-indented boilerplate lines", () => {
      const result = wrapM5StickCode("");
      const boilerplateLines = result.split("\n");

      for (const line of boilerplateLines) {
        // Lines that are indented should use spaces, not tabs
        if (line.length > 0 && line !== line.trimStart()) {
          expect(line).not.toMatch(/^\t/);
        }
      }
    });
  });

  // ---------------------------------------------------------------
  // Multi-line and complex user code
  // ---------------------------------------------------------------

  describe("multi-line and complex user code", () => {
    it("handles multi-line code", () => {
      const multiLine = [
        "Lcd.fillScreen(0x000000)",
        'Lcd.print("Hello", 10, 20)',
        "Speaker.tone(440, 500)",
        "time.sleep(1)",
      ].join("\n");

      const result = wrapM5StickCode(multiLine);

      expect(result).toContain("Lcd.fillScreen(0x000000)");
      expect(result).toContain('Lcd.print("Hello", 10, 20)');
      expect(result).toContain("Speaker.tone(440, 500)");
      expect(result).toContain("time.sleep(1)");
    });

    it("preserves deeply nested indentation", () => {
      const code = [
        "if True:",
        '    print("yes")',
        "    for i in range(5):",
        "        print(i)",
      ].join("\n");

      const result = wrapM5StickCode(code);

      expect(result).toContain('    print("yes")');
      expect(result).toContain("    for i in range(5):");
      expect(result).toContain("        print(i)");
    });

    it("wraps a realistic LED blink program", () => {
      const code = [
        "Power.setLed(100)",
        "time.sleep(0.5)",
        "Power.setLed(0)",
        "time.sleep(0.5)",
      ].join("\n");

      const result = wrapM5StickCode(code);
      const userSection = extractUserCode(result);

      expect(userSection).toContain("Power.setLed(100)");
      expect(userSection).toContain("time.sleep(0.5)");
      expect(userSection).toContain("Power.setLed(0)");
    });

    it("wraps code that uses the shake_detected helper", () => {
      const code = [
        "if shake_detected():",
        "    Speaker.tone(440, 200)",
        "    Lcd.print('Shake!', 10, 50)",
      ].join("\n");

      const result = wrapM5StickCode(code);

      // The helper definition should appear before user code
      const helperIdx = result.indexOf("def shake_detected():");
      const usageIdx = result.indexOf("if shake_detected():");
      expect(helperIdx).toBeLessThan(usageIdx);
    });
  });

  // ---------------------------------------------------------------
  // Return type and determinism
  // ---------------------------------------------------------------

  describe("return value", () => {
    it("returns a string", () => {
      const result = wrapM5StickCode("x = 1");

      expect(typeof result).toBe("string");
    });

    it("returns identical output for identical input", () => {
      const code = "Lcd.print('deterministic')";
      const result1 = wrapM5StickCode(code);
      const result2 = wrapM5StickCode(code);

      expect(result1).toBe(result2);
    });
  });
});
