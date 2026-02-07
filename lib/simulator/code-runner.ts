import { M5StickSimulator } from "./m5stick-simulator";
import type { SimulatorCommand } from "./types";

/**
 * SimulatorCodeRunner - Parses generated MicroPython code and executes
 * the corresponding drawing commands on the M5StickSimulator canvas.
 *
 * This is NOT a full Python interpreter. It uses regex to recognize
 * M5-specific API calls (M5.Lcd.*, time.sleep*, M5.Speaker.*) and maps
 * them to simulator methods. Unrecognized lines are silently skipped.
 *
 * Supports (with or without M5. prefix for UIFlow2 compatibility):
 *  - Lcd.fillScreen(color)
 *  - Lcd.drawString("text", x, y [, color])
 *  - Lcd.drawRect(x, y, w, h [, color])
 *  - Lcd.fillRect(x, y, w, h [, color])
 *  - Lcd.drawCircle(x, y, r [, color])
 *  - Lcd.fillCircle(x, y, r [, color])
 *  - Lcd.drawLine(x1, y1, x2, y2 [, color])
 *  - Lcd.drawPixel(x, y [, color])
 *  - Lcd.setTextColor(color [, bgColor])
 *  - Lcd.setTextSize(size)
 *  - time.sleep(seconds)
 *  - time.sleep_ms(ms)
 *  - Speaker.tone(freq, duration) -- visual indicator only
 *
 * Simple while True loops and for-range loops are handled with
 * configurable iteration limits to prevent infinite execution.
 */
export class SimulatorCodeRunner {
  private simulator: M5StickSimulator;
  private _running: boolean = false;
  private abortController: AbortController | null = null;

  /** Max iterations for while-True loops before auto-stopping */
  private static readonly MAX_LOOP_ITERATIONS = 200;

  /** Callback fired when a tone command is encountered (for visual feedback) */
  onTone: ((frequency: number, durationMs: number) => void) | null = null;

  constructor(simulator: M5StickSimulator) {
    this.simulator = simulator;
  }

  /**
   * Parse and execute MicroPython code line by line.
   * Returns a promise that resolves when execution completes or is stopped.
   */
  async run(code: string): Promise<void> {
    if (this._running) {
      this.stop();
      // Small delay to let the previous run clean up
      await this.delay(50);
    }

    this._running = true;
    this.abortController = new AbortController();

    try {
      const lines = code.split("\n");
      await this.executeLines(lines, 0, lines.length);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Execution was stopped intentionally
        return;
      }
      // Re-throw unexpected errors
      throw err;
    } finally {
      this._running = false;
      this.abortController = null;
    }
  }

  /**
   * Stop the currently running code execution.
   */
  stop(): void {
    this._running = false;
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Whether code is currently being executed.
   */
  get isRunning(): boolean {
    return this._running;
  }

  // ---------------------------------------------------------------------------
  // Internal execution engine
  // ---------------------------------------------------------------------------

  /**
   * Execute a range of lines from the code.
   * Handles basic control flow: while True loops, for-range loops.
   */
  private async executeLines(
    lines: string[],
    start: number,
    end: number
  ): Promise<void> {
    let i = start;

    while (i < end) {
      this.checkAbort();

      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      // Skip empty lines and comments
      if (trimmed === "" || trimmed.startsWith("#")) {
        i++;
        continue;
      }

      // Detect while True: loop
      if (this.isWhileTrueLoop(trimmed)) {
        const bodyRange = this.getIndentedBlock(lines, i + 1, end);
        await this.executeWhileLoop(lines, bodyRange.start, bodyRange.end);
        i = bodyRange.end;
        continue;
      }

      // Detect for x in range(...): loop
      const rangeMatch = this.isForRangeLoop(trimmed);
      if (rangeMatch) {
        const bodyRange = this.getIndentedBlock(lines, i + 1, end);
        await this.executeForRange(
          lines,
          bodyRange.start,
          bodyRange.end,
          rangeMatch.count
        );
        i = bodyRange.end;
        continue;
      }

      // Regular line -- try to parse as a simulator command
      const command = this.parseLine(trimmed);
      if (command) {
        await this.executeCommand(command);
      }

      i++;
    }
  }

  /**
   * Execute a while True: loop body, up to MAX_LOOP_ITERATIONS.
   */
  private async executeWhileLoop(
    lines: string[],
    bodyStart: number,
    bodyEnd: number
  ): Promise<void> {
    for (let iter = 0; iter < SimulatorCodeRunner.MAX_LOOP_ITERATIONS; iter++) {
      this.checkAbort();
      await this.executeLines(lines, bodyStart, bodyEnd);
    }
  }

  /**
   * Execute a for-range loop body the specified number of times.
   */
  private async executeForRange(
    lines: string[],
    bodyStart: number,
    bodyEnd: number,
    count: number
  ): Promise<void> {
    const iterations = Math.min(count, SimulatorCodeRunner.MAX_LOOP_ITERATIONS);
    for (let iter = 0; iter < iterations; iter++) {
      this.checkAbort();
      await this.executeLines(lines, bodyStart, bodyEnd);
    }
  }

  /**
   * Check if the line is a `while True:` statement.
   */
  private isWhileTrueLoop(line: string): boolean {
    return /^while\s+True\s*:/.test(line);
  }

  /**
   * Check if the line is a `for x in range(n):` statement.
   * Returns the range count or null if not a match.
   */
  private isForRangeLoop(
    line: string
  ): { count: number } | null {
    const match = line.match(/^for\s+\w+\s+in\s+range\((\d+)\)\s*:/);
    if (match) {
      return { count: parseInt(match[1], 10) };
    }
    return null;
  }

  /**
   * Given the line after a loop header, find the indented block body.
   * Returns the start/end indices of the block (end is exclusive).
   */
  private getIndentedBlock(
    lines: string[],
    start: number,
    limit: number
  ): { start: number; end: number } {
    if (start >= limit) {
      return { start, end: start };
    }

    // Determine the indentation level of the first line in the block
    const firstLine = lines[start];
    const baseIndentMatch = firstLine.match(/^(\s+)/);
    if (!baseIndentMatch) {
      // No indentation -- empty block
      return { start, end: start };
    }

    const baseIndent = baseIndentMatch[1].length;
    let end = start;

    while (end < limit) {
      const line = lines[end];
      // Empty lines are part of the block
      if (line.trim() === "") {
        end++;
        continue;
      }
      const indentMatch = line.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1].length : 0;
      if (indent < baseIndent) {
        break;
      }
      end++;
    }

    return { start, end };
  }

  // ---------------------------------------------------------------------------
  // Line parsing -- regex-based recognition of M5 API calls
  // ---------------------------------------------------------------------------

  /**
   * Parse a single line of MicroPython code into a SimulatorCommand.
   * Returns null for unrecognized lines (which are silently skipped).
   */
  private parseLine(line: string): SimulatorCommand | null {
    // M5.Lcd.fillScreen(color)
    let match = line.match(
      /(?:M5\.)?Lcd\.fillScreen\(\s*(.+?)\s*\)/
    );
    if (match) {
      return {
        type: "fillScreen",
        args: { color: this.parseColorArg(match[1]) },
      };
    }

    // M5.Lcd.drawString("text", x, y [, color])
    match = line.match(
      /(?:M5\.)?Lcd\.drawString\(\s*(?:"([^"]*?)"|'([^']*?)')\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(.+?))?\s*\)/
    );
    if (match) {
      const text = match[1] ?? match[2] ?? "";
      return {
        type: "drawString",
        args: {
          text,
          x: parseInt(match[3], 10),
          y: parseInt(match[4], 10),
          ...(match[5] ? { color: this.parseColorArg(match[5]) } : {}),
        },
      };
    }

    // M5.Lcd.fillRect(x, y, w, h [, color])
    match = line.match(
      /(?:M5\.)?Lcd\.fillRect\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(.+?))?\s*\)/
    );
    if (match) {
      return {
        type: "fillRect",
        args: {
          x: parseInt(match[1], 10),
          y: parseInt(match[2], 10),
          width: parseInt(match[3], 10),
          height: parseInt(match[4], 10),
          ...(match[5] ? { color: this.parseColorArg(match[5]) } : {}),
        },
      };
    }

    // M5.Lcd.drawRect(x, y, w, h [, color])
    match = line.match(
      /(?:M5\.)?Lcd\.drawRect\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(.+?))?\s*\)/
    );
    if (match) {
      return {
        type: "drawRect",
        args: {
          x: parseInt(match[1], 10),
          y: parseInt(match[2], 10),
          width: parseInt(match[3], 10),
          height: parseInt(match[4], 10),
          ...(match[5] ? { color: this.parseColorArg(match[5]) } : {}),
        },
      };
    }

    // M5.Lcd.fillCircle(x, y, r [, color])
    match = line.match(
      /(?:M5\.)?Lcd\.fillCircle\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(.+?))?\s*\)/
    );
    if (match) {
      return {
        type: "fillCircle",
        args: {
          x: parseInt(match[1], 10),
          y: parseInt(match[2], 10),
          radius: parseInt(match[3], 10),
          ...(match[4] ? { color: this.parseColorArg(match[4]) } : {}),
        },
      };
    }

    // M5.Lcd.drawCircle(x, y, r [, color])
    match = line.match(
      /(?:M5\.)?Lcd\.drawCircle\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(.+?))?\s*\)/
    );
    if (match) {
      return {
        type: "drawCircle",
        args: {
          x: parseInt(match[1], 10),
          y: parseInt(match[2], 10),
          radius: parseInt(match[3], 10),
          ...(match[4] ? { color: this.parseColorArg(match[4]) } : {}),
        },
      };
    }

    // M5.Lcd.drawLine(x1, y1, x2, y2 [, color])
    match = line.match(
      /(?:M5\.)?Lcd\.drawLine\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(.+?))?\s*\)/
    );
    if (match) {
      return {
        type: "drawLine",
        args: {
          x1: parseInt(match[1], 10),
          y1: parseInt(match[2], 10),
          x2: parseInt(match[3], 10),
          y2: parseInt(match[4], 10),
          ...(match[5] ? { color: this.parseColorArg(match[5]) } : {}),
        },
      };
    }

    // M5.Lcd.drawPixel(x, y [, color])
    match = line.match(
      /(?:M5\.)?Lcd\.drawPixel\(\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(.+?))?\s*\)/
    );
    if (match) {
      return {
        type: "drawPixel",
        args: {
          x: parseInt(match[1], 10),
          y: parseInt(match[2], 10),
          ...(match[3] ? { color: this.parseColorArg(match[3]) } : {}),
        },
      };
    }

    // M5.Lcd.setTextColor(color [, bgColor])
    match = line.match(
      /(?:M5\.)?Lcd\.setTextColor\(\s*(.+?)(?:\s*,\s*(.+?))?\s*\)/
    );
    if (match) {
      return {
        type: "setTextColor",
        args: {
          color: this.parseColorArg(match[1]),
          ...(match[2] ? { bgColor: this.parseColorArg(match[2]) } : {}),
        },
      };
    }

    // M5.Lcd.setTextSize(size)
    match = line.match(/(?:M5\.)?Lcd\.setTextSize\(\s*(\d+)\s*\)/);
    if (match) {
      return {
        type: "setTextSize",
        args: { size: parseInt(match[1], 10) },
      };
    }

    // time.sleep(seconds)
    match = line.match(/time\.sleep\(\s*([\d.]+)\s*\)/);
    if (match) {
      return {
        type: "sleep",
        args: { ms: Math.round(parseFloat(match[1]) * 1000) },
      };
    }

    // time.sleep_ms(ms)
    match = line.match(/time\.sleep_ms\(\s*(\d+)\s*\)/);
    if (match) {
      return {
        type: "sleep",
        args: { ms: parseInt(match[1], 10) },
      };
    }

    // M5.Speaker.tone(freq, duration)
    match = line.match(
      /(?:M5\.)?Speaker\.tone\(\s*(\d+)\s*,\s*(\d+)\s*\)/
    );
    if (match) {
      return {
        type: "tone",
        args: {
          frequency: parseInt(match[1], 10),
          durationMs: parseInt(match[2], 10),
        },
      };
    }

    // Unrecognized line -- skip
    return null;
  }

  /**
   * Parse a color argument from the MicroPython code.
   * Could be a named constant (e.g., M5.Lcd.WHITE), a hex number (0xFFFF),
   * or a plain number.
   */
  private parseColorArg(raw: string): string {
    const trimmed = raw.trim();

    // M5.Lcd.WHITE or lcd.WHITE style references
    const colorNameMatch = trimmed.match(
      /(?:M5\.Lcd\.|lcd\.|Lcd\.)?([A-Z_]+)$/
    );
    if (colorNameMatch) {
      const resolved = M5StickSimulator.resolveColor(colorNameMatch[1]);
      if (resolved !== "#FFFFFF" || colorNameMatch[1] === "WHITE") {
        return resolved;
      }
    }

    // Hex number like 0xF800
    if (trimmed.match(/^0x[0-9a-fA-F]+$/)) {
      return M5StickSimulator.resolveColor(trimmed);
    }

    // Plain number
    if (trimmed.match(/^\d+$/)) {
      return M5StickSimulator.resolveColor(parseInt(trimmed, 10));
    }

    // Fallback: treat as CSS color or return white
    return M5StickSimulator.resolveColor(trimmed);
  }

  // ---------------------------------------------------------------------------
  // Command execution
  // ---------------------------------------------------------------------------

  /**
   * Execute a single parsed command on the simulator.
   */
  private async executeCommand(cmd: SimulatorCommand): Promise<void> {
    this.checkAbort();

    const args = cmd.args;

    switch (cmd.type) {
      case "fillScreen":
        this.simulator.clear(args.color as string);
        break;

      case "drawString":
        this.simulator.drawString(
          args.text as string,
          args.x as number,
          args.y as number,
          args.color as string | undefined
        );
        break;

      case "drawRect":
        this.simulator.drawRect(
          args.x as number,
          args.y as number,
          args.width as number,
          args.height as number,
          args.color as string | undefined,
          false
        );
        break;

      case "fillRect":
        this.simulator.drawRect(
          args.x as number,
          args.y as number,
          args.width as number,
          args.height as number,
          args.color as string | undefined,
          true
        );
        break;

      case "drawCircle":
        this.simulator.drawCircle(
          args.x as number,
          args.y as number,
          args.radius as number,
          args.color as string | undefined,
          false
        );
        break;

      case "fillCircle":
        this.simulator.drawCircle(
          args.x as number,
          args.y as number,
          args.radius as number,
          args.color as string | undefined,
          true
        );
        break;

      case "drawLine":
        this.simulator.drawLine(
          args.x1 as number,
          args.y1 as number,
          args.x2 as number,
          args.y2 as number,
          args.color as string | undefined
        );
        break;

      case "drawPixel":
        this.simulator.drawPixel(
          args.x as number,
          args.y as number,
          args.color as string | undefined
        );
        break;

      case "setTextColor":
        this.simulator.setTextColor(args.color as string);
        break;

      case "setTextSize":
        this.simulator.setTextSize(args.size as number);
        break;

      case "sleep":
        await this.delay(args.ms as number);
        break;

      case "tone":
        if (this.onTone) {
          this.onTone(
            args.frequency as number,
            args.durationMs as number
          );
        }
        // Small visual pause so the tone indicator is visible
        await this.delay(Math.min(args.durationMs as number, 500));
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------

  /**
   * Async delay that respects the abort signal.
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._running) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }

      const signal = this.abortController?.signal;

      // Cap sleep durations for the simulator so kids don't wait forever
      const cappedMs = Math.min(ms, 3000);

      const timer = setTimeout(() => {
        signal?.removeEventListener("abort", onAbort);
        resolve();
      }, cappedMs);

      const onAbort = () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      };

      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }

  /**
   * Throw if the abort signal has been triggered.
   */
  private checkAbort(): void {
    if (!this._running || this.abortController?.signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
  }
}
