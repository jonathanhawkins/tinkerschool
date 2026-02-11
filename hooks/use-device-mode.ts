/**
 * useDeviceMode -- detects whether the user is on a desktop, tablet, or phone.
 *
 * Detection signals (in priority order):
 *  1. pointer: coarse (primary input is touch -- Fire tablets, Android tablets)
 *  2. maxTouchPoints > 0 (touch-capable -- catches iPads which report pointer: fine)
 *  3. iPad-specific UA/platform heuristic (iPadOS 13+ masquerades as macOS)
 *  4. Screen width to distinguish phone vs tablet vs large-screen touch
 *  5. Falls back to desktop when in doubt
 *
 * This drives UI adaptations:
 *  - Desktop: sidebar nav, hover states, USB + WiFi device connections
 *  - Tablet: bottom tab nav, larger touch targets, WiFi device connection
 *  - Phone: bottom tab nav, compact layout, simulator only
 *
 * Supported tablets:
 *  - Amazon Fire (Silk browser) -- pointer: coarse, WebSocket works
 *  - iPad Air/Pro (Safari/Chrome) -- pointer: fine, maxTouchPoints: 5
 *  - Samsung Galaxy Tab (Chrome) -- pointer: coarse
 *  - Surface Pro (tablet mode) -- pointer: coarse when detached
 */

import { useSyncExternalStore } from "react";

export type DeviceMode = "desktop" | "tablet" | "phone";

/**
 * Minimum screen width (px) to be considered a tablet (not phone).
 */
const TABLET_MIN_WIDTH = 600;

/**
 * Maximum screen width (px) to be considered a tablet (not desktop).
 * Beyond this, we treat it as desktop even with touch.
 */
const TABLET_MAX_WIDTH = 1400;

/**
 * Detect if the current device is an iPad.
 *
 * iPadOS 13+ reports itself as "Macintosh" in the user agent and
 * sets `pointer: fine` (because it supports cursor/Apple Pencil).
 * However, it still has `maxTouchPoints >= 2`.
 *
 * This catches iPad Air, iPad Pro, iPad Mini, and regular iPads.
 */
function isIPad(): boolean {
  if (typeof navigator === "undefined") return false;

  // Direct check: older iPads and some browsers still report "iPad"
  if (/iPad/.test(navigator.userAgent)) return true;

  // iPadOS 13+ masquerades as macOS -- detect via touch + Mac platform
  if (
    /Macintosh/.test(navigator.userAgent) &&
    navigator.maxTouchPoints > 1
  ) {
    return true;
  }

  return false;
}

function detectDeviceMode(): DeviceMode {
  if (typeof window === "undefined") {
    return "desktop"; // SSR fallback
  }

  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const hasTouchPoints =
    typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

  // iPads report pointer: fine but are still touch-first tablets
  const iPad = isIPad();

  const isTouch = hasCoarsePointer || hasTouchPoints || iPad;

  if (!isTouch) {
    return "desktop";
  }

  const width = window.innerWidth;

  if (width < TABLET_MIN_WIDTH) {
    return "phone";
  }

  // iPads are always tablets regardless of screen width
  // (iPad Pro 12.9" is 1024px in portrait, 1366px in landscape)
  if (iPad) {
    return "tablet";
  }

  if (width <= TABLET_MAX_WIDTH) {
    return "tablet";
  }

  // Large touch screen (e.g. Surface Pro in desktop mode) -- treat as desktop
  return "desktop";
}

/**
 * Get the initial device mode for SSR-safe initialization.
 * Returns "desktop" on the server, real detection on the client.
 */
function getServerSnapshot(): DeviceMode {
  return "desktop";
}

function getClientSnapshot(): DeviceMode {
  return detectDeviceMode();
}

// Subscriptions for useSyncExternalStore
const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);

  // Listen for events that might change device mode
  const handler = () => {
    listeners.forEach((fn) => fn());
  };

  window.addEventListener("resize", handler);
  window.addEventListener("orientationchange", handler);

  const mql = window.matchMedia("(pointer: coarse)");
  mql.addEventListener("change", handler);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("resize", handler);
    window.removeEventListener("orientationchange", handler);
    mql.removeEventListener("change", handler);
  };
}

/**
 * React hook that returns the current device mode.
 *
 * Uses useSyncExternalStore for SSR-safe hydration -- no flash
 * from "desktop" to "tablet" on initial render.
 */
export function useDeviceMode(): DeviceMode {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

/**
 * Convenience helpers for common checks.
 */
export function isTablet(mode: DeviceMode): boolean {
  return mode === "tablet";
}

export function isMobile(mode: DeviceMode): boolean {
  return mode === "phone";
}

export function isTouchDevice(mode: DeviceMode): boolean {
  return mode === "tablet" || mode === "phone";
}
