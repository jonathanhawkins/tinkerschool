import { describe, it, expect, vi, beforeEach } from "vitest";

import type { M5StickSimulator } from "./m5stick-simulator";
import { SimulatorCodeRunner } from "./code-runner";

// ---------------------------------------------------------------------------
// Mock the M5StickSimulator dependency.
// The code-runner imports M5StickSimulator.resolveColor as a static method,
// so we mock the entire module.
// ---------------------------------------------------------------------------

vi.mock("./m5stick-simulator", () => {
  const resolveColor = vi.fn((value: string | number): string => {
    if (typeof value === "number") return "#FFFFFF";
    const upper = String(value).toUpperCase().trim();
    const map: Record<string, string> = {
      WHITE: "#FFFFFF",
      BLACK: "#000000",
      RED: "#FF0000",
      GREEN: "#00FF00",
      BLUE: "#0000FF",
    };
    if (upper in map) return map[upper];
    if (upper.startsWith("0X")) return "#FFFFFF";
    return "#FFFFFF";
  });

  return {
    M5StickSimulator: {
      resolveColor,
      WIDTH: 135,
      HEIGHT: 240,
    },
  };
});

/**
 * Creates a mock object that satisfies the M5StickSimulator interface
 * expected by SimulatorCodeRunner.
 */
function createMockSimulator() {
  return {
    clear: vi.fn(),
    drawString: vi.fn(),
    drawRect: vi.fn(),
    drawCircle: vi.fn(),
    drawLine: vi.fn(),
    drawPixel: vi.fn(),
    setTextColor: vi.fn(),
    setTextSize: vi.fn(),
    setBackground: vi.fn(),
    getCanvas: vi.fn(),
    getBackgroundColor: vi.fn(() => "#000000"),
  };
}

describe("SimulatorCodeRunner", () => {
  let mockSim: ReturnType<typeof createMockSimulator>;
  let runner: SimulatorCodeRunner;

  beforeEach(() => {
    mockSim = createMockSimulator();
    runner = new SimulatorCodeRunner(mockSim as unknown as M5StickSimulator);
  });

  it("starts in a non-running state", () => {
    expect(runner.isRunning).toBe(false);
  });

  // =========================================================================
  // Basic API call parsing (backward compatibility)
  // =========================================================================

  describe("run()", () => {
    it("parses M5.Lcd.fillScreen and calls sim.clear()", async () => {
      await runner.run("M5.Lcd.fillScreen(M5.Lcd.WHITE)");

      expect(mockSim.clear).toHaveBeenCalled();
    });

    it('parses M5.Lcd.drawString("Hello", 10, 20) and calls sim.drawString()', async () => {
      await runner.run('M5.Lcd.drawString("Hello", 10, 20)');

      expect(mockSim.drawString).toHaveBeenCalledWith(
        "Hello",
        10,
        20,
        undefined
      );
    });

    it("parses M5.Lcd.drawString with color argument", async () => {
      await runner.run('M5.Lcd.drawString("Hi", 5, 10, M5.Lcd.RED)');

      expect(mockSim.drawString).toHaveBeenCalledWith(
        "Hi",
        5,
        10,
        expect.any(String)
      );
    });

    it("parses M5.Lcd.fillRect and calls sim.drawRect with fill=true", async () => {
      await runner.run("M5.Lcd.fillRect(10, 20, 30, 40)");

      expect(mockSim.drawRect).toHaveBeenCalledWith(
        10,
        20,
        30,
        40,
        undefined,
        true
      );
    });

    it("parses M5.Lcd.drawRect and calls sim.drawRect with fill=false", async () => {
      await runner.run("M5.Lcd.drawRect(10, 20, 30, 40)");

      expect(mockSim.drawRect).toHaveBeenCalledWith(
        10,
        20,
        30,
        40,
        undefined,
        false
      );
    });

    it("parses M5.Lcd.fillCircle and calls sim.drawCircle with fill=true", async () => {
      await runner.run("M5.Lcd.fillCircle(60, 120, 25)");

      expect(mockSim.drawCircle).toHaveBeenCalledWith(
        60,
        120,
        25,
        undefined,
        true
      );
    });

    it("parses M5.Lcd.drawCircle and calls sim.drawCircle with fill=false", async () => {
      await runner.run("M5.Lcd.drawCircle(60, 120, 25)");

      expect(mockSim.drawCircle).toHaveBeenCalledWith(
        60,
        120,
        25,
        undefined,
        false
      );
    });

    it("parses M5.Lcd.drawLine and calls sim.drawLine", async () => {
      await runner.run("M5.Lcd.drawLine(0, 0, 135, 240)");

      expect(mockSim.drawLine).toHaveBeenCalledWith(
        0,
        0,
        135,
        240,
        undefined
      );
    });

    it("parses M5.Lcd.drawPixel and calls sim.drawPixel", async () => {
      await runner.run("M5.Lcd.drawPixel(50, 100)");

      expect(mockSim.drawPixel).toHaveBeenCalledWith(50, 100, undefined);
    });

    it("parses M5.Lcd.setTextColor and calls sim.setTextColor", async () => {
      await runner.run("M5.Lcd.setTextColor(M5.Lcd.RED)");

      expect(mockSim.setTextColor).toHaveBeenCalled();
    });

    it("parses M5.Lcd.setTextSize and calls sim.setTextSize", async () => {
      await runner.run("M5.Lcd.setTextSize(2)");

      expect(mockSim.setTextSize).toHaveBeenCalledWith(2);
    });

    it("skips unrecognized lines without errors", async () => {
      await runner.run(`import M5
from M5 import *
M5.begin()
# This is a comment
some_unknown_call()
M5.Lcd.fillScreen(M5.Lcd.BLACK)`);

      // Only fillScreen should have been recognized
      expect(mockSim.clear).toHaveBeenCalledTimes(1);
    });

    it("skips empty lines and comments", async () => {
      await runner.run(`
# A comment

M5.Lcd.fillScreen(M5.Lcd.WHITE)

# Another comment
`);

      expect(mockSim.clear).toHaveBeenCalledTimes(1);
    });

    it("handles multiple commands in sequence", async () => {
      await runner.run(`M5.Lcd.fillScreen(M5.Lcd.BLACK)
M5.Lcd.drawString("A", 1, 2)
M5.Lcd.drawString("B", 3, 4)`);

      expect(mockSim.clear).toHaveBeenCalledTimes(1);
      expect(mockSim.drawString).toHaveBeenCalledTimes(2);
    });

    it("fires onTone callback for Speaker.tone commands", async () => {
      const onTone = vi.fn();
      runner.onTone = onTone;

      await runner.run("M5.Speaker.tone(440, 500)");

      expect(onTone).toHaveBeenCalledWith(440, 500);
    });

    it("fires onLed callback for Power.setLed commands", async () => {
      const onLed = vi.fn();
      runner.onLed = onLed;

      await runner.run("Power.setLed(255)");

      expect(onLed).toHaveBeenCalledWith(255);
    });

    it("fires onLed with 0 to turn LED off", async () => {
      const onLed = vi.fn();
      runner.onLed = onLed;

      await runner.run("Power.setLed(0)");

      expect(onLed).toHaveBeenCalledWith(0);
    });

    it("handles UIFlow2 style calls without M5. prefix", async () => {
      await runner.run("Lcd.fillScreen(0x000000)");
      expect(mockSim.clear).toHaveBeenCalledTimes(1);

      await runner.run("Speaker.tone(440, 500)");
      // No error thrown

      await runner.run('Lcd.drawString("test", 0, 0)');
      expect(mockSim.drawString).toHaveBeenCalled();
    });

    it("handles time.sleep and time.sleep_ms", async () => {
      // These should not throw - they just cause a delay
      await runner.run("time.sleep(0.1)");
      await runner.run("time.sleep_ms(50)");
    });
  });

  describe("stop()", () => {
    it("sets isRunning to false", () => {
      runner.stop();
      expect(runner.isRunning).toBe(false);
    });

    it("is safe to call when not running", () => {
      expect(() => runner.stop()).not.toThrow();
    });
  });

  describe("loop iteration capping", () => {
    it("caps while True loops at MAX_LOOP_ITERATIONS", async () => {
      const code = `while True:
    M5.Lcd.drawString("loop", 0, 0)`;

      await runner.run(code);

      expect(mockSim.drawString).toHaveBeenCalledTimes(200);
    });

    it("caps for-range loops at MAX_LOOP_ITERATIONS", async () => {
      const code = `for i in range(999):
    M5.Lcd.drawString("loop", 0, 0)`;

      await runner.run(code);

      expect(mockSim.drawString).toHaveBeenCalledTimes(200);
    });

    it("respects for-range count when below the cap", async () => {
      const code = `for i in range(3):
    M5.Lcd.drawString("loop", 0, 0)`;

      await runner.run(code);

      expect(mockSim.drawString).toHaveBeenCalledTimes(3);
    });
  });

  // =========================================================================
  // Variable support
  // =========================================================================

  describe("variables", () => {
    it("stores and retrieves variables", async () => {
      await runner.run(`x = 42
Lcd.drawString(str(x), 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith("42", 0, 0, undefined);
    });

    it("updates variables", async () => {
      await runner.run(`score = 0
score = 10
Lcd.drawString(str(score), 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith("10", 0, 0, undefined);
    });

    it("handles variable arithmetic", async () => {
      await runner.run(`score = 5
score = score + 3
Lcd.drawString(str(score), 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith("8", 0, 0, undefined);
    });

    it("handles variable subtraction", async () => {
      await runner.run(`x = 10
x = x - 3
Lcd.drawString(str(x), 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith("7", 0, 0, undefined);
    });

    it("handles variable multiplication", async () => {
      await runner.run(`x = 4
x = x * 3
Lcd.drawString(str(x), 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith("12", 0, 0, undefined);
    });

    it("handles integer division", async () => {
      await runner.run(`x = 7
x = x // 2
Lcd.drawString(str(x), 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith("3", 0, 0, undefined);
    });

    it("handles modulo", async () => {
      await runner.run(`x = 7
x = x % 3
Lcd.drawString(str(x), 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith("1", 0, 0, undefined);
    });

    it("uses variables as API call arguments", async () => {
      await runner.run(`x = 10
y = 20
Lcd.fillRect(x, y, 30, 40)`);

      expect(mockSim.drawRect).toHaveBeenCalledWith(
        10,
        20,
        30,
        40,
        undefined,
        true
      );
    });

    it("resets variables between runs", async () => {
      await runner.run(`score = 100`);

      // Second run should not see the variable
      await runner.run(`Lcd.drawString(str(score), 0, 0)`);
      expect(mockSim.drawString).toHaveBeenCalledWith("0", 0, 0, undefined);
    });

    it("handles string variables", async () => {
      await runner.run(`msg = "Hello!"
Lcd.drawString(msg, 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith(
        "Hello!",
        0,
        0,
        undefined
      );
    });

    it("handles boolean variables", async () => {
      await runner.run(`flag = True
Lcd.drawString(str(flag), 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith(
        "true",
        0,
        0,
        undefined
      );
    });
  });

  // =========================================================================
  // Expression evaluator
  // =========================================================================

  describe("expression evaluator", () => {
    it("evaluates number literals", () => {
      expect(runner.evaluate("42")).toBe(42);
      expect(runner.evaluate("3.14")).toBe(3.14);
      expect(runner.evaluate("-5")).toBe(-5);
    });

    it("evaluates string literals", () => {
      expect(runner.evaluate('"hello"')).toBe("hello");
      expect(runner.evaluate("'world'")).toBe("world");
    });

    it("evaluates boolean literals", () => {
      expect(runner.evaluate("True")).toBe(true);
      expect(runner.evaluate("False")).toBe(false);
    });

    it("evaluates str() conversion", () => {
      expect(runner.evaluate("str(42)")).toBe("42");
      expect(runner.evaluate("str(True)")).toBe("true");
    });

    it("evaluates int() conversion", () => {
      expect(runner.evaluate("int(3.7)")).toBe(3);
    });

    it("evaluates abs()", () => {
      expect(runner.evaluate("abs(-5)")).toBe(5);
      expect(runner.evaluate("abs(3)")).toBe(3);
    });

    it("evaluates parenthesized expressions", () => {
      expect(runner.evaluate("(3 + 4)")).toBe(7);
      expect(runner.evaluate("(2 * (3 + 1))")).toBe(8);
    });

    it("evaluates comparison operators", () => {
      expect(runner.evaluate("5 > 3")).toBe(true);
      expect(runner.evaluate("5 < 3")).toBe(false);
      expect(runner.evaluate("5 >= 5")).toBe(true);
      expect(runner.evaluate("5 <= 4")).toBe(false);
      expect(runner.evaluate("5 == 5")).toBe(true);
      expect(runner.evaluate("5 != 5")).toBe(false);
    });

    it("evaluates boolean operators", () => {
      expect(runner.evaluate("True and False")).toBe(false);
      expect(runner.evaluate("True or False")).toBe(true);
      expect(runner.evaluate("not True")).toBe(false);
      expect(runner.evaluate("not False")).toBe(true);
    });

    it("evaluates random.randint returns number in range", () => {
      const result = runner.evaluate("random.randint(1, 6)");
      expect(typeof result).toBe("number");
      expect(result as number).toBeGreaterThanOrEqual(1);
      expect(result as number).toBeLessThanOrEqual(6);
    });

    it("evaluates string concatenation with +", () => {
      expect(runner.evaluate('"hello" + " world"')).toBe("hello world");
    });

    it("evaluates operator precedence correctly", () => {
      // 2 + 3 * 4 should be 14 (not 20)
      expect(runner.evaluate("2 + 3 * 4")).toBe(14);
    });

    it("evaluates left-to-right associativity for subtraction", () => {
      // 10 - 3 - 2 should be 5 (not 9)
      expect(runner.evaluate("10 - 3 - 2")).toBe(5);
    });

    it("returns 0 for unknown variables", () => {
      expect(runner.evaluate("unknown_var")).toBe(0);
    });

    it("passes through hex color constants", () => {
      expect(runner.evaluate("0xFFFF")).toBe("0xFFFF");
      expect(runner.evaluate("0x000000")).toBe("0x000000");
    });
  });

  // =========================================================================
  // Conditionals (if/elif/else)
  // =========================================================================

  describe("conditionals", () => {
    it("executes if branch when condition is true", async () => {
      await runner.run(`x = 10
if x > 5:
    Lcd.drawString("big", 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith(
        "big",
        0,
        0,
        undefined
      );
    });

    it("skips if branch when condition is false", async () => {
      await runner.run(`x = 3
if x > 5:
    Lcd.drawString("big", 0, 0)`);

      expect(mockSim.drawString).not.toHaveBeenCalled();
    });

    it("handles if/else", async () => {
      await runner.run(`x = 3
if x > 5:
    Lcd.drawString("big", 0, 0)
else:
    Lcd.drawString("small", 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith(
        "small",
        0,
        0,
        undefined
      );
    });

    it("handles if/elif/else chain", async () => {
      await runner.run(`x = 5
if x > 10:
    Lcd.drawString("big", 0, 0)
elif x > 3:
    Lcd.drawString("medium", 0, 0)
else:
    Lcd.drawString("small", 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith(
        "medium",
        0,
        0,
        undefined
      );
    });

    it("only executes the first matching branch", async () => {
      await runner.run(`x = 10
if x > 5:
    Lcd.drawString("first", 0, 0)
elif x > 3:
    Lcd.drawString("second", 0, 0)
else:
    Lcd.drawString("third", 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledTimes(1);
      expect(mockSim.drawString).toHaveBeenCalledWith(
        "first",
        0,
        0,
        undefined
      );
    });

    it("handles if inside a loop", async () => {
      await runner.run(`for i in range(4):
    if i == 2:
        Lcd.drawString("found", 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledTimes(1);
      expect(mockSim.drawString).toHaveBeenCalledWith(
        "found",
        0,
        0,
        undefined
      );
    });

    it("handles boolean condition (True/False)", async () => {
      await runner.run(`if True:
    Lcd.drawString("yes", 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith(
        "yes",
        0,
        0,
        undefined
      );
    });

    it("handles compound conditions with and/or", async () => {
      await runner.run(`x = 5
y = 10
if x > 3 and y > 8:
    Lcd.drawString("both", 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith(
        "both",
        0,
        0,
        undefined
      );
    });

    it("continues execution after conditional block", async () => {
      await runner.run(`if True:
    Lcd.drawString("inside", 0, 0)
Lcd.drawString("after", 0, 10)`);

      expect(mockSim.drawString).toHaveBeenCalledTimes(2);
    });
  });

  // =========================================================================
  // For-range with loop variable
  // =========================================================================

  describe("for-range with loop variable", () => {
    it("sets the loop variable on each iteration", async () => {
      await runner.run(`for i in range(3):
    Lcd.drawString(str(i), 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledTimes(3);
      expect(mockSim.drawString).toHaveBeenNthCalledWith(
        1,
        "0",
        0,
        0,
        undefined
      );
      expect(mockSim.drawString).toHaveBeenNthCalledWith(
        2,
        "1",
        0,
        0,
        undefined
      );
      expect(mockSim.drawString).toHaveBeenNthCalledWith(
        3,
        "2",
        0,
        0,
        undefined
      );
    });

    it("uses loop variable in expressions", async () => {
      await runner.run(`for i in range(3):
    Lcd.fillRect(0, i * 20, 50, 15)`);

      expect(mockSim.drawRect).toHaveBeenCalledTimes(3);
      expect(mockSim.drawRect).toHaveBeenNthCalledWith(
        1,
        0,
        0,
        50,
        15,
        undefined,
        true
      );
      expect(mockSim.drawRect).toHaveBeenNthCalledWith(
        2,
        0,
        20,
        50,
        15,
        undefined,
        true
      );
      expect(mockSim.drawRect).toHaveBeenNthCalledWith(
        3,
        0,
        40,
        50,
        15,
        undefined,
        true
      );
    });

    it("handles conditional inside for-range using loop variable", async () => {
      await runner.run(`for i in range(5):
    if i % 2 == 0:
        Lcd.drawString("even", 0, 0)`);

      // i=0 (even), i=1 (odd), i=2 (even), i=3 (odd), i=4 (even)
      expect(mockSim.drawString).toHaveBeenCalledTimes(3);
    });
  });

  // =========================================================================
  // Button & IMU state
  // =========================================================================

  describe("button state", () => {
    it("BtnA.isPressed() returns false by default", async () => {
      await runner.run(`if BtnA.isPressed():
    Lcd.drawString("pressed", 0, 0)`);

      expect(mockSim.drawString).not.toHaveBeenCalled();
    });

    it("BtnA.isPressed() returns true when button is set", async () => {
      runner.setButtonState("a", true);

      await runner.run(`if BtnA.isPressed():
    Lcd.drawString("pressed", 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith(
        "pressed",
        0,
        0,
        undefined
      );
    });

    it("BtnB.isPressed() works independently", async () => {
      runner.setButtonState("b", true);

      await runner.run(`if BtnB.isPressed():
    Lcd.drawString("B pressed", 0, 0)
if BtnA.isPressed():
    Lcd.drawString("A pressed", 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledTimes(1);
      expect(mockSim.drawString).toHaveBeenCalledWith(
        "B pressed",
        0,
        0,
        undefined
      );
    });
  });

  describe("IMU state", () => {
    it("Imu.getAccel() returns 0 by default", async () => {
      await runner.run(`x = Imu.getAccel()[0]
Lcd.drawString(str(x), 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledWith("0", 0, 0, undefined);
    });

    it("returns set IMU values", async () => {
      runner.setImuValues(0.5, -0.3, 1.0);

      await runner.run(`x = Imu.getAccel()[0]
y = Imu.getAccel()[1]
z = Imu.getAccel()[2]
Lcd.drawString(str(x), 0, 0)
Lcd.drawString(str(y), 0, 20)
Lcd.drawString(str(z), 0, 40)`);

      expect(mockSim.drawString).toHaveBeenNthCalledWith(
        1,
        "0.5",
        0,
        0,
        undefined
      );
      expect(mockSim.drawString).toHaveBeenNthCalledWith(
        2,
        "-0.3",
        0,
        20,
        undefined
      );
      expect(mockSim.drawString).toHaveBeenNthCalledWith(
        3,
        "1",
        0,
        40,
        undefined
      );
    });
  });

  // =========================================================================
  // def block skipping
  // =========================================================================

  describe("def block skipping", () => {
    it("skips function definitions without executing their body", async () => {
      await runner.run(`def my_func():
    Lcd.drawString("should not run", 0, 0)

Lcd.drawString("should run", 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledTimes(1);
      expect(mockSim.drawString).toHaveBeenCalledWith(
        "should run",
        0,
        0,
        undefined
      );
    });

    it("skips the boilerplate shake_detected function", async () => {
      await runner.run(`_last_accel = (0, 0, 0)
def shake_detected():
    global _last_accel
    a = Imu.getAccel()
    diff = abs(a[0])
    _last_accel = a
    return diff > 1.5

Lcd.drawString("after def", 0, 0)`);

      expect(mockSim.drawString).toHaveBeenCalledTimes(1);
      expect(mockSim.drawString).toHaveBeenCalledWith(
        "after def",
        0,
        0,
        undefined
      );
    });
  });

  // =========================================================================
  // Realistic Blockly-generated code patterns
  // =========================================================================

  describe("realistic Blockly code patterns", () => {
    it("handles score counter pattern (m5_display_number block)", async () => {
      await runner.run(`score = 0
Lcd.fillScreen(0x000000)
score = score + 1
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString(str(score), 10, 20)`);

      expect(mockSim.clear).toHaveBeenCalled();
      expect(mockSim.setTextColor).toHaveBeenCalled();
      expect(mockSim.drawString).toHaveBeenCalledWith("1", 10, 20, undefined);
    });

    it("handles drawing with loop variables", async () => {
      // Pattern: draw multiple shapes using loop variable for position
      await runner.run(`Lcd.fillScreen(0x000000)
for i in range(5):
    Lcd.fillCircle(67, 30 + i * 40, 15, 0xFF0000)`);

      expect(mockSim.clear).toHaveBeenCalledTimes(1);
      expect(mockSim.drawCircle).toHaveBeenCalledTimes(5);
    });

    it("handles the full M5 boilerplate wrapper", async () => {
      // This is what wrap-m5stick.ts generates
      await runner.run(`import os, sys, io
import M5
from M5 import *
import time
import random

M5.begin()

_last_accel = (0, 0, 0)
def shake_detected():
    global _last_accel
    a = Imu.getAccel()
    diff = abs(a[0] - _last_accel[0]) + abs(a[1] - _last_accel[1]) + abs(a[2] - _last_accel[2])
    _last_accel = a
    return diff > 1.5

# --- Your Code ---
Lcd.fillScreen(0x000000)
Lcd.drawString("Hello!", 10, 20)

# --- End Your Code ---
while True:
    M5.update()`);

      expect(mockSim.clear).toHaveBeenCalledTimes(1);
      expect(mockSim.drawString).toHaveBeenCalledWith(
        "Hello!",
        10,
        20,
        undefined
      );
    });

    it("handles random number display pattern", async () => {
      await runner.run(`num = random.randint(1, 100)
Lcd.drawString(str(num), 0, 0)`);

      // We can't predict the random number, but drawString should be called
      // with a string representation of a number 1-100
      expect(mockSim.drawString).toHaveBeenCalledTimes(1);
      const text = mockSim.drawString.mock.calls[0][0];
      const num = parseInt(text, 10);
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(100);
    });
  });
});
