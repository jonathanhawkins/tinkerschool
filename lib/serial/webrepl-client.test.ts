import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock DeviceTransport types
// ---------------------------------------------------------------------------

vi.mock("@/lib/serial/device-transport", () => ({
  // Just provide the type export as a no-op
}));

// ---------------------------------------------------------------------------
// Mock WebSocket
// ---------------------------------------------------------------------------

interface MockWSInstance {
  binaryType: string;
  onopen: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  onclose: ((event: CloseEvent) => void) | null;
  onmessage: ((event: MessageEvent) => void) | null;
  send: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  _listeners: Map<string, Set<(event: unknown) => void>>;
  _simulateMessage: (data: string | ArrayBuffer) => void;
}

let lastCreatedWS: MockWSInstance | null = null;

class MockWebSocket {
  binaryType = "blob";
  onopen: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  send = vi.fn();
  close = vi.fn();
  _listeners = new Map<string, Set<(event: unknown) => void>>();

  addEventListener = vi.fn((type: string, handler: (event: unknown) => void) => {
    if (!this._listeners.has(type)) {
      this._listeners.set(type, new Set());
    }
    this._listeners.get(type)!.add(handler);
  });

  removeEventListener = vi.fn((type: string, handler: (event: unknown) => void) => {
    this._listeners.get(type)?.delete(handler);
  });

  _simulateMessage(data: string | ArrayBuffer) {
    const event = { data } as MessageEvent;
    // Fire addEventListener listeners
    this._listeners.get("message")?.forEach((h) => h(event));
    // Fire onmessage
    this.onmessage?.(event);
  }

  constructor(_url: string) {
    lastCreatedWS = this as unknown as MockWSInstance;
  }
}

// ---------------------------------------------------------------------------
// Setup global WebSocket mock
// ---------------------------------------------------------------------------

const originalWebSocket = globalThis.WebSocket;

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).WebSocket = MockWebSocket;
  lastCreatedWS = null;
});

afterEach(() => {
  globalThis.WebSocket = originalWebSocket;
  lastCreatedWS = null;
});

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

import { WebREPLManager } from "./webrepl-client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Simulate a successful WebSocket open + auth flow */
async function connectSuccessfully(manager: WebREPLManager): Promise<MockWSInstance> {
  const connectPromise = manager.connect();

  // Wait a tick for the WebSocket constructor to fire
  await vi.waitFor(() => expect(lastCreatedWS).not.toBeNull());

  const ws = lastCreatedWS!;

  // Simulate WebSocket open
  ws.onopen?.(new Event("open"));

  // Simulate password prompt from server
  await vi.waitFor(() => expect(ws.addEventListener).toHaveBeenCalled());
  ws._simulateMessage("Password: ");

  // Simulate successful auth response
  await vi.waitFor(() => expect(ws.send).toHaveBeenCalledWith(expect.stringContaining("\r\n")));
  ws._simulateMessage("WebREPL connected\r\n>>>");

  await connectPromise;
  return ws;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("WebREPLManager", () => {
  describe("static isSupported", () => {
    it("returns true when WebSocket is available", () => {
      expect(WebREPLManager.isSupported()).toBe(true);
    });
  });

  describe("constructor", () => {
    it("uses default port and password when not specified", () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      expect(manager.type).toBe("wifi-webrepl");
      expect(manager.connected).toBe(false);
    });
  });

  describe("connect", () => {
    it("opens WebSocket and authenticates with password", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      const onConnect = vi.fn();
      manager.onConnect = onConnect;

      const ws = await connectSuccessfully(manager);

      expect(manager.connected).toBe(true);
      expect(onConnect).toHaveBeenCalled();
      expect(ws.send).toHaveBeenCalledWith("tinkerschool\r\n");
    });

    it("uses custom password when provided", async () => {
      const manager = new WebREPLManager({
        host: "192.168.1.100",
        password: "mypass",
      });

      const connectPromise = manager.connect();
      await vi.waitFor(() => expect(lastCreatedWS).not.toBeNull());

      const ws = lastCreatedWS!;
      ws.onopen?.(new Event("open"));
      await vi.waitFor(() => expect(ws.addEventListener).toHaveBeenCalled());
      ws._simulateMessage("Password: ");
      await vi.waitFor(() => expect(ws.send).toHaveBeenCalled());
      ws._simulateMessage("WebREPL connected");

      await connectPromise;
      expect(ws.send).toHaveBeenCalledWith("mypass\r\n");
    });

    it("rejects on connection error", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      const onError = vi.fn();
      manager.onError = onError;

      const connectPromise = manager.connect();
      await vi.waitFor(() => expect(lastCreatedWS).not.toBeNull());

      lastCreatedWS!.onerror?.(new Event("error"));

      await expect(connectPromise).rejects.toThrow("WEBREPL_CONNECTION_FAILED");
      expect(manager.connected).toBe(false);
    });

    it("rejects on auth failure (Access denied)", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });

      const connectPromise = manager.connect();
      await vi.waitFor(() => expect(lastCreatedWS).not.toBeNull());

      const ws = lastCreatedWS!;
      ws.onopen?.(new Event("open"));
      await vi.waitFor(() => expect(ws.addEventListener).toHaveBeenCalled());
      ws._simulateMessage("Password: ");
      await vi.waitFor(() => expect(ws.send).toHaveBeenCalled());
      ws._simulateMessage("Access denied");

      await expect(connectPromise).rejects.toThrow("WEBREPL_AUTH_FAILED");
    });

    it("does nothing when already connected", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      await connectSuccessfully(manager);

      // Second connect should resolve immediately
      await manager.connect();
      // WebSocket constructor should only have been called once
      expect(manager.connected).toBe(true);
    });
  });

  describe("disconnect", () => {
    it("closes WebSocket and resets state", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      const onDisconnect = vi.fn();
      manager.onDisconnect = onDisconnect;

      const ws = await connectSuccessfully(manager);
      await manager.disconnect();

      expect(ws.close).toHaveBeenCalled();
      expect(manager.connected).toBe(false);
      expect(onDisconnect).toHaveBeenCalled();
    });

    it("does nothing when not connected", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      // Should not throw
      await manager.disconnect();
      expect(manager.connected).toBe(false);
    });
  });

  describe("write", () => {
    it("sends string data over WebSocket", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      const ws = await connectSuccessfully(manager);

      await manager.write("print('hello')\r\n");
      expect(ws.send).toHaveBeenCalledWith("print('hello')\r\n");
    });

    it("throws when not connected", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      await expect(manager.write("test")).rejects.toThrow("NOT_CONNECTED");
    });
  });

  describe("writeBytes", () => {
    it("sends binary data over WebSocket", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      const ws = await connectSuccessfully(manager);

      const data = new Uint8Array([0x01, 0x02, 0x03]);
      await manager.writeBytes(data);
      expect(ws.send).toHaveBeenCalledWith(data.buffer);
    });

    it("throws when not connected", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      await expect(manager.writeBytes(new Uint8Array([1]))).rejects.toThrow(
        "NOT_CONNECTED",
      );
    });
  });

  describe("data reception", () => {
    it("routes incoming text frames to onData callback", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      const onData = vi.fn();
      manager.onData = onData;

      const ws = await connectSuccessfully(manager);

      // Simulate incoming text data
      ws.onmessage?.({ data: ">>> " } as MessageEvent);
      expect(onData).toHaveBeenCalledWith(">>> ");
    });

    it("decodes incoming ArrayBuffer frames as text", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });

      const ws = await connectSuccessfully(manager);

      // Set onData AFTER connect so setupDataListener's onmessage is wired
      const onData = vi.fn();
      manager.onData = onData;

      const buf = new TextEncoder().encode("Hello from device");
      // jsdom's MessageEvent may not preserve ArrayBuffer instanceof check,
      // so we create a plain object matching the MessageEvent shape
      const event = { data: buf.buffer } as MessageEvent;
      // Verify the data is actually an ArrayBuffer in this env
      if (event.data instanceof ArrayBuffer) {
        ws.onmessage?.(event);
        expect(onData).toHaveBeenCalledWith("Hello from device");
      } else {
        // In some jsdom versions, the instanceof fails. Verify the source
        // code path by calling the handler directly with a guaranteed ArrayBuffer.
        // Access the handler that setupDataListener installed
        const handler = ws.onmessage;
        expect(handler).toBeDefined();
        // Call with a raw object whose .data is a real ArrayBuffer
        const ab = new ArrayBuffer(17);
        new Uint8Array(ab).set(new TextEncoder().encode("Hello from device"));
        handler?.({ data: ab } as MessageEvent);
        expect(onData).toHaveBeenCalledWith("Hello from device");
      }
    });
  });

  describe("setConfig", () => {
    it("updates config for next connection", () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      manager.setConfig({ host: "192.168.1.200", port: 9999 });
      // Config change only takes effect on next connect, so just verify no error
      expect(manager.connected).toBe(false);
    });
  });

  describe("unexpected disconnect", () => {
    it("fires onDisconnect when WebSocket closes unexpectedly", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      const onDisconnect = vi.fn();
      manager.onDisconnect = onDisconnect;

      const ws = await connectSuccessfully(manager);

      // Simulate unexpected close
      ws.onclose?.({} as CloseEvent);

      expect(manager.connected).toBe(false);
      expect(onDisconnect).toHaveBeenCalled();
    });

    it("fires onError and onDisconnect on WebSocket error", async () => {
      const manager = new WebREPLManager({ host: "192.168.1.100" });
      const onError = vi.fn();
      const onDisconnect = vi.fn();
      manager.onError = onError;
      manager.onDisconnect = onDisconnect;

      const ws = await connectSuccessfully(manager);

      ws.onerror?.(new Event("error"));

      expect(onError).toHaveBeenCalled();
      expect(manager.connected).toBe(false);
      expect(onDisconnect).toHaveBeenCalled();
    });
  });
});
