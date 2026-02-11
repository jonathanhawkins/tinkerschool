/**
 * Serial module barrel export.
 *
 * Re-exports all public types and classes for device communication:
 *  - DeviceTransport  (abstract interface)
 *  - WebSerialManager (USB via Web Serial API)
 *  - WebREPLManager   (WiFi via WebSocket)
 *  - MicroPythonREPL  (REPL protocol over any transport)
 *  - ConnectionDetector (browser capability detection)
 *  - Types (Web Serial API declarations, USB identifiers)
 */

// Core transport abstraction
export {
  type DeviceTransport,
  type TransportEventCallbacks,
  type TransportType,
  isTransportAvailable,
} from "./device-transport";

// Transport implementations
export { WebSerialManager } from "./web-serial";
export { WebREPLManager, type WebREPLConfig } from "./webrepl-client";

// REPL protocol (works over any transport)
export { MicroPythonREPL } from "./micropython-repl";

// Browser capability detection
export {
  getAvailableConnections,
  hasAnyConnection,
  getRecommendedConnection,
  type ConnectionMethod,
} from "./connection-detector";

// Web Serial API types and M5Stick constants
export {
  type ConnectionStatus,
  type SerialEventCallbacks,
  M5STICK_USB_FILTERS,
  M5STICK_SERIAL_OPTIONS,
} from "./types";
