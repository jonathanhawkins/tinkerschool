/**
 * WebREPLManager -- WiFi-based transport for communicating with the
 * M5StickC Plus 2 via MicroPython's WebREPL protocol.
 *
 * Works on ALL browsers (including Amazon Silk on Fire tablets) because
 * it uses standard WebSocket, not Web Serial API.
 *
 * WebREPL protocol:
 *  1. Connect via ws://IP:8266/
 *  2. Server sends password prompt as text frame
 *  3. Client sends password + "\r\n"
 *  4. Server responds with "WebREPL connected" on success
 *  5. After auth, text frames are REPL I/O (same as serial REPL)
 *
 * @see https://github.com/micropython/webrepl
 */

import type { DeviceTransport, TransportType } from "@/lib/serial/device-transport";

/** Default WebREPL port */
const WEBREPL_PORT = 8266;

/** How long (ms) to wait for the WebSocket to open */
const CONNECT_TIMEOUT = 10_000;

/** How long (ms) to wait for password authentication */
const AUTH_TIMEOUT = 5_000;

/** Default password for MicroPython WebREPL */
const DEFAULT_PASSWORD = "tinkerschool";

/**
 * Configuration for a WiFi WebREPL connection.
 */
export interface WebREPLConfig {
  /** IP address of the M5StickC Plus 2 on the local network */
  host: string;
  /** WebREPL port (default: 8266) */
  port?: number;
  /** WebREPL password (default: "tinkerschool") */
  password?: string;
}

export class WebREPLManager implements DeviceTransport {
  readonly type: TransportType = "wifi-webrepl";

  private ws: WebSocket | null = null;
  private _isConnected = false;
  private config: WebREPLConfig;

  // Event callbacks (from DeviceTransport)
  onData: ((data: string) => void) | undefined = undefined;
  onConnect: (() => void) | undefined = undefined;
  onDisconnect: (() => void) | undefined = undefined;
  onError: ((error: Error) => void) | undefined = undefined;

  constructor(config: WebREPLConfig) {
    this.config = {
      port: WEBREPL_PORT,
      password: DEFAULT_PASSWORD,
      ...config,
    };
  }

  /**
   * Check if WebSocket is available (it is in all modern browsers).
   */
  static isSupported(): boolean {
    return typeof WebSocket !== "undefined";
  }

  get connected(): boolean {
    return this._isConnected;
  }

  /**
   * Update the connection configuration (e.g. when user changes the IP).
   * Only takes effect on next connect().
   */
  setConfig(config: Partial<WebREPLConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Connect to the M5StickC Plus 2 via WebREPL.
   *
   * Unlike USB Serial, this does NOT require a user gesture -- it
   * connects programmatically to the device's IP address.
   */
  async connect(): Promise<void> {
    if (this._isConnected) {
      return;
    }

    const { host, port, password } = this.config;
    const url = `ws://${host}:${port}/`;

    try {
      // Step 1: Open WebSocket
      this.ws = await this.openWebSocket(url);

      // Step 2: Authenticate with password
      await this.authenticate(password ?? DEFAULT_PASSWORD);

      this._isConnected = true;
      this.onConnect?.();

      // Step 3: Start listening for data
      this.setupDataListener();
    } catch (error) {
      this._isConnected = false;
      this.cleanup();

      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Failed to connect to WebREPL at ${host}:${port}`,
      );
    }
  }

  async disconnect(): Promise<void> {
    if (!this._isConnected && !this.ws) {
      return;
    }

    try {
      if (this.ws) {
        this.ws.onclose = null;
        this.ws.onerror = null;
        this.ws.onmessage = null;
        this.ws.close();
      }
    } catch {
      // Swallow errors during teardown
    } finally {
      this.ws = null;
      this._isConnected = false;
      this.onDisconnect?.();
    }
  }

  async write(data: string): Promise<void> {
    if (!this._isConnected || !this.ws) {
      throw new Error("NOT_CONNECTED");
    }

    try {
      this.ws.send(data);
    } catch (error) {
      this.onError?.(
        error instanceof Error ? error : new Error("Write failed"),
      );
      await this.disconnect();
      throw error;
    }
  }

  async writeBytes(data: Uint8Array): Promise<void> {
    if (!this._isConnected || !this.ws) {
      throw new Error("NOT_CONNECTED");
    }

    try {
      this.ws.send(data);
    } catch (error) {
      this.onError?.(
        error instanceof Error ? error : new Error("Write failed"),
      );
      await this.disconnect();
      throw error;
    }
  }

  // ------------------------------------------------------------------
  // Private helpers
  // ------------------------------------------------------------------

  /**
   * Open a WebSocket connection with timeout.
   */
  private openWebSocket(url: string): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        ws.close();
        reject(
          new Error(
            "WEBREPL_CONNECT_TIMEOUT: Could not reach your M5Stick. Make sure it's on the same WiFi network!",
          ),
        );
      }, CONNECT_TIMEOUT);

      const ws = new WebSocket(url);
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        clearTimeout(timer);
        resolve(ws);
      };

      ws.onerror = () => {
        clearTimeout(timer);
        reject(
          new Error(
            "WEBREPL_CONNECTION_FAILED: Could not connect to your M5Stick. Check the IP address and make sure WebREPL is enabled!",
          ),
        );
      };

      ws.onclose = () => {
        clearTimeout(timer);
        reject(
          new Error(
            "WEBREPL_CONNECTION_CLOSED: Connection closed before it could complete.",
          ),
        );
      };
    });
  }

  /**
   * Authenticate with the WebREPL password.
   *
   * The server sends a text prompt like "Password: " then we respond
   * with the password. On success, it sends "WebREPL connected".
   */
  private authenticate(password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws) {
        reject(new Error("NOT_CONNECTED"));
        return;
      }

      const timer = setTimeout(() => {
        reject(
          new Error(
            "WEBREPL_AUTH_TIMEOUT: Authentication timed out. Is WebREPL running on your M5Stick?",
          ),
        );
      }, AUTH_TIMEOUT);

      let receivedPrompt = false;

      const handleMessage = (event: MessageEvent) => {
        const data =
          typeof event.data === "string"
            ? event.data
            : new TextDecoder().decode(event.data as ArrayBuffer);

        if (!receivedPrompt && data.includes("Password:")) {
          // Send password
          receivedPrompt = true;
          this.ws?.send(password + "\r\n");
          return;
        }

        if (receivedPrompt) {
          clearTimeout(timer);
          this.ws!.removeEventListener("message", handleMessage);

          if (
            data.includes("WebREPL connected") ||
            data.includes(">>>")
          ) {
            resolve();
          } else if (data.includes("Access denied")) {
            reject(
              new Error(
                "WEBREPL_AUTH_FAILED: Wrong password! Check the WebREPL password on your M5Stick.",
              ),
            );
          } else {
            // Some firmwares skip the "connected" message and go straight to REPL
            resolve();
          }
        }
      };

      this.ws.addEventListener("message", handleMessage);
    });
  }

  /**
   * Set up the persistent message listener after authentication.
   * Routes incoming text data to the onData callback.
   */
  private setupDataListener(): void {
    if (!this.ws) return;

    this.ws.onmessage = (event: MessageEvent) => {
      if (typeof event.data === "string") {
        this.onData?.(event.data);
      } else if (event.data instanceof ArrayBuffer) {
        // Binary frames -- decode as text for REPL output
        const text = new TextDecoder().decode(event.data);
        if (text.length > 0) {
          this.onData?.(text);
        }
      }
    };

    this.ws.onclose = () => {
      if (this._isConnected) {
        this._isConnected = false;
        this.cleanup();
        this.onDisconnect?.();
      }
    };

    this.ws.onerror = () => {
      this.onError?.(new Error("WebREPL connection error"));
      if (this._isConnected) {
        this._isConnected = false;
        this.cleanup();
        this.onDisconnect?.();
      }
    };
  }

  private cleanup(): void {
    this.ws = null;
  }
}
