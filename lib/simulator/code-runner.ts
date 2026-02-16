import { M5StickSimulator } from "./m5stick-simulator";
import type { SimulatorCommand } from "./types";

/**
 * SimulatorCodeRunner - Parses generated MicroPython code and executes
 * the corresponding drawing commands on the M5StickSimulator canvas.
 *
 * This is NOT a full Python interpreter. It uses regex to recognize
 * M5-specific API calls (Lcd.*, time.sleep*, Speaker.*) and maps
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
 *  - Speaker.tone(freq, duration) -- audio + visual indicator
 *
 * Variable & expression support:
 *  - Variable assignment: score = 0, x = x + 1
 *  - Arithmetic: +, -, *, //, %
 *  - Comparisons: >, <, >=, <=, ==, !=
 *  - Boolean: and, or, not
 *  - Functions: str(), int(), abs(), random.randint()
 *  - Variables in API args: Lcd.drawString(str(score), x, y)
 *
 * Control flow:
 *  - while True: loops (capped)
 *  - for x in range(n): loops (with loop variable)
 *  - if/elif/else conditionals
 *  - def blocks (skipped, not executed)
 *
 * Button & sensor simulation:
 *  - BtnA.isPressed() / BtnA.wasPressed()
 *  - BtnB.isPressed() / BtnB.wasPressed()
 *  - Imu.getAccel()[n]
 */
export class SimulatorCodeRunner {
  private simulator: M5StickSimulator;
  private _running: boolean = false;
  private abortController: AbortController | null = null;

  /** Max iterations for while-True loops before auto-stopping */
  private static readonly MAX_LOOP_ITERATIONS = 200;

  /** Python variable store -- reset on each run() */
  private variables: Map<string, number | string | boolean> = new Map();

  /** Button state -- settable from UI via setButtonState() */
  private buttonA = false;
  private buttonB = false;

  /** IMU accelerometer values -- settable from UI via setImuValues() */
  private imuValues: [number, number, number] = [0, 0, 0];

  /** Callback fired when a tone command is encountered (for visual feedback) */
  onTone: ((frequency: number, durationMs: number) => void) | null = null;

  /** Callback fired when LED brightness changes (for visual feedback) */
  onLed: ((brightness: number) => void) | null = null;

  constructor(simulator: M5StickSimulator) {
    this.simulator = simulator;
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

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
    this.variables.clear();

    try {
      const lines = this.preprocessCode(code).split("\n");
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
   * Normalize Blockly-generated Python into patterns the code runner supports.
   *
   * Blockly's `math_change` block generates:
   *   count = (count if isinstance(count, Number) else 0) + 1
   * which we simplify to:
   *   count += 1
   *
   * Blockly also adds `from numbers import Number` which we strip.
   */
  private preprocessCode(code: string): string {
    return code
      // Strip Blockly's Number import (not needed in simulator)
      .replace(/^from numbers import Number\n?/gm, "")
      // Normalize math_change pattern: var = (var if isinstance(var, ...) else 0) + N
      .replace(
        /^(\s*)(\w+) = \(\2 if isinstance\(\2,\s*Number\) else 0\) \+ (.+)$/gm,
        "$1$2 += $3"
      )
      // Also handle the older Blockly pattern: var = (var if type(var) == int else 0) + N
      .replace(
        /^(\s*)(\w+) = \(\2 if type\(\2\) == int else 0\) \+ (.+)$/gm,
        "$1$2 += $3"
      );
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

  /**
   * Set button pressed state (called from simulator UI).
   */
  setButtonState(button: "a" | "b", pressed: boolean): void {
    if (button === "a") this.buttonA = pressed;
    else this.buttonB = pressed;
  }

  /**
   * Set IMU accelerometer values (called from simulator UI).
   * Values should be in range -1.0 to 1.0 for each axis.
   */
  setImuValues(x: number, y: number, z: number): void {
    this.imuValues = [x, y, z];
  }

  // ---------------------------------------------------------------------------
  // Internal execution engine
  // ---------------------------------------------------------------------------

  /**
   * Execute a range of lines from the code.
   * Handles control flow: while True, for-range, if/elif/else, assignments.
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

      // Skip import statements
      if (trimmed.startsWith("import ") || trimmed.startsWith("from ")) {
        i++;
        continue;
      }

      // Skip function/class definitions (jump past their body)
      if (
        (trimmed.startsWith("def ") || trimmed.startsWith("class ")) &&
        trimmed.endsWith(":")
      ) {
        const bodyRange = this.getIndentedBlock(lines, i + 1, end);
        i = bodyRange.end;
        continue;
      }

      // Skip standalone keywords that aren't actionable
      if (
        trimmed.startsWith("global ") ||
        trimmed.startsWith("return ") ||
        trimmed === "pass" ||
        trimmed === "break" ||
        trimmed === "continue"
      ) {
        i++;
        continue;
      }

      // Detect while <condition>: loop
      const whileCondExpr = this.parseWhileCondition(trimmed);
      if (whileCondExpr !== null) {
        const bodyRange = this.getIndentedBlock(lines, i + 1, end);
        await this.executeWhileCondLoop(
          lines, bodyRange.start, bodyRange.end, whileCondExpr
        );
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
          rangeMatch.count,
          rangeMatch.varName
        );
        i = bodyRange.end;
        continue;
      }

      // Detect if/elif/else conditional chain
      const ifMatch = trimmed.match(/^if\s+(.+?)\s*:$/);
      if (ifMatch) {
        const chain = this.parseConditionalChain(lines, i, end);
        await this.executeConditional(lines, chain.branches);
        i = chain.chainEnd;
        continue;
      }

      // Detect compound assignment: varname += expr, varname -= expr
      const compoundMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|\*=)\s*(.+)$/);
      if (compoundMatch) {
        const varName = compoundMatch[1];
        const op = compoundMatch[2];
        const rhs = this.evaluateNumeric(compoundMatch[3].trim());
        const current = Number(this.variables.get(varName) ?? 0);
        if (op === "+=") this.variables.set(varName, current + rhs);
        else if (op === "-=") this.variables.set(varName, current - rhs);
        else if (op === "*=") this.variables.set(varName, current * rhs);
        i++;
        continue;
      }

      // Detect variable assignment: varname = expression (but not ==)
      const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=(?!=)\s*(.+)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const value = this.evaluate(assignMatch[2].trim());
        this.variables.set(varName, value);
        i++;
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
   * Execute a while <condition>: loop, re-evaluating the condition
   * each iteration. Capped at MAX_LOOP_ITERATIONS.
   */
  private async executeWhileCondLoop(
    lines: string[],
    bodyStart: number,
    bodyEnd: number,
    conditionExpr: string
  ): Promise<void> {
    for (let iter = 0; iter < SimulatorCodeRunner.MAX_LOOP_ITERATIONS; iter++) {
      this.checkAbort();
      // Re-evaluate condition each iteration
      if (!this.isTruthyValue(this.evaluate(conditionExpr))) break;
      await this.executeLines(lines, bodyStart, bodyEnd);
    }
  }

  /**
   * Execute a for-range loop body the specified number of times,
   * setting the loop variable on each iteration.
   */
  private async executeForRange(
    lines: string[],
    bodyStart: number,
    bodyEnd: number,
    count: number,
    varName: string
  ): Promise<void> {
    const iterations = Math.min(count, SimulatorCodeRunner.MAX_LOOP_ITERATIONS);
    for (let iter = 0; iter < iterations; iter++) {
      this.checkAbort();
      this.variables.set(varName, iter);
      await this.executeLines(lines, bodyStart, bodyEnd);
    }
  }

  /**
   * Parse a `while <condition>:` statement. Returns the condition
   * expression string, or null if the line is not a while loop.
   */
  private parseWhileCondition(line: string): string | null {
    const match = line.match(/^while\s+(.+?)\s*:$/);
    return match ? match[1].trim() : null;
  }

  /**
   * Check if the line is a `for x in range(n):` statement.
   * Returns the range count and variable name, or null if not a match.
   */
  private isForRangeLoop(
    line: string
  ): { count: number; varName: string } | null {
    const match = line.match(/^for\s+(\w+)\s+in\s+range\((\d+)\)\s*:/);
    if (match) {
      return { varName: match[1], count: parseInt(match[2], 10) };
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
  // Conditional (if/elif/else) support
  // ---------------------------------------------------------------------------

  /**
   * Parse an if/elif/else chain starting at the given line.
   * Returns the branches and the line index after the entire chain.
   */
  private parseConditionalChain(
    lines: string[],
    ifLine: number,
    limit: number
  ): {
    branches: Array<{
      condition: string | null;
      bodyStart: number;
      bodyEnd: number;
    }>;
    chainEnd: number;
  } {
    const branches: Array<{
      condition: string | null;
      bodyStart: number;
      bodyEnd: number;
    }> = [];

    // Parse the 'if' branch
    const ifCondition = lines[ifLine].trim().match(/^if\s+(.+?)\s*:$/);
    if (!ifCondition) {
      return { branches: [], chainEnd: ifLine + 1 };
    }

    const ifBody = this.getIndentedBlock(lines, ifLine + 1, limit);
    branches.push({
      condition: ifCondition[1],
      bodyStart: ifBody.start,
      bodyEnd: ifBody.end,
    });
    let current = ifBody.end;

    // Look for elif/else branches at the same indentation level
    while (current < limit) {
      const trimmed = lines[current]?.trim();
      if (!trimmed) {
        current++;
        continue;
      }

      const elifMatch = trimmed.match(/^elif\s+(.+?)\s*:$/);
      if (elifMatch) {
        const body = this.getIndentedBlock(lines, current + 1, limit);
        branches.push({
          condition: elifMatch[1],
          bodyStart: body.start,
          bodyEnd: body.end,
        });
        current = body.end;
        continue;
      }

      if (trimmed === "else:") {
        const body = this.getIndentedBlock(lines, current + 1, limit);
        branches.push({
          condition: null, // null = else (always matches)
          bodyStart: body.start,
          bodyEnd: body.end,
        });
        current = body.end;
        break;
      }

      // Neither elif nor else -- chain is done
      break;
    }

    return { branches, chainEnd: current };
  }

  /**
   * Execute the first matching branch in a conditional chain.
   */
  private async executeConditional(
    lines: string[],
    branches: Array<{
      condition: string | null;
      bodyStart: number;
      bodyEnd: number;
    }>
  ): Promise<void> {
    for (const branch of branches) {
      // null condition = else branch (always executes)
      if (branch.condition === null || this.isTruthy(branch.condition)) {
        await this.executeLines(lines, branch.bodyStart, branch.bodyEnd);
        return; // Only execute the first matching branch
      }
    }
  }

  /**
   * Evaluate a condition expression and return whether it's truthy.
   */
  private isTruthy(condition: string): boolean {
    const result = this.evaluate(condition);
    if (typeof result === "boolean") return result;
    if (typeof result === "number") return result !== 0;
    if (typeof result === "string") return result !== "";
    return Boolean(result);
  }

  // ---------------------------------------------------------------------------
  // Expression evaluator
  // ---------------------------------------------------------------------------

  /**
   * Evaluate a Python expression and return the result.
   * Handles literals, variables, arithmetic, comparisons, function calls.
   */
  evaluate(expr: string): number | string | boolean {
    const s = expr.trim();
    if (s === "") return 0;

    // Strip outer parentheses if they match
    if (s.startsWith("(") && s.length > 2) {
      const matchIdx = this.findMatchingParen(s, 0);
      if (matchIdx === s.length - 1) {
        return this.evaluate(s.slice(1, -1));
      }
    }

    // Boolean literals
    if (s === "True") return true;
    if (s === "False") return false;
    if (s === "None") return 0;

    // Number literal (integer or float)
    if (/^-?\d+(\.\d+)?$/.test(s)) {
      return parseFloat(s);
    }

    // String literal (double or single quoted)
    const strLit = s.match(/^"([^"]*)"$/) || s.match(/^'([^']*)'$/);
    if (strLit) {
      return strLit[1];
    }

    // Unary: not expr
    if (s.startsWith("not ")) {
      return !this.isTruthy(s.slice(4));
    }

    // Unary: -varname (negative variable)
    const negVarMatch = s.match(/^-([a-zA-Z_]\w*)$/);
    if (negVarMatch && this.variables.has(negVarMatch[1])) {
      return -Number(this.variables.get(negVarMatch[1]));
    }

    // Function calls: str(), int(), abs(), len()
    const strCall = s.match(/^str\((.+)\)$/);
    if (strCall && this.findMatchingParen(s, 3) === s.length - 1) {
      return String(this.evaluate(strCall[1]));
    }

    const intCall = s.match(/^int\((.+)\)$/);
    if (intCall && this.findMatchingParen(s, 3) === s.length - 1) {
      return Math.floor(Number(this.evaluate(intCall[1])));
    }

    const absCall = s.match(/^abs\((.+)\)$/);
    if (absCall && this.findMatchingParen(s, 3) === s.length - 1) {
      return Math.abs(Number(this.evaluate(absCall[1])));
    }

    const lenCall = s.match(/^len\((.+)\)$/);
    if (lenCall && this.findMatchingParen(s, 3) === s.length - 1) {
      const val = this.evaluate(lenCall[1]);
      return typeof val === "string" ? val.length : 0;
    }

    // random.randint(a, b)
    const randMatch = s.match(/^random\.randint\((.+)\)$/);
    if (randMatch) {
      const args = this.splitArgs(randMatch[1]);
      if (args.length >= 2) {
        const a = Math.floor(Number(this.evaluate(args[0])));
        const b = Math.floor(Number(this.evaluate(args[1])));
        return Math.floor(Math.random() * (b - a + 1)) + a;
      }
    }

    // Button state: BtnA.isPressed(), BtnA.wasPressed(), etc.
    if (/^BtnA\.(isPressed|wasPressed)\(\)$/.test(s)) return this.buttonA;
    if (/^BtnB\.(isPressed|wasPressed)\(\)$/.test(s)) return this.buttonB;

    // IMU: Imu.getAccel()[n]
    const imuMatch = s.match(/^Imu\.getAccel\(\)\[(\d)\]$/);
    if (imuMatch) {
      const idx = parseInt(imuMatch[1], 10);
      return this.imuValues[idx] ?? 0;
    }

    // shake_detected() helper
    if (s === "shake_detected()") {
      const [x, y, z] = this.imuValues;
      return Math.abs(x) + Math.abs(y) + Math.abs(z) > 1.5;
    }

    // Binary operators -- find the lowest-precedence top-level operator
    const binOp = this.findTopLevelBinaryOp(s);
    if (binOp) {
      const left = this.evaluate(s.slice(0, binOp.index));
      const right = this.evaluate(s.slice(binOp.index + binOp.op.length));
      return this.applyBinaryOp(left, binOp.op, right);
    }

    // Hex color constant (pass through as string for color args)
    if (/^0x[0-9a-fA-F]+$/i.test(s)) return s;

    // Variable lookup
    if (/^[a-zA-Z_]\w*$/.test(s)) {
      if (this.variables.has(s)) {
        return this.variables.get(s)!;
      }
      // Unknown variable -- return 0 (common default)
      return 0;
    }

    // String concatenation via + with mixed types is handled by binary op above
    // Fallback: return 0 for unrecognized expressions
    return 0;
  }

  /**
   * Evaluate an expression and return a numeric result.
   */
  private evaluateNumeric(expr: string): number {
    const result = this.evaluate(expr.trim());
    if (typeof result === "number") return result;
    const num = Number(result);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Find the matching closing parenthesis for an opening paren.
   * Returns the index of the closing paren, or -1 if not found.
   */
  private findMatchingParen(s: string, openIndex: number): number {
    let depth = 1;
    for (let i = openIndex + 1; i < s.length; i++) {
      if (s[i] === "(") depth++;
      if (s[i] === ")") {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  /**
   * Find the rightmost top-level binary operator (not inside parentheses)
   * at the lowest precedence level.
   *
   * Precedence (lowest to highest):
   *   1. or
   *   2. and
   *   3. ==, !=, >=, <=, >, <
   *   4. +, -
   *   5. *, //, %
   */
  private findTopLevelBinaryOp(
    expr: string
  ): { op: string; index: number } | null {
    // Operator groups ordered by precedence (lowest first)
    // We search for multi-char operators first within each group
    const groups: string[][] = [
      [" or "],
      [" and "],
      [">=", "<=", "!=", "==", ">", "<"],
      ["+", "-"],
      ["//", "*", "%"],
    ];

    for (const ops of groups) {
      // Scan right-to-left for left-to-right associativity
      let depth = 0;
      for (let i = expr.length - 1; i >= 0; i--) {
        if (expr[i] === ")") depth++;
        if (expr[i] === "(") depth--;
        if (depth > 0) continue;

        for (const op of ops) {
          // Check if operator matches at this position
          const start = i - op.length + 1;
          if (start < 0) continue;
          if (expr.substring(start, start + op.length) !== op) continue;

          // Skip if this would result in an empty left side
          if (start === 0) {
            // Allow negative sign only if followed by expression parsing
            continue;
          }

          // For single-char operators that are substrings of multi-char ones:
          // Don't match '>' if it's part of '>='
          if (op === ">" && start + 1 < expr.length && expr[start + 1] === "=")
            continue;
          if (op === "<" && start + 1 < expr.length && expr[start + 1] === "=")
            continue;
          // Don't match '-' or '+' right after another operator (unary)
          if (op === "-" || op === "+") {
            const before = expr[start - 1];
            if (
              before === "(" ||
              before === "," ||
              before === "=" ||
              before === ">" ||
              before === "<" ||
              before === "!" ||
              before === "+" ||
              before === "-" ||
              before === "*" ||
              before === "/" ||
              before === "%"
            ) {
              continue;
            }
          }

          return { op, index: start };
        }
      }
    }

    return null;
  }

  /**
   * Apply a binary operator to two evaluated values.
   */
  private applyBinaryOp(
    left: number | string | boolean,
    op: string,
    right: number | string | boolean
  ): number | string | boolean {
    switch (op) {
      case "+":
        // String concatenation if either side is a string
        if (typeof left === "string" || typeof right === "string") {
          return String(left) + String(right);
        }
        return Number(left) + Number(right);
      case "-":
        return Number(left) - Number(right);
      case "*":
        // Python string repetition: "abc" * 3
        if (typeof left === "string" && typeof right === "number") {
          return left.repeat(Math.max(0, Math.floor(right)));
        }
        return Number(left) * Number(right);
      case "//":
        return Math.floor(Number(left) / Number(right));
      case "%":
        return Number(left) % Number(right);
      case ">":
        return Number(left) > Number(right);
      case "<":
        return Number(left) < Number(right);
      case ">=":
        return Number(left) >= Number(right);
      case "<=":
        return Number(left) <= Number(right);
      case "==":
        return left === right;
      case "!=":
        return left !== right;
      case " and ":
        return this.isTruthyValue(left) ? right : left;
      case " or ":
        return this.isTruthyValue(left) ? left : right;
      default:
        return 0;
    }
  }

  /**
   * Check if a value is truthy in Python terms.
   */
  private isTruthyValue(val: number | string | boolean): boolean {
    if (typeof val === "boolean") return val;
    if (typeof val === "number") return val !== 0;
    if (typeof val === "string") return val !== "";
    return Boolean(val);
  }

  // ---------------------------------------------------------------------------
  // Argument splitting
  // ---------------------------------------------------------------------------

  /**
   * Split a comma-separated argument string, respecting parentheses.
   * e.g. "str((score + 1)), 10, 20" → ["str((score + 1))", " 10", " 20"]
   */
  private splitArgs(argsStr: string): string[] {
    const args: string[] = [];
    let depth = 0;
    let current = "";

    for (const ch of argsStr) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) {
        args.push(current);
        current = "";
        continue;
      }
      current += ch;
    }
    if (current.trim() !== "") {
      args.push(current);
    }
    return args;
  }

  // ---------------------------------------------------------------------------
  // Line parsing -- unified API call recognition
  // ---------------------------------------------------------------------------

  /**
   * Parse a single line of MicroPython code into a SimulatorCommand.
   * Returns null for unrecognized lines (which are silently skipped).
   */
  private parseLine(line: string): SimulatorCommand | null {
    // Match API calls: [M5.]Object.method(args) or [M5.]Object.method()
    const apiMatch = line.match(
      /^(?:M5\.)?(\w+)\.(\w+)\((.*)\)\s*$/
    );
    if (apiMatch) {
      const obj = apiMatch[1];
      const method = apiMatch[2];
      const argsStr = apiMatch[3];
      const args = argsStr.trim() === "" ? [] : this.splitArgs(argsStr);
      return this.parseApiCall(obj, method, args);
    }

    return null;
  }

  /**
   * Parse a recognized API call into a SimulatorCommand.
   */
  private parseApiCall(
    obj: string,
    method: string,
    args: string[]
  ): SimulatorCommand | null {
    // ---- Lcd API ----
    if (obj === "Lcd") {
      switch (method) {
        case "fillScreen":
          return {
            type: "fillScreen",
            args: { color: this.parseColorArg(args[0] ?? "") },
          };

        case "drawString":
          if (args.length >= 3) {
            return {
              type: "drawString",
              args: {
                text: String(this.evaluate(args[0].trim())),
                x: this.evaluateNumeric(args[1]),
                y: this.evaluateNumeric(args[2]),
                ...(args[3]
                  ? { color: this.parseColorArg(args[3].trim()) }
                  : {}),
              },
            };
          }
          return null;

        case "fillRect":
          if (args.length >= 4) {
            return {
              type: "fillRect",
              args: {
                x: this.evaluateNumeric(args[0]),
                y: this.evaluateNumeric(args[1]),
                width: this.evaluateNumeric(args[2]),
                height: this.evaluateNumeric(args[3]),
                ...(args[4]
                  ? { color: this.parseColorArg(args[4].trim()) }
                  : {}),
              },
            };
          }
          return null;

        case "drawRect":
          if (args.length >= 4) {
            return {
              type: "drawRect",
              args: {
                x: this.evaluateNumeric(args[0]),
                y: this.evaluateNumeric(args[1]),
                width: this.evaluateNumeric(args[2]),
                height: this.evaluateNumeric(args[3]),
                ...(args[4]
                  ? { color: this.parseColorArg(args[4].trim()) }
                  : {}),
              },
            };
          }
          return null;

        case "fillCircle":
          if (args.length >= 3) {
            return {
              type: "fillCircle",
              args: {
                x: this.evaluateNumeric(args[0]),
                y: this.evaluateNumeric(args[1]),
                radius: this.evaluateNumeric(args[2]),
                ...(args[3]
                  ? { color: this.parseColorArg(args[3].trim()) }
                  : {}),
              },
            };
          }
          return null;

        case "drawCircle":
          if (args.length >= 3) {
            return {
              type: "drawCircle",
              args: {
                x: this.evaluateNumeric(args[0]),
                y: this.evaluateNumeric(args[1]),
                radius: this.evaluateNumeric(args[2]),
                ...(args[3]
                  ? { color: this.parseColorArg(args[3].trim()) }
                  : {}),
              },
            };
          }
          return null;

        case "drawLine":
          if (args.length >= 4) {
            return {
              type: "drawLine",
              args: {
                x1: this.evaluateNumeric(args[0]),
                y1: this.evaluateNumeric(args[1]),
                x2: this.evaluateNumeric(args[2]),
                y2: this.evaluateNumeric(args[3]),
                ...(args[4]
                  ? { color: this.parseColorArg(args[4].trim()) }
                  : {}),
              },
            };
          }
          return null;

        case "drawPixel":
          if (args.length >= 2) {
            return {
              type: "drawPixel",
              args: {
                x: this.evaluateNumeric(args[0]),
                y: this.evaluateNumeric(args[1]),
                ...(args[2]
                  ? { color: this.parseColorArg(args[2].trim()) }
                  : {}),
              },
            };
          }
          return null;

        case "setTextColor":
          if (args.length >= 1) {
            return {
              type: "setTextColor",
              args: {
                color: this.parseColorArg(args[0].trim()),
                ...(args[1]
                  ? { bgColor: this.parseColorArg(args[1].trim()) }
                  : {}),
              },
            };
          }
          return null;

        case "setTextSize":
          if (args.length >= 1) {
            return {
              type: "setTextSize",
              args: { size: this.evaluateNumeric(args[0]) },
            };
          }
          return null;
      }
    }

    // ---- Speaker API ----
    if (obj === "Speaker") {
      if (method === "tone" && args.length >= 2) {
        return {
          type: "tone",
          args: {
            frequency: this.evaluateNumeric(args[0]),
            durationMs: this.evaluateNumeric(args[1]),
          },
        };
      }
    }

    // ---- Power API ----
    if (obj === "Power") {
      if (method === "setLed" && args.length >= 1) {
        return {
          type: "setLed",
          args: { brightness: this.evaluateNumeric(args[0]) },
        };
      }
    }

    // ---- time API ----
    if (obj === "time") {
      if (method === "sleep" && args.length >= 1) {
        return {
          type: "sleep",
          args: { ms: Math.round(this.evaluateNumeric(args[0]) * 1000) },
        };
      }
      if (method === "sleep_ms" && args.length >= 1) {
        return {
          type: "sleep",
          args: { ms: this.evaluateNumeric(args[0]) },
        };
      }
    }

    // Unrecognized API call -- skip
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

    // Hex number like 0xF800 or 0xFFFFFF
    if (trimmed.match(/^0x[0-9a-fA-F]+$/)) {
      return M5StickSimulator.resolveColor(trimmed);
    }

    // Plain number
    if (trimmed.match(/^\d+$/)) {
      return M5StickSimulator.resolveColor(parseInt(trimmed, 10));
    }

    // Variable that holds a color value
    if (/^[a-zA-Z_]\w*$/.test(trimmed) && this.variables.has(trimmed)) {
      const val = this.variables.get(trimmed)!;
      if (typeof val === "string") return M5StickSimulator.resolveColor(val);
      if (typeof val === "number") return M5StickSimulator.resolveColor(val);
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

      case "setLed":
        if (this.onLed) {
          this.onLed(args.brightness as number);
        }
        break;

      case "tone":
        // Track buzzer usage for lesson validation
        this.simulator.markBuzzerUsed();
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
