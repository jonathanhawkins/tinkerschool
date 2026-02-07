/**
 * WebSerialManager -- manages the Web Serial API connection to the
 * M5StickC Plus 2 device.
 *
 * This is a pure TypeScript class with no React or Next.js dependencies.
 * It must be used exclusively in client-side code because the Web Serial
 * API is a browser-only feature.
 */

import type { SerialEventCallbacks, SerialPort } from "@/lib/serial/types";
import {
  M5STICK_SERIAL_OPTIONS,
  M5STICK_USB_FILTERS,
} from "@/lib/serial/types";

export class WebSerialManager {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private readLoopActive = false;
  private _isConnected = false;

  // Event callbacks
  onData: SerialEventCallbacks["onData"] = undefined;
  onConnect: SerialEventCallbacks["onConnect"] = undefined;
  onDisconnect: SerialEventCallbacks["onDisconnect"] = undefined;
  onError: SerialEventCallbacks["onError"] = undefined;

  // Decoder for incoming bytes
  private decoder = new TextDecoder();

  /**
   * Check if the Web Serial API is available in the current browser.
   */
  static isSupported(): boolean {
    return (
      typeof navigator !== "undefined" && typeof navigator.serial !== "undefined"
    );
  }

  /**
   * Whether the serial port is currently open and connected.
   */
  get connected(): boolean {
    return this._isConnected;
  }

  /**
   * Open the serial port.
   *
   * This will trigger the browser's native port-picker dialog, so it
   * **must** be called from a user gesture (e.g. button click).
   *
   * The USB vendor/product filter is pre-set for the M5StickC Plus 2's
   * CH9102 chip (vendor 0x1A86, products 0x55D4 / 0x55D3).
   */
  async connect(): Promise<void> {
    if (!WebSerialManager.isSupported()) {
      throw new Error("WEB_SERIAL_NOT_SUPPORTED");
    }

    if (this._isConnected) {
      return;
    }

    try {
      // Request a port from the user -- the browser will show a picker
      // filtered to M5StickC-compatible USB devices.
      const serial = navigator.serial!;
      this.port = (await serial.requestPort({
        filters: M5STICK_USB_FILTERS,
      })) as SerialPort;

      // Open the port with M5Stick serial settings
      await this.port.open(M5STICK_SERIAL_OPTIONS);

      // Acquire writer
      if (this.port.writable) {
        this.writer = this.port.writable.getWriter();
      } else {
        throw new Error("PORT_NOT_WRITABLE");
      }

      this._isConnected = true;
      this.onConnect?.();

      // Listen for unexpected disconnect
      this.port.addEventListener("disconnect", this.handleDisconnect);

      // Start the read loop (non-blocking)
      this.startReadLoop();
    } catch (error) {
      // The user might cancel the port picker -- that throws a
      // DOMException with name "NotFoundError"
      this._isConnected = false;
      this.cleanup();

      if (error instanceof DOMException) {
        if (error.name === "NotFoundError") {
          throw new Error("NO_DEVICE_SELECTED");
        }
        if (error.name === "InvalidStateError") {
          throw new Error("PORT_ALREADY_IN_USE");
        }
        if (error.name === "NetworkError") {
          throw new Error("PORT_OPEN_FAILED");
        }
      }

      throw error;
    }
  }

  /**
   * Gracefully close the serial connection and release all resources.
   */
  async disconnect(): Promise<void> {
    if (!this._isConnected && !this.port) {
      return;
    }

    this.readLoopActive = false;

    try {
      // Cancel the reader first so the read loop exits
      if (this.reader) {
        await this.reader.cancel().catch(() => {});
        this.reader.releaseLock();
        this.reader = null;
      }

      // Release the writer
      if (this.writer) {
        await this.writer.close().catch(() => {});
        this.writer.releaseLock();
        this.writer = null;
      }

      // Close the port
      if (this.port) {
        this.port.removeEventListener("disconnect", this.handleDisconnect);
        await this.port.close().catch(() => {});
        this.port = null;
      }
    } catch {
      // Swallow errors during teardown -- the port may already be gone
    } finally {
      this._isConnected = false;
      this.onDisconnect?.();
    }
  }

  /**
   * Send a UTF-8 encoded string to the device.
   */
  async write(data: string): Promise<void> {
    console.log("[serial-tx]", JSON.stringify(data));
    const encoder = new TextEncoder();
    await this.writeBytes(encoder.encode(data));
  }

  /**
   * Send raw bytes to the device.
   */
  async writeBytes(data: Uint8Array): Promise<void> {
    if (!this._isConnected || !this.writer) {
      throw new Error("NOT_CONNECTED");
    }

    try {
      await this.writer.write(data);
    } catch (error) {
      this.onError?.(
        error instanceof Error ? error : new Error("Write failed"),
      );
      // If the write failed the connection is likely broken
      await this.disconnect();
      throw error;
    }
  }

  // ------------------------------------------------------------------
  // Private helpers
  // ------------------------------------------------------------------

  /**
   * Continuously read from the serial port and emit decoded text via
   * the onData callback.  The loop exits when the reader is cancelled
   * or the port disconnects.
   */
  private async startReadLoop(): Promise<void> {
    if (!this.port?.readable) {
      return;
    }

    this.readLoopActive = true;

    try {
      this.reader = this.port.readable.getReader();

      while (this.readLoopActive) {
        const { value, done } = await this.reader.read();

        if (done) {
          break;
        }

        if (value && value.length > 0) {
          const text = this.decoder.decode(value, { stream: true });
          this.onData?.(text);
        }
      }
    } catch (error) {
      // A read error while still "active" means the device was yanked
      if (this.readLoopActive) {
        this.onError?.(
          error instanceof Error ? error : new Error("Read failed"),
        );
      }
    } finally {
      // Make sure we release the reader lock even on error
      if (this.reader) {
        try {
          this.reader.releaseLock();
        } catch {
          // Already released or port closed
        }
        this.reader = null;
      }

      // If the loop exited unexpectedly, trigger disconnect
      if (this._isConnected) {
        this._isConnected = false;
        this.cleanup();
        this.onDisconnect?.();
      }
    }
  }

  /**
   * Handle the browser's "disconnect" event (USB cable unplugged, etc.).
   */
  private handleDisconnect = (): void => {
    this.readLoopActive = false;
    this._isConnected = false;
    this.cleanup();
    this.onDisconnect?.();
  };

  /**
   * Release all handles without closing the port (used after the port
   * is already gone).
   */
  private cleanup(): void {
    if (this.reader) {
      try {
        this.reader.releaseLock();
      } catch {
        // noop
      }
      this.reader = null;
    }

    if (this.writer) {
      try {
        this.writer.releaseLock();
      } catch {
        // noop
      }
      this.writer = null;
    }

    this.port = null;
  }
}
