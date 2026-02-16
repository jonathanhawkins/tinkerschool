import { describe, it, expect, vi, beforeEach } from "vitest";
import { M5StickSimulator } from "./m5stick-simulator";

// ---------------------------------------------------------------------------
// Mock Canvas 2D context
// ---------------------------------------------------------------------------

function createMockCanvas() {
  const ctx = {
    fillStyle: "",
    strokeStyle: "",
    font: "",
    textBaseline: "",
    lineWidth: 0,
    imageSmoothingEnabled: true,
    scale: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
  };

  const canvas = {
    width: 0,
    height: 0,
    style: { width: "", height: "" },
    getContext: vi.fn().mockReturnValue(ctx),
  } as unknown as HTMLCanvasElement;

  return { canvas, ctx };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("M5StickSimulator", () => {
  let sim: M5StickSimulator;
  let ctx: ReturnType<typeof createMockCanvas>["ctx"];

  beforeEach(() => {
    const mock = createMockCanvas();
    ctx = mock.ctx;
    sim = new M5StickSimulator(mock.canvas);
  });

  describe("constructor", () => {
    it("sets canvas dimensions based on device resolution", () => {
      // WIDTH=135, HEIGHT=240, dpr=1 in jsdom
      const mock = createMockCanvas();
      new M5StickSimulator(mock.canvas);
      expect(mock.canvas.width).toBe(135);
      expect(mock.canvas.height).toBe(240);
    });

    it("throws when canvas context is null", () => {
      const badCanvas = {
        width: 0,
        height: 0,
        style: { width: "", height: "" },
        getContext: vi.fn().mockReturnValue(null),
      } as unknown as HTMLCanvasElement;

      expect(() => new M5StickSimulator(badCanvas)).toThrow(
        "Failed to get 2D rendering context",
      );
    });

    it("clears to black on init", () => {
      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 135, 240);
      expect(ctx.fillStyle).toBe("#000000");
    });
  });

  describe("clear", () => {
    it("fills the entire display with the given color", () => {
      sim.clear("#FF0000");
      expect(ctx.fillStyle).toBe("#FF0000");
      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 135, 240);
    });

    it("uses background color when no color given", () => {
      sim.setBackground("#00FF00");
      sim.clear();
      expect(ctx.fillStyle).toBe("#00FF00");
    });
  });

  describe("drawString", () => {
    it("draws text at the specified position", () => {
      sim.drawString("Hello", 10, 20);
      expect(ctx.fillText).toHaveBeenCalledWith("Hello", 10, 20);
      expect(ctx.textBaseline).toBe("top");
    });

    it("uses the provided color", () => {
      sim.drawString("Hi", 0, 0, "#FF0000");
      expect(ctx.fillStyle).toBe("#FF0000");
    });

    it("tracks drawn text for output snapshot", () => {
      sim.drawString("ABC", 0, 0);
      sim.drawString("DEF", 0, 20);
      const output = sim.getOutputSnapshot();
      expect(output.texts).toContain("ABC");
      expect(output.texts).toContain("DEF");
    });
  });

  describe("drawRect", () => {
    it("draws a filled rectangle", () => {
      sim.drawRect(10, 20, 50, 30, "#FF0000", true);
      expect(ctx.fillRect).toHaveBeenCalledWith(10, 20, 50, 30);
    });

    it("draws a stroked rectangle when fill=false", () => {
      sim.drawRect(10, 20, 50, 30, "#FF0000", false);
      expect(ctx.strokeRect).toHaveBeenCalled();
    });
  });

  describe("drawCircle", () => {
    it("draws a filled circle", () => {
      sim.drawCircle(50, 50, 20, "#0000FF", true);
      expect(ctx.arc).toHaveBeenCalledWith(50, 50, 20, 0, Math.PI * 2);
      expect(ctx.fill).toHaveBeenCalled();
    });

    it("draws a stroked circle when fill=false", () => {
      sim.drawCircle(50, 50, 20, "#0000FF", false);
      expect(ctx.stroke).toHaveBeenCalled();
    });
  });

  describe("drawPixel", () => {
    it("draws a 1x1 filled rect", () => {
      sim.drawPixel(10, 20, "#FFFFFF");
      expect(ctx.fillRect).toHaveBeenCalledWith(10, 20, 1, 1);
    });
  });

  describe("drawLine", () => {
    it("draws a line between two points", () => {
      sim.drawLine(0, 0, 100, 100, "#FFFFFF");
      expect(ctx.moveTo).toHaveBeenCalled();
      expect(ctx.lineTo).toHaveBeenCalled();
      expect(ctx.stroke).toHaveBeenCalled();
    });
  });

  describe("setTextSize", () => {
    it("clamps text size between 1 and 7", () => {
      sim.setTextSize(0);
      sim.drawString("test", 0, 0);
      // Size 1 * 12 = 12px
      expect(ctx.font).toBe("12px monospace");

      sim.setTextSize(3);
      sim.drawString("test", 0, 0);
      expect(ctx.font).toBe("36px monospace");
    });
  });

  describe("output tracking", () => {
    it("deduplicates drawn texts in snapshot", () => {
      sim.drawString("Hello", 0, 0);
      sim.drawString("Hello", 0, 20);
      const output = sim.getOutputSnapshot();
      expect(output.texts).toEqual(["Hello"]);
    });

    it("tracks buzzer usage", () => {
      expect(sim.getOutputSnapshot().hasBuzzer).toBe(false);
      sim.markBuzzerUsed();
      expect(sim.getOutputSnapshot().hasBuzzer).toBe(true);
    });

    it("clears output log", () => {
      sim.drawString("Test", 0, 0);
      sim.markBuzzerUsed();
      sim.clearOutputLog();
      const output = sim.getOutputSnapshot();
      expect(output.texts).toEqual([]);
      expect(output.hasBuzzer).toBe(false);
    });
  });

  describe("resolveColor", () => {
    it("resolves named color constants", () => {
      expect(M5StickSimulator.resolveColor("WHITE")).toBe("#FFFFFF");
      expect(M5StickSimulator.resolveColor("RED")).toBe("#FF0000");
      expect(M5StickSimulator.resolveColor("BLACK")).toBe("#000000");
    });

    it("is case insensitive for named colors", () => {
      expect(M5StickSimulator.resolveColor("white")).toBe("#FFFFFF");
      expect(M5StickSimulator.resolveColor("Red")).toBe("#FF0000");
    });

    it("passes through CSS hex colors", () => {
      expect(M5StickSimulator.resolveColor("#FF00FF")).toBe("#FF00FF");
    });

    it("passes through rgb() colors", () => {
      expect(M5StickSimulator.resolveColor("rgb(255,0,0)")).toBe("rgb(255,0,0)");
    });

    it("returns white as fallback for unknown strings", () => {
      expect(M5StickSimulator.resolveColor("unknown")).toBe("#FFFFFF");
    });
  });
});
