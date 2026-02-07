import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { WebSerialManager } from "./web-serial";

describe("WebSerialManager", () => {
  let manager: WebSerialManager;

  beforeEach(() => {
    manager = new WebSerialManager();
  });

  afterEach(() => {
    // Clean up any navigator.serial mock
    if ("serial" in navigator) {
      Object.defineProperty(navigator, "serial", {
        value: undefined,
        writable: true,
        configurable: true,
      });
    }
  });

  describe("isSupported()", () => {
    it("returns false when navigator.serial is undefined", () => {
      // In the jsdom test environment, navigator.serial is not available
      // by default, so this should be false.
      Object.defineProperty(navigator, "serial", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(WebSerialManager.isSupported()).toBe(false);
    });

    it("returns true when navigator.serial exists", () => {
      // Mock navigator.serial
      Object.defineProperty(navigator, "serial", {
        value: {
          requestPort: vi.fn(),
          getPorts: vi.fn(),
        },
        writable: true,
        configurable: true,
      });

      expect(WebSerialManager.isSupported()).toBe(true);
    });
  });

  describe("connected", () => {
    it("is false initially", () => {
      expect(manager.connected).toBe(false);
    });
  });

  describe("write()", () => {
    it("throws NOT_CONNECTED when not connected", async () => {
      await expect(manager.write("hello")).rejects.toThrow("NOT_CONNECTED");
    });
  });

  describe("writeBytes()", () => {
    it("throws NOT_CONNECTED when not connected", async () => {
      const data = new Uint8Array([0x01, 0x02]);
      await expect(manager.writeBytes(data)).rejects.toThrow("NOT_CONNECTED");
    });
  });

  describe("disconnect()", () => {
    it("is safe to call when not connected", async () => {
      // Should not throw
      await expect(manager.disconnect()).resolves.toBeUndefined();
    });

    it("remains disconnected after calling disconnect", async () => {
      await manager.disconnect();
      expect(manager.connected).toBe(false);
    });
  });

  describe("connect()", () => {
    it("throws WEB_SERIAL_NOT_SUPPORTED when API is unavailable", async () => {
      Object.defineProperty(navigator, "serial", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      await expect(manager.connect()).rejects.toThrow(
        "WEB_SERIAL_NOT_SUPPORTED"
      );
    });
  });

  describe("event callbacks", () => {
    it("has undefined callbacks by default", () => {
      expect(manager.onData).toBeUndefined();
      expect(manager.onConnect).toBeUndefined();
      expect(manager.onDisconnect).toBeUndefined();
      expect(manager.onError).toBeUndefined();
    });

    it("allows setting callback functions", () => {
      const onData = vi.fn();
      const onConnect = vi.fn();
      const onDisconnect = vi.fn();
      const onError = vi.fn();

      manager.onData = onData;
      manager.onConnect = onConnect;
      manager.onDisconnect = onDisconnect;
      manager.onError = onError;

      expect(manager.onData).toBe(onData);
      expect(manager.onConnect).toBe(onConnect);
      expect(manager.onDisconnect).toBe(onDisconnect);
      expect(manager.onError).toBe(onError);
    });
  });
});
