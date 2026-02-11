import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks — must be declared before imports
// ---------------------------------------------------------------------------

// "use server" files import "server-only" transitively; neutralize it.
vi.mock("server-only", () => ({}));

// Clerk auth
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

// Supabase clients
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
import { hashPin, verifyKidPin } from "./pin";

const mockAuth = vi.mocked(auth);
const mockCreateAdmin = vi.mocked(createAdminSupabaseClient);
const mockCreateServer = vi.mocked(createServerSupabaseClient);

// ---------------------------------------------------------------------------
// Helpers to build mock Supabase chains
// ---------------------------------------------------------------------------

function buildChain(resolvedValue: unknown) {
  const chain: Record<string, unknown> = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn().mockResolvedValue(resolvedValue);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  return chain;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("hashPin", () => {
  it("returns a bcrypt hash that starts with $2", async () => {
    const hash = await hashPin("1234");
    expect(hash).toMatch(/^\$2[aby]?\$/);
  });

  it("produces different hashes for different PINs", async () => {
    const hash1 = await hashPin("1234");
    const hash2 = await hashPin("5678");
    expect(hash1).not.toBe(hash2);
  });

  it("handles an empty string input", async () => {
    const hash = await hashPin("");
    expect(hash).toMatch(/^\$2[aby]?\$/);
  });

  it("handles a very long string input", async () => {
    const longPin = "1".repeat(200);
    const hash = await hashPin(longPin);
    expect(hash).toMatch(/^\$2[aby]?\$/);
  });
});

describe("verifyKidPin", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // ---- Auth checks ----

  it("returns error when parent is not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const result = await verifyKidPin("kid-1", "1234");

    expect(result).toEqual({ success: false, error: "Not authenticated." });
  });

  // ---- Input validation ----

  it("rejects PIN that is not exactly 4 digits", async () => {
    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const result = await verifyKidPin("kid-1", "123");
    expect(result).toEqual({
      success: false,
      error: "PIN must be exactly 4 digits.",
    });
  });

  it("rejects PIN containing non-digit characters", async () => {
    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const result = await verifyKidPin("kid-1", "12ab");
    expect(result).toEqual({
      success: false,
      error: "PIN must be exactly 4 digits.",
    });
  });

  it("rejects empty PIN", async () => {
    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const result = await verifyKidPin("kid-1", "");
    expect(result).toEqual({
      success: false,
      error: "PIN must be exactly 4 digits.",
    });
  });

  it("rejects empty kidProfileId", async () => {
    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const result = await verifyKidPin("", "1234");
    expect(result).toEqual({
      success: false,
      error: "Invalid kid profile ID.",
    });
  });

  // ---- Database lookup failures ----

  it("returns error when parent profile is not found", async () => {
    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const serverChain = buildChain({ data: null });
    mockCreateServer.mockResolvedValue({
      from: vi.fn().mockReturnValue(serverChain),
    } as unknown as ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never);

    const result = await verifyKidPin("kid-1", "1234");
    expect(result).toEqual({
      success: false,
      error: "Parent profile not found.",
    });
  });

  it("returns error when kid profile is not found", async () => {
    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    // Server client returns parent profile
    const serverChain = buildChain({
      data: { family_id: "family-1" },
    });
    mockCreateServer.mockResolvedValue({
      from: vi.fn().mockReturnValue(serverChain),
    } as unknown as ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never);

    // Admin client returns null for kid profile
    const adminChain = buildChain({ data: null });
    mockCreateAdmin.mockReturnValue({
      from: vi.fn().mockReturnValue(adminChain),
    } as unknown as ReturnType<typeof createAdminSupabaseClient>);

    const result = await verifyKidPin("kid-1", "1234");
    expect(result).toEqual({
      success: false,
      error: "Kid profile not found.",
    });
  });

  // ---- Family boundary ----

  it("returns error when kid does not belong to parent family", async () => {
    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const serverChain = buildChain({
      data: { family_id: "family-1" },
    });
    mockCreateServer.mockResolvedValue({
      from: vi.fn().mockReturnValue(serverChain),
    } as unknown as ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never);

    const adminChain = buildChain({
      data: {
        id: "kid-1",
        clerk_id: "clerk-kid-1",
        pin_hash: "$2b$10$somehash",
        family_id: "family-OTHER",
        role: "kid",
      },
    });
    mockCreateAdmin.mockReturnValue({
      from: vi.fn().mockReturnValue(adminChain),
    } as unknown as ReturnType<typeof createAdminSupabaseClient>);

    const result = await verifyKidPin("kid-1", "1234");
    expect(result).toEqual({
      success: false,
      error: "Kid profile not found.",
    });
  });

  it("returns error when profile role is not kid", async () => {
    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const serverChain = buildChain({
      data: { family_id: "family-1" },
    });
    mockCreateServer.mockResolvedValue({
      from: vi.fn().mockReturnValue(serverChain),
    } as unknown as ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never);

    const adminChain = buildChain({
      data: {
        id: "kid-1",
        clerk_id: "clerk-kid-1",
        pin_hash: "$2b$10$somehash",
        family_id: "family-1",
        role: "parent",
      },
    });
    mockCreateAdmin.mockReturnValue({
      from: vi.fn().mockReturnValue(adminChain),
    } as unknown as ReturnType<typeof createAdminSupabaseClient>);

    const result = await verifyKidPin("kid-1", "1234");
    expect(result).toEqual({ success: false, error: "Invalid profile." });
  });

  // ---- No PIN set ----

  it("returns error when no PIN has been set", async () => {
    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const serverChain = buildChain({
      data: { family_id: "family-1" },
    });
    mockCreateServer.mockResolvedValue({
      from: vi.fn().mockReturnValue(serverChain),
    } as unknown as ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never);

    const adminChain = buildChain({
      data: {
        id: "kid-1",
        clerk_id: "clerk-kid-1",
        pin_hash: null,
        family_id: "family-1",
        role: "kid",
      },
    });
    mockCreateAdmin.mockReturnValue({
      from: vi.fn().mockReturnValue(adminChain),
    } as unknown as ReturnType<typeof createAdminSupabaseClient>);

    const result = await verifyKidPin("kid-1", "1234");
    expect(result).toEqual({
      success: false,
      error: "No PIN has been set for this profile.",
    });
  });

  // ---- Bcrypt PIN verification ----

  it("returns success for correct bcrypt-hashed PIN", async () => {
    const correctPin = "5678";
    const hash = await hashPin(correctPin);

    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const serverChain = buildChain({
      data: { family_id: "family-1" },
    });
    mockCreateServer.mockResolvedValue({
      from: vi.fn().mockReturnValue(serverChain),
    } as unknown as ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never);

    const adminChain = buildChain({
      data: {
        id: "kid-1",
        clerk_id: "clerk-kid-1",
        pin_hash: hash,
        family_id: "family-1",
        role: "kid",
      },
    });
    mockCreateAdmin.mockReturnValue({
      from: vi.fn().mockReturnValue(adminChain),
    } as unknown as ReturnType<typeof createAdminSupabaseClient>);

    const result = await verifyKidPin("kid-1", correctPin);
    expect(result).toEqual({
      success: true,
      kidProfileId: "kid-1",
      kidClerkId: "clerk-kid-1",
    });
  });

  it("returns failure for incorrect bcrypt-hashed PIN", async () => {
    const hash = await hashPin("5678");

    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const serverChain = buildChain({
      data: { family_id: "family-1" },
    });
    mockCreateServer.mockResolvedValue({
      from: vi.fn().mockReturnValue(serverChain),
    } as unknown as ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never);

    const adminChain = buildChain({
      data: {
        id: "kid-1",
        clerk_id: "clerk-kid-1",
        pin_hash: hash,
        family_id: "family-1",
        role: "kid",
      },
    });
    mockCreateAdmin.mockReturnValue({
      from: vi.fn().mockReturnValue(adminChain),
    } as unknown as ReturnType<typeof createAdminSupabaseClient>);

    const result = await verifyKidPin("kid-1", "9999");
    expect(result).toEqual({ success: false, error: "Incorrect PIN." });
  });

  // ---- Legacy plaintext PIN ----

  it("accepts a legacy plaintext PIN and upgrades to bcrypt", async () => {
    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const serverChain = buildChain({
      data: { family_id: "family-1" },
    });
    mockCreateServer.mockResolvedValue({
      from: vi.fn().mockReturnValue(serverChain),
    } as unknown as ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never);

    const adminUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
    const adminChain = buildChain({
      data: {
        id: "kid-1",
        clerk_id: "clerk-kid-1",
        pin_hash: "4321", // plaintext — does NOT start with $2
        family_id: "family-1",
        role: "kid",
      },
    });
    adminChain.update = adminUpdate;

    const adminFrom = vi.fn().mockReturnValue(adminChain);
    mockCreateAdmin.mockReturnValue({
      from: adminFrom,
    } as unknown as ReturnType<typeof createAdminSupabaseClient>);

    const result = await verifyKidPin("kid-1", "4321");

    expect(result.success).toBe(true);
    expect(result.kidProfileId).toBe("kid-1");

    // The admin client should have been called with an update to upgrade the hash
    expect(adminUpdate).toHaveBeenCalledTimes(1);
    const updateArg = adminUpdate.mock.calls[0][0] as {
      pin_hash: string;
    };
    expect(updateArg.pin_hash).toMatch(/^\$2[aby]?\$/);
  });

  it("rejects wrong legacy plaintext PIN and does not upgrade", async () => {
    mockAuth.mockResolvedValue({ userId: "parent-1" } as ReturnType<
      typeof auth
    > extends Promise<infer T> ? T : never);

    const serverChain = buildChain({
      data: { family_id: "family-1" },
    });
    mockCreateServer.mockResolvedValue({
      from: vi.fn().mockReturnValue(serverChain),
    } as unknown as ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never);

    const adminUpdate = vi.fn();
    const adminChain = buildChain({
      data: {
        id: "kid-1",
        clerk_id: "clerk-kid-1",
        pin_hash: "4321",
        family_id: "family-1",
        role: "kid",
      },
    });
    adminChain.update = adminUpdate;

    mockCreateAdmin.mockReturnValue({
      from: vi.fn().mockReturnValue(adminChain),
    } as unknown as ReturnType<typeof createAdminSupabaseClient>);

    const result = await verifyKidPin("kid-1", "9999");

    expect(result).toEqual({ success: false, error: "Incorrect PIN." });
    expect(adminUpdate).not.toHaveBeenCalled();
  });
});
