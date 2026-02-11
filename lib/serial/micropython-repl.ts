/**
 * MicroPythonREPL -- implements the MicroPython REPL protocol on top
 * of any DeviceTransport (USB Serial or WiFi WebREPL).
 *
 * Supports:
 *  - Entering / exiting raw REPL mode
 *  - Executing code via raw paste mode
 *  - Interrupting a running program
 *  - Soft-resetting the device
 *
 * MicroPython control characters:
 *   Ctrl-A  (0x01) = Enter raw REPL mode
 *   Ctrl-B  (0x02) = Exit raw REPL (back to friendly mode)
 *   Ctrl-C  (0x03) = Interrupt running program
 *   Ctrl-D  (0x04) = Soft reset / execute in raw mode
 *   Ctrl-E  (0x05) = Enter paste mode
 */

import type { DeviceTransport } from "@/lib/serial/device-transport";

// Control characters
const CTRL_A = "\x01"; // raw REPL
const CTRL_B = "\x02"; // exit raw REPL
const CTRL_C = "\x03"; // interrupt
const CTRL_D = "\x04"; // execute / soft reset

/** How long (ms) to wait for a REPL prompt before giving up. */
const REPL_TIMEOUT = 8_000;

/** How many times to retry entering raw REPL before giving up. */
const MAX_REPL_RETRIES = 2;

/** How long (ms) to wait for code execution output before giving up. */
const EXEC_TIMEOUT = 30_000;

/**
 * Small helper: wait for a given number of milliseconds.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MicroPythonREPL {
  private transport: DeviceTransport;

  /**
   * Internal buffer that accumulates data coming from the device.
   * We hook into `transport.onData` while waiting for specific prompts.
   */
  private dataBuffer = "";
  private previousOnData: ((data: string) => void) | undefined = undefined;

  constructor(transport: DeviceTransport) {
    this.transport = transport;
  }

  // ------------------------------------------------------------------
  // Public API
  // ------------------------------------------------------------------

  /**
   * Enter raw REPL mode.
   *
   * Aggressively interrupts any running program (including UIFlow2 demo),
   * then switches into raw REPL. Retries with a soft reset if needed.
   */
  async enterRawRepl(): Promise<void> {
    this.ensureConnected();

    for (let attempt = 0; attempt <= MAX_REPL_RETRIES; attempt++) {
      try {
        if (attempt === 0) {
          // First attempt: aggressive Ctrl-C burst to break out of
          // any running program (UIFlow2 demo, boot.py loops, etc.)
          for (let i = 0; i < 4; i++) {
            await this.transport.write(CTRL_C);
            await delay(150);
          }
          // Send newline to trigger the >>> prompt after interrupt
          await this.transport.write("\r\n");
          await delay(300);
        } else {
          // Retry: exit any stuck state, soft reset, then interrupt
          await this.transport.write(CTRL_B); // exit raw REPL if stuck
          await delay(200);
          for (let i = 0; i < 3; i++) {
            await this.transport.write(CTRL_C);
            await delay(100);
          }
          await this.transport.write(CTRL_D); // soft reset
          await delay(2_000); // wait for reboot (UIFlow2 takes longer)
          // Interrupt the boot script before it enters the demo loop
          for (let i = 0; i < 4; i++) {
            await this.transport.write(CTRL_C);
            await delay(200);
          }
          await this.transport.write("\r\n");
          await delay(500);
        }

        // Request raw REPL
        await this.transport.write(CTRL_A);

        // Wait for the raw REPL prompt
        await this.waitForResponse(
          "raw REPL",
          REPL_TIMEOUT,
          "Timed out entering raw REPL mode. Is MicroPython running?",
        );

        return; // Success
      } catch (err) {
        if (attempt >= MAX_REPL_RETRIES) {
          throw err; // Give up after all retries
        }
        // Try again with soft reset
      }
    }
  }

  /**
   * Exit raw REPL mode and return to the friendly interactive prompt.
   */
  async exitRawRepl(): Promise<void> {
    this.ensureConnected();
    await this.transport.write(CTRL_B);
    await delay(100);
  }

  /**
   * Execute Python code on the device via raw REPL and return
   * the combined stdout output.
   *
   * Protocol (basic raw REPL -- no paste mode for UIFlow2 compatibility):
   *  1. Enter raw REPL  (Ctrl-A)
   *  2. Send code (line by line, small delay between lines for flow control)
   *  3. Execute           (Ctrl-D)
   *  4. Read output until the `OK` soft-reboot or `>` prompt
   *  5. Exit raw REPL     (Ctrl-B)
   */
  async executeCode(code: string): Promise<string> {
    this.ensureConnected();

    // Step 1 -- make sure we are in raw REPL
    await this.enterRawRepl();

    // Step 2 -- send code line by line with a small pause for flow control.
    // In basic raw REPL, code is buffered until Ctrl-D.
    const lines = code.split("\n");
    for (const line of lines) {
      await this.transport.write(line + "\r\n");
      // Small delay for flow control so the device doesn't overflow
      await delay(10);
    }

    // Step 3 -- execute
    await this.transport.write(CTRL_D);

    // Step 4 -- collect output until we see the OK marker
    const output = await this.waitForExecution(EXEC_TIMEOUT);

    // Step 5 -- back to friendly mode
    await this.exitRawRepl();

    return output;
  }

  /**
   * Interrupt whatever is currently running on the device (Ctrl-C).
   * Sends multiple interrupts to break out of tight loops.
   */
  async interrupt(): Promise<void> {
    this.ensureConnected();
    for (let i = 0; i < 4; i++) {
      await this.transport.write(CTRL_C);
      await delay(100);
    }
    // Nudge the REPL prompt
    await this.transport.write("\r\n");
  }

  /**
   * Perform a MicroPython soft reset (Ctrl-D in normal/friendly mode).
   * This restarts the device firmware without a full power cycle.
   */
  async softReset(): Promise<void> {
    this.ensureConnected();

    // Make sure we are in friendly mode first
    await this.transport.write(CTRL_C);
    await delay(100);
    await this.transport.write(CTRL_B);
    await delay(100);

    // Ctrl-D triggers a soft reset when in friendly mode
    await this.transport.write(CTRL_D);
  }

  // ------------------------------------------------------------------
  // Private helpers
  // ------------------------------------------------------------------

  /**
   * Guard: throws if the transport is not connected.
   */
  private ensureConnected(): void {
    if (!this.transport.connected) {
      throw new Error("NOT_CONNECTED");
    }
  }

  /**
   * Temporarily intercept the transport onData callback so we can
   * accumulate incoming text in our buffer.
   */
  private startCapture(): void {
    this.dataBuffer = "";
    this.previousOnData = this.transport.onData;
    this.transport.onData = (data: string) => {
      this.dataBuffer += data;
      // Also forward to the previous handler so the terminal still
      // receives live output.
      this.previousOnData?.(data);
    };
  }

  /**
   * Stop intercepting and restore the previous onData callback.
   */
  private stopCapture(): void {
    this.transport.onData = this.previousOnData;
    this.previousOnData = undefined;
  }

  /**
   * Wait until the internal data buffer contains a given marker string.
   *
   * @param marker   Substring to look for.
   * @param timeout  Maximum wait time in ms.
   * @param message  Human-readable error message on timeout.
   */
  private async waitForResponse(
    marker: string,
    timeout: number,
    message: string,
  ): Promise<string> {
    this.startCapture();

    try {
      const deadline = Date.now() + timeout;

      while (Date.now() < deadline) {
        if (this.dataBuffer.includes(marker)) {
          return this.dataBuffer;
        }
        await delay(50);
      }

      throw new Error(message);
    } finally {
      this.stopCapture();
    }
  }

  /**
   * Wait for code execution to complete in raw paste mode.
   *
   * In raw REPL the device sends:
   *   OK<stdout>\x04<stderr>\x04>
   *
   * We watch for the trailing `\x04>` which indicates the prompt is
   * back.  We return just the stdout portion (between the first OK
   * and the first \x04).
   */
  private async waitForExecution(timeout: number): Promise<string> {
    this.startCapture();

    try {
      const deadline = Date.now() + timeout;

      while (Date.now() < deadline) {
        // Look for the raw REPL completion marker: \x04 followed by >
        // The full pattern is: OK<stdout>\x04<stderr>\x04>
        if (this.dataBuffer.includes("\x04>")) {
          return this.parseExecutionOutput(this.dataBuffer);
        }
        await delay(50);
      }

      // Even on timeout, return whatever we collected
      return this.parseExecutionOutput(this.dataBuffer);
    } finally {
      this.stopCapture();
    }
  }

  /**
   * Parse the raw REPL execution output.
   *
   * Expected format: `OK<stdout>\x04<stderr>\x04>`
   *
   * Returns the stdout portion.  If stderr is non-empty, it is
   * appended after a separator so the caller can see errors.
   */
  private parseExecutionOutput(raw: string): string {
    // Find the "OK" marker that starts the output
    const okIndex = raw.indexOf("OK");
    const content = okIndex >= 0 ? raw.slice(okIndex + 2) : raw;

    // Split on \x04 -- parts[0] is stdout, parts[1] is stderr
    const parts = content.split("\x04");
    const stdout = (parts[0] ?? "").trim();
    const stderr = (parts[1] ?? "").replace(">", "").trim();

    if (stderr) {
      return stdout ? `${stdout}\n--- Error ---\n${stderr}` : stderr;
    }

    return stdout;
  }
}
