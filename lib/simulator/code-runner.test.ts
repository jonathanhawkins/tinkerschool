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

  describe("run()", () => {
    it("parses M5.Lcd.fillScreen and calls sim.clear()", async () => {
      await runner.run('M5.Lcd.fillScreen(M5.Lcd.WHITE)');

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
      // A while True loop with a single drawString call
      const code = `while True:
    M5.Lcd.drawString("loop", 0, 0)`;

      await runner.run(code);

      // The loop should have been capped at 200 iterations
      expect(mockSim.drawString).toHaveBeenCalledTimes(200);
    });

    it("caps for-range loops at MAX_LOOP_ITERATIONS", async () => {
      const code = `for i in range(999):
    M5.Lcd.drawString("loop", 0, 0)`;

      await runner.run(code);

      // Capped at 200 iterations even though range(999) was requested
      expect(mockSim.drawString).toHaveBeenCalledTimes(200);
    });

    it("respects for-range count when below the cap", async () => {
      const code = `for i in range(3):
    M5.Lcd.drawString("loop", 0, 0)`;

      await runner.run(code);

      expect(mockSim.drawString).toHaveBeenCalledTimes(3);
    });
  });
});
