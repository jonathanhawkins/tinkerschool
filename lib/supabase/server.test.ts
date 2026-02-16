import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockCreateClient = vi.fn().mockReturnValue({ from: vi.fn() });
const mockGetSupabaseToken = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

vi.mock("@/lib/clerk/supabase-token", () => ({
  getSupabaseToken: () => mockGetSupabaseToken(),
}));

// ---------------------------------------------------------------------------
// Import (after mock)
// ---------------------------------------------------------------------------

import { createServerSupabaseClient } from "./server";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("createServerSupabaseClient", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...ORIGINAL_ENV };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key-123";
    mockGetSupabaseToken.mockResolvedValue("clerk-jwt-token");
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("creates client with anon key and Clerk JWT in Authorization header", async () => {
    await createServerSupabaseClient();

    expect(mockCreateClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "anon-key-123",
      expect.objectContaining({
        global: {
          headers: {
            Authorization: "Bearer clerk-jwt-token",
          },
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }),
    );
  });

  it("throws when NEXT_PUBLIC_SUPABASE_URL is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    await expect(createServerSupabaseClient()).rejects.toThrow(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL",
    );
  });

  it("throws when Clerk JWT is not available", async () => {
    mockGetSupabaseToken.mockResolvedValue(null);

    await expect(createServerSupabaseClient()).rejects.toThrow(
      "No Clerk JWT available",
    );
  });

  it("throws when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await expect(createServerSupabaseClient()).rejects.toThrow(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  });

  it("returns the client from createClient", async () => {
    const fakeClient = { from: vi.fn() };
    mockCreateClient.mockReturnValue(fakeClient);

    const result = await createServerSupabaseClient();
    expect(result).toBe(fakeClient);
  });
});
