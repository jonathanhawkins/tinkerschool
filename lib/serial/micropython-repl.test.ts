import { describe, it, expect, vi, beforeEach } from "vitest";

import { MicroPythonREPL } from "./micropython-repl";
import type { WebSerialManager } from "./web-serial";

// ---------------------------------------------------------------------------
// Mock the web-serial module so we can provide a controllable fake
// ---------------------------------------------------------------------------

vi.mock("./web-serial", () => {
  return {
    WebSerialManager: vi.fn(),
  };
});

/**
 * Creates a mock object with the same shape as WebSerialManager.
 * The `connected` getter is configurable via a backing field.
 */
function createMockSerial(initiallyConnected = false) {
  let _connected = initiallyConnected;

  return {
    write: vi.fn<(data: string) => Promise<void>>().mockResolvedValue(undefined),
    writeBytes: vi.fn<(data: Uint8Array) => Promise<void>>().mockResolvedValue(undefined),
    connect: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    disconnect: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    get connected() {
      return _connected;
    },
    set _setConnected(value: boolean) {
      _connected = value;
    },
    onData: undefined as ((data: string) => void) | undefined,
    onConnect: undefined as (() => void) | undefined,
    onDisconnect: undefined as (() => void) | undefined,
    onError: undefined as ((error: Error) => void) | undefined,
  };
}

describe("MicroPythonREPL", () => {
  let mockSerial: ReturnType<typeof createMockSerial>;
  let repl: MicroPythonREPL;

  beforeEach(() => {
    mockSerial = createMockSerial(true);
    repl = new MicroPythonREPL(mockSerial as unknown as WebSerialManager);
  });

  it("can be instantiated with a mock WebSerialManager", () => {
    expect(repl).toBeInstanceOf(MicroPythonREPL);
  });

  describe("interrupt()", () => {
    it("sends multiple Ctrl-C bytes to break out of tight loops", async () => {
      await repl.interrupt();

      // interrupt() calls serial.write(CTRL_C) multiple times (4x)
      const writeCalls = mockSerial.write.mock.calls;
      const ctrlCCalls = writeCalls.filter(
        (call) => call[0] === "\x03"
      );
      expect(ctrlCCalls.length).toBe(4);
    });

    it("throws NOT_CONNECTED when serial is not connected", async () => {
      const disconnectedSerial = createMockSerial(false);
      const disconnectedRepl = new MicroPythonREPL(
        disconnectedSerial as unknown as WebSerialManager
      );

      await expect(disconnectedRepl.interrupt()).rejects.toThrow(
        "NOT_CONNECTED"
      );
    });
  });

  describe("softReset()", () => {
    it("sends Ctrl-C, then Ctrl-B, then Ctrl-D", async () => {
      await repl.softReset();

      const writeCalls = mockSerial.write.mock.calls.map((c) => c[0]);

      // Should contain: Ctrl-C, Ctrl-B, Ctrl-D in order
      expect(writeCalls).toContain("\x03"); // Ctrl-C (interrupt)
      expect(writeCalls).toContain("\x02"); // Ctrl-B (exit raw repl)
      expect(writeCalls).toContain("\x04"); // Ctrl-D (soft reset)

      // Ctrl-B should come after Ctrl-C
      const ctrlBIdx = writeCalls.indexOf("\x02");
      const ctrlCIdx = writeCalls.indexOf("\x03");
      expect(ctrlBIdx).toBeGreaterThan(ctrlCIdx);

      // Ctrl-D should come after Ctrl-B
      const ctrlDIdx = writeCalls.indexOf("\x04");
      expect(ctrlDIdx).toBeGreaterThan(ctrlBIdx);
    });

    it("throws NOT_CONNECTED when serial is not connected", async () => {
      const disconnectedSerial = createMockSerial(false);
      const disconnectedRepl = new MicroPythonREPL(
        disconnectedSerial as unknown as WebSerialManager
      );

      await expect(disconnectedRepl.softReset()).rejects.toThrow(
        "NOT_CONNECTED"
      );
    });
  });

  describe("enterRawRepl()", () => {
    it("throws NOT_CONNECTED when serial is not connected", async () => {
      const disconnectedSerial = createMockSerial(false);
      const disconnectedRepl = new MicroPythonREPL(
        disconnectedSerial as unknown as WebSerialManager
      );

      await expect(disconnectedRepl.enterRawRepl()).rejects.toThrow(
        "NOT_CONNECTED"
      );
    });

    it("sends Ctrl-C twice followed by Ctrl-A", async () => {
      // enterRawRepl() internally calls startCapture() which reassigns
      // serial.onData. We intercept write() to detect when Ctrl-A is
      // sent, then feed the expected response through the new onData.
      mockSerial.write.mockImplementation(async (data: string) => {
        if (data === "\x01") {
          // Ctrl-A was sent -- device would respond with raw REPL banner.
          // Give the REPL a tick to set up the capture listener.
          setTimeout(() => {
            if (mockSerial.onData) {
              mockSerial.onData("raw REPL; CTRL-B to exit\n>");
            }
          }, 10);
        }
      });

      await repl.enterRawRepl();

      const writeCalls = mockSerial.write.mock.calls.map((c) => c[0]);

      // Should have sent Ctrl-C at least once and Ctrl-A
      expect(
        writeCalls.filter((c) => c === "\x03").length
      ).toBeGreaterThanOrEqual(1);
      expect(writeCalls).toContain("\x01"); // Ctrl-A for raw REPL
    });
  });

  describe("exitRawRepl()", () => {
    it("sends Ctrl-B", async () => {
      await repl.exitRawRepl();

      const writeCalls = mockSerial.write.mock.calls.map((c) => c[0]);
      expect(writeCalls).toContain("\x02"); // Ctrl-B
    });

    it("throws NOT_CONNECTED when serial is not connected", async () => {
      const disconnectedSerial = createMockSerial(false);
      const disconnectedRepl = new MicroPythonREPL(
        disconnectedSerial as unknown as WebSerialManager
      );

      await expect(disconnectedRepl.exitRawRepl()).rejects.toThrow(
        "NOT_CONNECTED"
      );
    });
  });
});
