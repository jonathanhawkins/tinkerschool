import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockGetToken = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockImplementation(() =>
    Promise.resolve({ getToken: mockGetToken }),
  ),
}));

// ---------------------------------------------------------------------------
// Import (after mock)
// ---------------------------------------------------------------------------

import { getSupabaseToken } from "./supabase-token";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("getSupabaseToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the JWT when available", async () => {
    mockGetToken.mockResolvedValue("jwt-token-123");

    const token = await getSupabaseToken();
    expect(token).toBe("jwt-token-123");
    expect(mockGetToken).toHaveBeenCalledWith({ template: "supabase" });
  });

  it("returns null when no session exists", async () => {
    mockGetToken.mockResolvedValue(null);

    const token = await getSupabaseToken();
    expect(token).toBeNull();
  });

  it("returns null when auth throws", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockRejectedValueOnce(new Error("No session"));

    const token = await getSupabaseToken();
    expect(token).toBeNull();
  });

  it("returns null when getToken throws", async () => {
    mockGetToken.mockRejectedValue(new Error("Template not configured"));

    const token = await getSupabaseToken();
    expect(token).toBeNull();
  });
});
