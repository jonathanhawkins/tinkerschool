/**
 * DeviceTransport -- abstract interface for communicating with the
 * M5StickC Plus 2 device over any transport layer.
 *
 * Implementations:
 *  - WebSerialManager  (USB via Web Serial API -- desktop Chrome)
 *  - WebREPLManager    (WiFi via WebSocket -- works on tablets + all browsers)
 *
 * MicroPythonREPL accepts a DeviceTransport, so the same REPL protocol
 * works regardless of how the data gets to the device.
 */

/**
 * Event callbacks shared by all transport implementations.
 */
export interface TransportEventCallbacks {
  onData?: (data: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Connection method identifier for UI display and badge tracking.
 */
export type TransportType = "usb-serial" | "wifi-webrepl";

/**
 * Unified interface for device communication transports.
 *
 * All transports must:
 *  - Implement connect/disconnect lifecycle
 *  - Support bidirectional text and binary data transfer
 *  - Emit events via the callback properties
 *  - Report connection state via the `connected` getter
 */
export interface DeviceTransport extends TransportEventCallbacks {
  /** Unique identifier for this transport type. */
  readonly type: TransportType;

  /** Whether this transport is currently connected. */
  readonly connected: boolean;

  /**
   * Open the connection to the device.
   *
   * For USB: triggers the browser port picker (requires user gesture).
   * For WiFi: connects to the WebSocket at the given address.
   */
  connect(): Promise<void>;

  /**
   * Gracefully close the connection and release all resources.
   */
  disconnect(): Promise<void>;

  /**
   * Send a UTF-8 encoded string to the device.
   */
  write(data: string): Promise<void>;

  /**
   * Send raw bytes to the device.
   */
  writeBytes(data: Uint8Array): Promise<void>;
}

/**
 * Check whether a given transport type is available in the current browser.
 */
export function isTransportAvailable(type: TransportType): boolean {
  switch (type) {
    case "usb-serial":
      return (
        typeof navigator !== "undefined" &&
        typeof navigator.serial !== "undefined"
      );
    case "wifi-webrepl":
      // WebSocket is available in all modern browsers, including Silk
      return typeof WebSocket !== "undefined";
    default:
      return false;
  }
}
