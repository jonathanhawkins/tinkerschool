import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks — must be declared before imports
// ---------------------------------------------------------------------------

vi.mock("server-only", () => ({}));

const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => {
    mockRedirect(...args);
    throw new Error("NEXT_REDIRECT");
  },
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { auth } from "@clerk/nextjs/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAuth, getActiveKidProfile } from "./require-auth";

const mockAuth = vi.mocked(auth);
const mockCreateAdmin = vi.mocked(createAdminSupabaseClient);
const mockCreateServer = vi.mocked(createServerSupabaseClient);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildSupabaseMock(profileData: unknown) {
  const chain: Record<string, unknown> = {};
  chain.from = vi.fn().mockReturnValue(chain);
  chain.select = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn().mockResolvedValue({ data: profileData, error: null });
  return chain;
}

const MOCK_PROFILE = {
  id: "profile-1",
  clerk_id: "user-1",
  family_id: "family-1",
  display_name: "Cassidy",
  avatar_id: "avatar-1",
  role: "kid" as const,
  grade_level: 1,
  current_band: 2,
  device_mode: "usb" as const,
  pin_hash: null,
  current_streak: 3,
  longest_streak: 5,
  last_activity_date: null,
  xp: 100,
  level: 2,
};

// ---------------------------------------------------------------------------
// Tests: requireAuth
// ---------------------------------------------------------------------------

describe("requireAuth", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("redirects to /sign-in when user is not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    await expect(requireAuth()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/sign-in");
  });

  it("redirects to /onboarding when profile is not found", async () => {
    mockAuth.mockResolvedValue({ userId: "user-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const chain = buildSupabaseMock(null);
    mockCreateServer.mockResolvedValue({
      from: vi.fn().mockReturnValue(chain),
    } as unknown as ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never);

    await expect(requireAuth()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/onboarding");
  });

  it("returns userId, profile, and supabase client on success", async () => {
    mockAuth.mockResolvedValue({ userId: "user-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const chain = buildSupabaseMock(MOCK_PROFILE);
    const mockFrom = vi.fn().mockReturnValue(chain);
    const fakeClient = { from: mockFrom };

    mockCreateServer.mockResolvedValue(
      fakeClient as unknown as ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never,
    );

    const result = await requireAuth();

    expect(result.userId).toBe("user-1");
    expect(result.profile).toEqual(MOCK_PROFILE);
    expect(result.supabase).toBe(fakeClient);
  });

  it("queries profiles by clerk_id", async () => {
    mockAuth.mockResolvedValue({ userId: "user-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const chain = buildSupabaseMock(MOCK_PROFILE);
    const mockFrom = vi.fn().mockReturnValue(chain);
    const fakeClient = { from: mockFrom };

    mockCreateServer.mockResolvedValue(
      fakeClient as unknown as ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never,
    );

    await requireAuth();

    expect(mockFrom).toHaveBeenCalledWith("profiles");
    expect(chain.select).toHaveBeenCalledWith("*");
    expect(chain.eq).toHaveBeenCalledWith("clerk_id", "user-1");
    expect(chain.single).toHaveBeenCalled();
  });

  it("falls back to admin client when server client throws", async () => {
    mockAuth.mockResolvedValue({ userId: "user-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    // Server client throws (JWT not configured)
    mockCreateServer.mockRejectedValue(new Error("No JWT"));

    // Admin client returns profile
    const chain = buildSupabaseMock(MOCK_PROFILE);
    const mockFrom = vi.fn().mockReturnValue(chain);
    const fakeAdmin = { from: mockFrom };
    mockCreateAdmin.mockReturnValue(
      fakeAdmin as unknown as ReturnType<typeof createAdminSupabaseClient>,
    );

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await requireAuth();

    expect(result.userId).toBe("user-1");
    expect(result.profile).toEqual(MOCK_PROFILE);
    expect(result.supabase).toBe(fakeAdmin);
    expect(mockCreateAdmin).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Supabase JWT unavailable"),
    );

    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// Tests: getActiveKidProfile
// ---------------------------------------------------------------------------

describe("getActiveKidProfile", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns the profile as-is if role is kid", async () => {
    const kidProfile = { ...MOCK_PROFILE, role: "kid" as const };
    const fakeClient = {} as Awaited<ReturnType<typeof createServerSupabaseClient>>;

    const result = await getActiveKidProfile(kidProfile, fakeClient);
    expect(result).toBe(kidProfile);
  });

  it("queries for first kid in family when profile is parent", async () => {
    const parentProfile = {
      ...MOCK_PROFILE,
      id: "parent-profile",
      role: "parent" as const,
      family_id: "family-1",
    };
    const kidProfile = {
      ...MOCK_PROFILE,
      id: "kid-profile",
      role: "kid" as const,
      family_id: "family-1",
    };

    const chain: Record<string, unknown> = {};
    chain.from = vi.fn().mockReturnValue(chain);
    chain.select = vi.fn().mockReturnValue(chain);
    chain.eq = vi.fn().mockReturnValue(chain);
    chain.order = vi.fn().mockReturnValue(chain);
    chain.limit = vi.fn().mockResolvedValue({ data: [kidProfile], error: null });

    const fakeClient = { from: vi.fn().mockReturnValue(chain) } as unknown as Awaited<
      ReturnType<typeof createServerSupabaseClient>
    >;

    const result = await getActiveKidProfile(parentProfile, fakeClient);

    expect(result).toEqual(kidProfile);
    expect(chain.eq).toHaveBeenCalledWith("family_id", "family-1");
    expect(chain.eq).toHaveBeenCalledWith("role", "kid");
    expect(chain.order).toHaveBeenCalledWith("created_at");
    expect(chain.limit).toHaveBeenCalledWith(1);
  });

  it("returns null when no kid profiles exist in family", async () => {
    const parentProfile = {
      ...MOCK_PROFILE,
      id: "parent-profile",
      role: "parent" as const,
    };

    const chain: Record<string, unknown> = {};
    chain.from = vi.fn().mockReturnValue(chain);
    chain.select = vi.fn().mockReturnValue(chain);
    chain.eq = vi.fn().mockReturnValue(chain);
    chain.order = vi.fn().mockReturnValue(chain);
    chain.limit = vi.fn().mockResolvedValue({ data: [], error: null });

    const fakeClient = { from: vi.fn().mockReturnValue(chain) } as unknown as Awaited<
      ReturnType<typeof createServerSupabaseClient>
    >;

    const result = await getActiveKidProfile(parentProfile, fakeClient);
    expect(result).toBeNull();
  });

  it("returns null when supabase returns null data", async () => {
    const parentProfile = {
      ...MOCK_PROFILE,
      id: "parent-profile",
      role: "parent" as const,
    };

    const chain: Record<string, unknown> = {};
    chain.from = vi.fn().mockReturnValue(chain);
    chain.select = vi.fn().mockReturnValue(chain);
    chain.eq = vi.fn().mockReturnValue(chain);
    chain.order = vi.fn().mockReturnValue(chain);
    chain.limit = vi.fn().mockResolvedValue({ data: null, error: null });

    const fakeClient = { from: vi.fn().mockReturnValue(chain) } as unknown as Awaited<
      ReturnType<typeof createServerSupabaseClient>
    >;

    const result = await getActiveKidProfile(parentProfile, fakeClient);
    expect(result).toBeNull();
  });
});
