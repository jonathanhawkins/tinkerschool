/**
 * ConnectionDetector -- detects available device connection methods
 * based on the current browser capabilities.
 *
 * Used by the DevicePanel to show the right connection UI:
 *  - Desktop Chrome: USB Serial + WiFi WebREPL
 *  - Tablet (Silk/Chrome): WiFi WebREPL only
 *  - Phone: Simulator only (no device connection)
 */

import { isTransportAvailable, type TransportType } from "@/lib/serial/device-transport";

/**
 * A connection method available to the user.
 */
export interface ConnectionMethod {
  type: TransportType;
  label: string;
  description: string;
  icon: "usb" | "wifi";
}

/**
 * All known connection methods and their metadata.
 */
const CONNECTION_METHODS: ConnectionMethod[] = [
  {
    type: "usb-serial",
    label: "USB Cable",
    description: "Plug in your M5Stick with a USB cable",
    icon: "usb",
  },
  {
    type: "wifi-webrepl",
    label: "WiFi",
    description: "Connect to your M5Stick over WiFi",
    icon: "wifi",
  },
];

/**
 * Get all connection methods available in the current browser.
 *
 * Returns an array of available methods, ordered by preference:
 *  - USB Serial first (fastest, most reliable) if available
 *  - WiFi WebREPL second (works everywhere)
 */
export function getAvailableConnections(): ConnectionMethod[] {
  return CONNECTION_METHODS.filter((m) => isTransportAvailable(m.type));
}

/**
 * Check if any device connection method is available.
 * Returns false only on browsers where neither USB nor WiFi works.
 */
export function hasAnyConnection(): boolean {
  return getAvailableConnections().length > 0;
}

/**
 * Get the recommended connection method for the current browser.
 * Prefers USB Serial when available, falls back to WiFi.
 */
export function getRecommendedConnection(): ConnectionMethod | null {
  const available = getAvailableConnections();
  return available[0] ?? null;
}
