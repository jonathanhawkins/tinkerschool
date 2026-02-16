import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSidebarCollapse } from "./use-sidebar-collapse";

// ---------------------------------------------------------------------------
// Mock localStorage
// ---------------------------------------------------------------------------

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, val: string) => storage.set(key, val)),
    removeItem: vi.fn((key: string) => storage.delete(key)),
  });
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useSidebarCollapse", () => {
  it("defaults to not collapsed", () => {
    const { result } = renderHook(() => useSidebarCollapse());
    expect(result.current.isCollapsed).toBe(false);
  });

  it("reads initial state from localStorage", () => {
    storage.set("tinkerschool-sidebar-collapsed", "true");
    const { result } = renderHook(() => useSidebarCollapse());
    // After effect runs, isCollapsed should be true
    expect(result.current.isCollapsed).toBe(true);
  });

  it("toggles collapsed state and persists to localStorage", () => {
    const { result } = renderHook(() => useSidebarCollapse());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isCollapsed).toBe(true);
    expect(storage.get("tinkerschool-sidebar-collapsed")).toBe("true");

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isCollapsed).toBe(false);
    expect(storage.get("tinkerschool-sidebar-collapsed")).toBe("false");
  });

  it("sets isHydrated to true after mount", () => {
    const { result } = renderHook(() => useSidebarCollapse());
    expect(result.current.isHydrated).toBe(true);
  });
});
