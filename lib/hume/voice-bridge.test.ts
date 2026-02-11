import { describe, it, expect, vi, beforeEach } from "vitest";

import { voiceBridge } from "./voice-bridge";

/**
 * The voiceBridge is a singleton, so we need a fresh instance per test to
 * avoid inter-test coupling. We re-import via `vi.importActual` to get the
 * class and construct a new instance for each test, but since the module
 * only exports a singleton we'll operate on the real singleton and reset
 * it manually by calling setPathname("/") + clearing listeners via subscribe
 * / unsubscribe.
 *
 * A simpler approach: since VoiceBridge is a straightforward class with no
 * external dependencies, we dynamically re-import a fresh module for each
 * test using `vi.resetModules()`.
 */

function createFreshBridge() {
  // We don't have access to the class itself, only the singleton instance.
  // Inline the same pub/sub logic for isolated testing.
  // Actually, the simplest approach is to re-import:
  // But since the module is already loaded, let's use resetModules.
  // For this test suite we'll create a minimal shim that matches the class.
  // Instead, let's just use resetModules + dynamic import.
  return {} as never; // unused placeholder
}

describe("VoiceBridge", () => {
  // We use resetModules to get a fresh singleton per test.
  beforeEach(() => {
    vi.resetModules();
  });

  async function getBridge() {
    const mod = await import("./voice-bridge");
    return mod.voiceBridge;
  }

  // -----------------------------------------------------------------------
  // pathname
  // -----------------------------------------------------------------------

  it("has an initial pathname of '/'", async () => {
    const bridge = await getBridge();
    expect(bridge.pathname).toBe("/");
  });

  it("setPathname() updates the pathname", async () => {
    const bridge = await getBridge();
    bridge.setPathname("/subjects/math");
    expect(bridge.pathname).toBe("/subjects/math");
  });

  it("setPathname() ignores duplicate values (no re-notification)", async () => {
    const bridge = await getBridge();
    const listener = vi.fn();

    bridge.subscribe(listener);
    bridge.setPathname("/foo");
    bridge.setPathname("/foo"); // same path again

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith("/foo");
  });

  // -----------------------------------------------------------------------
  // subscribe / unsubscribe
  // -----------------------------------------------------------------------

  it("subscribe() returns an unsubscribe function", async () => {
    const bridge = await getBridge();
    const unsub = bridge.subscribe(() => {});
    expect(typeof unsub).toBe("function");
  });

  it("subscribers are notified when pathname changes", async () => {
    const bridge = await getBridge();
    const listener = vi.fn();

    bridge.subscribe(listener);
    bridge.setPathname("/lessons/1");

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith("/lessons/1");
  });

  it("unsubscribed listeners are NOT notified", async () => {
    const bridge = await getBridge();
    const listener = vi.fn();

    const unsub = bridge.subscribe(listener);
    unsub();
    bridge.setPathname("/gone");

    expect(listener).not.toHaveBeenCalled();
  });

  it("subscribe then immediately unsubscribe does not fire", async () => {
    const bridge = await getBridge();
    const listener = vi.fn();

    const unsub = bridge.subscribe(listener);
    unsub();
    bridge.setPathname("/instant");

    expect(listener).not.toHaveBeenCalled();
  });

  it("multiple subscribers all receive updates", async () => {
    const bridge = await getBridge();
    const listenerA = vi.fn();
    const listenerB = vi.fn();
    const listenerC = vi.fn();

    bridge.subscribe(listenerA);
    bridge.subscribe(listenerB);
    bridge.subscribe(listenerC);
    bridge.setPathname("/multi");

    expect(listenerA).toHaveBeenCalledWith("/multi");
    expect(listenerB).toHaveBeenCalledWith("/multi");
    expect(listenerC).toHaveBeenCalledWith("/multi");
  });

  it("unsubscribing one listener does not affect others", async () => {
    const bridge = await getBridge();
    const listenerA = vi.fn();
    const listenerB = vi.fn();

    bridge.subscribe(listenerA);
    const unsubB = bridge.subscribe(listenerB);

    unsubB();
    bridge.setPathname("/partial");

    expect(listenerA).toHaveBeenCalledWith("/partial");
    expect(listenerB).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------------------------
  // navigate
  // -----------------------------------------------------------------------

  it("navigate() calls the registered handler", async () => {
    const bridge = await getBridge();
    const handler = vi.fn();

    bridge.setNavigateHandler(handler);
    bridge.navigate("/subjects/science");

    expect(handler).toHaveBeenCalledWith("/subjects/science");
  });

  it("navigate() falls back to window.location when no handler set", async () => {
    const bridge = await getBridge();

    // jsdom doesn't allow redefining window.location.href via spyOn.
    // Instead, replace window.location entirely with a mock object.
    const originalLocation = window.location;
    const mockLocation = { href: "" } as Location;
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
      configurable: true,
    });

    bridge.navigate("/fallback");

    expect(mockLocation.href).toBe("/fallback");

    // Restore original window.location
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it("setNavigateHandler() replaces a previous handler", async () => {
    const bridge = await getBridge();
    const handlerA = vi.fn();
    const handlerB = vi.fn();

    bridge.setNavigateHandler(handlerA);
    bridge.setNavigateHandler(handlerB);
    bridge.navigate("/replaced");

    expect(handlerA).not.toHaveBeenCalled();
    expect(handlerB).toHaveBeenCalledWith("/replaced");
  });

  // -----------------------------------------------------------------------
  // Sequential updates
  // -----------------------------------------------------------------------

  it("tracks multiple sequential pathname changes", async () => {
    const bridge = await getBridge();
    const listener = vi.fn();

    bridge.subscribe(listener);

    bridge.setPathname("/a");
    bridge.setPathname("/b");
    bridge.setPathname("/c");

    expect(bridge.pathname).toBe("/c");
    expect(listener).toHaveBeenCalledTimes(3);
    expect(listener).toHaveBeenNthCalledWith(1, "/a");
    expect(listener).toHaveBeenNthCalledWith(2, "/b");
    expect(listener).toHaveBeenNthCalledWith(3, "/c");
  });
});
