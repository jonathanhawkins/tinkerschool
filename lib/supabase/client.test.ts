import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock @supabase/supabase-js
// ---------------------------------------------------------------------------

const mockCreateClient = vi.fn().mockReturnValue({ from: vi.fn() });

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("createBrowserSupabaseClient", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    // Reset module cache so singleton is fresh each test
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key-123";
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("creates client with anon key and disables session persistence", async () => {
    const { createBrowserSupabaseClient } = await import("./client");
    createBrowserSupabaseClient();

    expect(mockCreateClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "anon-key-123",
      expect.objectContaining({
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }),
    );
  });

  it("returns the same singleton on subsequent calls", async () => {
    const fakeClient = { from: vi.fn(), id: "singleton" };
    mockCreateClient.mockReturnValue(fakeClient);

    const { createBrowserSupabaseClient } = await import("./client");

    const first = createBrowserSupabaseClient();
    const second = createBrowserSupabaseClient();

    expect(first).toBe(second);
    expect(mockCreateClient).toHaveBeenCalledTimes(1);
  });

  it("throws when NEXT_PUBLIC_SUPABASE_URL is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    const { createBrowserSupabaseClient } = await import("./client");

    expect(() => createBrowserSupabaseClient()).toThrow(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL",
    );
  });

  it("throws when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const { createBrowserSupabaseClient } = await import("./client");

    expect(() => createBrowserSupabaseClient()).toThrow(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  });
});
