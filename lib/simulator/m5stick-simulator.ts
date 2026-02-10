import { M5_COLORS, M5_COLOR_VALUES } from "./types";
import type { SimulatorOutput } from "./types";

/**
 * M5StickSimulator - Browser-based canvas simulator for the M5StickC Plus 2 display.
 *
 * The M5StickC Plus 2 has a 1.14" TFT display at 135x240 pixels (portrait).
 * This class provides drawing primitives that mirror the M5.Lcd API so generated
 * MicroPython code can be visually previewed in the browser without hardware.
 *
 * The canvas is kept at native resolution (135x240) and scaled via CSS transform
 * or devicePixelRatio for crisp rendering on HiDPI screens.
 */
export class M5StickSimulator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private backgroundColor: string = "#000000";
  private textColor: string = "#FFFFFF";
  private textSize: number = 1;

  /** Output tracking -- records what was drawn for validation */
  private drawnTexts: string[] = [];
  private buzzerUsed: boolean = false;

  /** Physical display width in pixels */
  static readonly WIDTH = 135;
  /** Physical display height in pixels */
  static readonly HEIGHT = 240;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D rendering context from canvas");
    }
    this.ctx = ctx;

    // Set the canvas internal resolution to match device display
    this.setupCanvas();

    // Start with a black screen like the real device
    this.clear("#000000");
  }

  /**
   * Configure the canvas for crisp pixel rendering.
   * Uses devicePixelRatio so the tiny 135x240 display looks sharp
   * when scaled up on HiDPI screens.
   */
  private setupCanvas(): void {
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    this.canvas.width = M5StickSimulator.WIDTH * dpr;
    this.canvas.height = M5StickSimulator.HEIGHT * dpr;

    // CSS size stays at native resolution -- the parent container handles
    // visual scaling via CSS transform or width/height styling
    this.canvas.style.width = `${M5StickSimulator.WIDTH}px`;
    this.canvas.style.height = `${M5StickSimulator.HEIGHT}px`;

    // Scale the context so all drawing operations use native coordinates
    this.ctx.scale(dpr, dpr);

    // Disable image smoothing for pixel-perfect rendering
    this.ctx.imageSmoothingEnabled = false;
  }

  /**
   * Clear the entire display with a solid color.
   * Equivalent to M5.Lcd.fillScreen(color).
   * @param color - CSS color string (default: black)
   */
  clear(color?: string): void {
    const fillColor = color ?? this.backgroundColor;
    this.backgroundColor = fillColor;
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(0, 0, M5StickSimulator.WIDTH, M5StickSimulator.HEIGHT);
  }

  /**
   * Draw a text string at the given position.
   * Equivalent to M5.Lcd.drawString("text", x, y).
   * @param text - The string to render
   * @param x - X position (left edge of text)
   * @param y - Y position (top of text)
   * @param color - CSS color string (default: white)
   * @param fontSize - Font size in pixels (default: based on textSize)
   */
  drawString(
    text: string,
    x: number,
    y: number,
    color?: string,
    fontSize?: number
  ): void {
    const size = fontSize ?? this.textSize * 12;
    const drawColor = color ?? this.textColor;

    this.ctx.fillStyle = drawColor;
    this.ctx.font = `${size}px monospace`;
    this.ctx.textBaseline = "top";
    this.ctx.fillText(text, x, y);

    // Track for output validation
    this.drawnTexts.push(text);
  }

  /**
   * Draw a rectangle, either filled or just the outline.
   * Equivalent to M5.Lcd.drawRect / M5.Lcd.fillRect.
   * @param x - Top-left X
   * @param y - Top-left Y
   * @param width - Rectangle width
   * @param height - Rectangle height
   * @param color - CSS color string (default: white)
   * @param fill - If true, fill the rectangle; otherwise just stroke the outline
   */
  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color?: string,
    fill?: boolean
  ): void {
    const drawColor = color ?? this.textColor;

    if (fill) {
      this.ctx.fillStyle = drawColor;
      this.ctx.fillRect(x, y, width, height);
    } else {
      this.ctx.strokeStyle = drawColor;
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);
    }
  }

  /**
   * Draw a circle, either filled or just the outline.
   * Equivalent to M5.Lcd.drawCircle / M5.Lcd.fillCircle.
   * @param x - Center X
   * @param y - Center Y
   * @param radius - Circle radius in pixels
   * @param color - CSS color string (default: white)
   * @param fill - If true, fill the circle; otherwise just stroke the outline
   */
  drawCircle(
    x: number,
    y: number,
    radius: number,
    color?: string,
    fill?: boolean
  ): void {
    const drawColor = color ?? this.textColor;

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);

    if (fill) {
      this.ctx.fillStyle = drawColor;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = drawColor;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
  }

  /**
   * Draw a single pixel at the given position.
   * Equivalent to M5.Lcd.drawPixel(x, y, color).
   * @param x - Pixel X
   * @param y - Pixel Y
   * @param color - CSS color string (default: white)
   */
  drawPixel(x: number, y: number, color?: string): void {
    const drawColor = color ?? this.textColor;
    this.ctx.fillStyle = drawColor;
    this.ctx.fillRect(x, y, 1, 1);
  }

  /**
   * Draw a line between two points.
   * Equivalent to M5.Lcd.drawLine(x1, y1, x2, y2, color).
   * @param x1 - Start X
   * @param y1 - Start Y
   * @param x2 - End X
   * @param y2 - End Y
   * @param color - CSS color string (default: white)
   */
  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color?: string
  ): void {
    const drawColor = color ?? this.textColor;

    this.ctx.strokeStyle = drawColor;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
    this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
    this.ctx.stroke();
  }

  /**
   * Set the default background color for clear() calls.
   * @param color - CSS color string
   */
  setBackground(color: string): void {
    this.backgroundColor = color;
  }

  /**
   * Set the default text color for drawString() calls.
   * @param color - CSS color string
   */
  setTextColor(color: string): void {
    this.textColor = color;
  }

  /**
   * Set the text size multiplier (1 = 12px, 2 = 24px, etc.).
   * Mirrors M5.Lcd.setTextSize(n).
   * @param size - Text size multiplier (1-7)
   */
  setTextSize(size: number): void {
    this.textSize = Math.max(1, Math.min(7, size));
  }

  /**
   * Record that the buzzer was used (called by code runner on Speaker.tone).
   */
  markBuzzerUsed(): void {
    this.buzzerUsed = true;
  }

  /**
   * Get a snapshot of what was output during the last run.
   * Used for lesson validation (comparing actual vs expected output).
   */
  getOutputSnapshot(): SimulatorOutput {
    return {
      texts: [...new Set(this.drawnTexts)],
      hasBuzzer: this.buzzerUsed,
    };
  }

  /**
   * Clear the output tracking log. Call before each new run.
   */
  clearOutputLog(): void {
    this.drawnTexts = [];
    this.buzzerUsed = false;
  }

  /**
   * Get the underlying canvas element.
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get the current background color.
   */
  getBackgroundColor(): string {
    return this.backgroundColor;
  }

  /**
   * Resolve an M5 color reference to a CSS color string.
   * Handles:
   *  - Named constants like "WHITE", "RED"
   *  - Numeric RGB565 values like 0xFFFF, 0xF800
   *  - Hex strings like "#FF0000"
   *  - CSS color strings passed through as-is
   *
   * @param value - A color name, number, or CSS color string
   * @returns CSS hex color string
   */
  static resolveColor(value: string | number): string {
    // Numeric value -- look up RGB565 table
    if (typeof value === "number") {
      return M5_COLOR_VALUES[value] ?? "#FFFFFF";
    }

    // String: check named constants first
    const upper = value.toUpperCase().trim();
    if (upper in M5_COLORS) {
      return M5_COLORS[upper];
    }

    // Hex number string like "0xFFFF" or "65535"
    if (upper.startsWith("0X")) {
      const num = parseInt(upper, 16);
      return M5_COLOR_VALUES[num] ?? "#FFFFFF";
    }

    // Pure numeric string
    const asNum = Number(value);
    if (!isNaN(asNum) && value.trim() !== "") {
      return M5_COLOR_VALUES[asNum] ?? "#FFFFFF";
    }

    // Already a CSS color (hex, rgb, named CSS color)
    if (value.startsWith("#") || value.startsWith("rgb")) {
      return value;
    }

    // Fallback
    return "#FFFFFF";
  }
}
