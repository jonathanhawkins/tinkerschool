import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the device-transport module to control isTransportAvailable
vi.mock("@/lib/serial/device-transport", () => ({
  isTransportAvailable: vi.fn(),
}));

import { isTransportAvailable } from "@/lib/serial/device-transport";
import {
  getAvailableConnections,
  hasAnyConnection,
  getRecommendedConnection,
} from "./connection-detector";

const mockIsTransportAvailable = vi.mocked(isTransportAvailable);

// ---------------------------------------------------------------------------
// getAvailableConnections
// ---------------------------------------------------------------------------

describe("getAvailableConnections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns both USB and WiFi when both are available", () => {
    mockIsTransportAvailable.mockReturnValue(true);

    const connections = getAvailableConnections();

    expect(connections).toHaveLength(2);
    expect(connections[0].type).toBe("usb-serial");
    expect(connections[1].type).toBe("wifi-webrepl");
  });

  it("returns only WiFi when USB is not available (tablet)", () => {
    mockIsTransportAvailable.mockImplementation((type) => {
      if (type === "usb-serial") return false;
      if (type === "wifi-webrepl") return true;
      return false;
    });

    const connections = getAvailableConnections();

    expect(connections).toHaveLength(1);
    expect(connections[0].type).toBe("wifi-webrepl");
    expect(connections[0].label).toBe("WiFi");
    expect(connections[0].icon).toBe("wifi");
  });

  it("returns only USB when WiFi is not available", () => {
    mockIsTransportAvailable.mockImplementation((type) => {
      if (type === "usb-serial") return true;
      if (type === "wifi-webrepl") return false;
      return false;
    });

    const connections = getAvailableConnections();

    expect(connections).toHaveLength(1);
    expect(connections[0].type).toBe("usb-serial");
    expect(connections[0].label).toBe("USB Cable");
    expect(connections[0].icon).toBe("usb");
  });

  it("returns empty array when nothing is available", () => {
    mockIsTransportAvailable.mockReturnValue(false);

    const connections = getAvailableConnections();

    expect(connections).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// hasAnyConnection
// ---------------------------------------------------------------------------

describe("hasAnyConnection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns true when at least one connection is available", () => {
    mockIsTransportAvailable.mockImplementation((type) => {
      return type === "wifi-webrepl";
    });

    expect(hasAnyConnection()).toBe(true);
  });

  it("returns false when no connections are available", () => {
    mockIsTransportAvailable.mockReturnValue(false);

    expect(hasAnyConnection()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getRecommendedConnection
// ---------------------------------------------------------------------------

describe("getRecommendedConnection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("recommends USB when both are available (USB is faster)", () => {
    mockIsTransportAvailable.mockReturnValue(true);

    const recommended = getRecommendedConnection();

    expect(recommended).not.toBeNull();
    expect(recommended!.type).toBe("usb-serial");
  });

  it("recommends WiFi when only WiFi is available", () => {
    mockIsTransportAvailable.mockImplementation((type) => {
      return type === "wifi-webrepl";
    });

    const recommended = getRecommendedConnection();

    expect(recommended).not.toBeNull();
    expect(recommended!.type).toBe("wifi-webrepl");
  });

  it("returns null when no connections are available", () => {
    mockIsTransportAvailable.mockReturnValue(false);

    const recommended = getRecommendedConnection();

    expect(recommended).toBeNull();
  });
});
