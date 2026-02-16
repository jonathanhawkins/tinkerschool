import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock @supabase/supabase-js
// ---------------------------------------------------------------------------

const mockCreateClient = vi.fn().mockReturnValue({ from: vi.fn() });

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

// ---------------------------------------------------------------------------
// Import (after mock)
// ---------------------------------------------------------------------------

import { createAdminSupabaseClient } from "./admin";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("createAdminSupabaseClient", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...ORIGINAL_ENV };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key-123";
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("creates a client with the correct URL and service role key", () => {
    createAdminSupabaseClient();

    expect(mockCreateClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "service-role-key-123",
      expect.objectContaining({
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }),
    );
  });

  it("throws when NEXT_PUBLIC_SUPABASE_URL is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    expect(() => createAdminSupabaseClient()).toThrow(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL",
    );
  });

  it("throws when SUPABASE_SERVICE_ROLE_KEY is missing", () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(() => createAdminSupabaseClient()).toThrow(
      "Missing environment variable: SUPABASE_SERVICE_ROLE_KEY",
    );
  });

  it("disables auto refresh and session persistence", () => {
    createAdminSupabaseClient();

    const options = mockCreateClient.mock.calls[0][2];
    expect(options.auth.autoRefreshToken).toBe(false);
    expect(options.auth.persistSession).toBe(false);
  });

  it("returns the client created by createClient", () => {
    const fakeClient = { from: vi.fn(), rpc: vi.fn() };
    mockCreateClient.mockReturnValue(fakeClient);

    const result = createAdminSupabaseClient();
    expect(result).toBe(fakeClient);
  });
});
