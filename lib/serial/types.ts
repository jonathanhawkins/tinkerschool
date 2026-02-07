/**
 * Web Serial API TypeScript type declarations.
 *
 * These interfaces augment the global navigator with the Serial API
 * which is available in Chrome 89+ and Edge 89+.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API
 */

export interface SerialPortRequestOptions {
  filters?: SerialPortFilter[];
}

export interface SerialPortFilter {
  usbVendorId?: number;
  usbProductId?: number;
}

export interface SerialOptions {
  baudRate: number;
  dataBits?: 7 | 8;
  stopBits?: 1 | 2;
  parity?: "none" | "even" | "odd";
  bufferSize?: number;
  flowControl?: "none" | "hardware";
}

export interface SerialPortInfo {
  usbVendorId?: number;
  usbProductId?: number;
}

export interface SerialPort extends EventTarget {
  readonly readable: ReadableStream<Uint8Array> | null;
  readonly writable: WritableStream<Uint8Array> | null;
  readonly connected: boolean;

  open(options: SerialOptions): Promise<void>;
  close(): Promise<void>;
  forget(): Promise<void>;
  getInfo(): SerialPortInfo;

  onconnect: ((this: SerialPort, ev: Event) => void) | null;
  ondisconnect: ((this: SerialPort, ev: Event) => void) | null;
}

export interface Serial extends EventTarget {
  getPorts(): Promise<SerialPort[]>;
  requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;

  onconnect: ((this: Serial, ev: Event) => void) | null;
  ondisconnect: ((this: Serial, ev: Event) => void) | null;
}

declare global {
  interface Navigator {
    readonly serial?: Serial;
  }
}

/**
 * Connection status for the device panel UI.
 */
export type ConnectionStatus = "disconnected" | "connecting" | "connected";

/**
 * Callbacks used by WebSerialManager to notify consumers of events.
 */
export interface SerialEventCallbacks {
  onData?: (data: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

/**
 * M5StickC Plus 2 USB identifiers.
 * Uses the CH9102 USB-to-serial chip.
 */
export const M5STICK_USB_FILTERS: SerialPortFilter[] = [
  { usbVendorId: 0x1a86, usbProductId: 0x55d4 },
  { usbVendorId: 0x1a86, usbProductId: 0x55d3 },
];

/**
 * Default serial connection settings for the M5StickC Plus 2.
 */
export const M5STICK_SERIAL_OPTIONS: SerialOptions = {
  baudRate: 115200,
  dataBits: 8,
  stopBits: 1,
  parity: "none",
};
