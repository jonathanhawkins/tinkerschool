import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock "server-only" to prevent it from throwing in the test environment.
vi.mock("server-only", () => ({}));

// ---------------------------------------------------------------------------
// Chainable Supabase mock factory
// ---------------------------------------------------------------------------

interface ChainableMock {
  from: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
}

function createChainableMock(): ChainableMock {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};

  chain.single = vi.fn().mockResolvedValue({ data: null, error: null });
  chain.order = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.from = vi.fn().mockReturnValue(chain);

  return chain as unknown as ChainableMock;
}

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

const mockClerkClient = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: () => mockClerkClient(),
}));

vi.mock("@/lib/auth/require-auth", () => ({
  requireAuth: vi.fn(),
}));

let mockAdminSupabase: ChainableMock;

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: vi.fn(() => mockAdminSupabase),
}));

// Import after mocks
import { requireAuth } from "@/lib/auth/require-auth";
import {
  inviteCoParent,
  listPendingInvitations,
  revokeInvitation,
  listFamilyParents,
} from "./invite-actions";

const mockRequireAuth = vi.mocked(requireAuth);

// ---------------------------------------------------------------------------
// Profile fixtures
// ---------------------------------------------------------------------------

function makeParentProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: "parent-001",
    clerk_id: "clerk-parent-001",
    family_id: "family-001",
    display_name: "Parent",
    avatar_id: "parent",
    role: "parent" as const,
    grade_level: null,
    current_band: 0,
    device_mode: "none" as const,
    pin_hash: null,
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: null,
    xp: 0,
    level: 1,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function makeKidProfile(overrides: Record<string, unknown> = {}) {
  return {
    ...makeParentProfile(),
    id: "kid-001",
    clerk_id: "clerk-kid-001",
    display_name: "Cassidy",
    avatar_id: "robot",
    role: "kid" as const,
    grade_level: 1,
    current_band: 2,
    ...overrides,
  };
}

let mockSupabase: ChainableMock;

function setupAuth(overrides: { profile?: Record<string, unknown>; userId?: string } = {}) {
  mockSupabase = createChainableMock();
  const profile = overrides.profile
    ? makeParentProfile(overrides.profile)
    : makeParentProfile();

  mockRequireAuth.mockResolvedValue({
    userId: overrides.userId ?? profile.clerk_id,
    profile: profile as never,
    supabase: mockSupabase as never,
  });

  return { profile, supabase: mockSupabase };
}

// ---------------------------------------------------------------------------
// inviteCoParent
// ---------------------------------------------------------------------------

describe("inviteCoParent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminSupabase = createChainableMock();
  });

  it("returns error when role is not parent", async () => {
    setupAuth({ profile: { role: "kid" } });

    const result = await inviteCoParent("co-parent@example.com");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Only parents can send invitations.");
  });

  // ---- Email validation ----

  it("returns error for empty email", async () => {
    setupAuth();

    const result = await inviteCoParent("");

    expect(result.success).toBe(false);
    expect(result.error).toContain("valid email");
  });

  it("returns error for whitespace-only email", async () => {
    setupAuth();

    const result = await inviteCoParent("   ");

    expect(result.success).toBe(false);
    expect(result.error).toContain("valid email");
  });

  it("returns error for email without @", async () => {
    setupAuth();

    const result = await inviteCoParent("notanemail");

    expect(result.success).toBe(false);
    expect(result.error).toContain("valid email");
  });

  it("returns error for email without domain", async () => {
    setupAuth();

    const result = await inviteCoParent("user@");

    expect(result.success).toBe(false);
    expect(result.error).toContain("valid email");
  });

  it("returns error for email with spaces", async () => {
    setupAuth();

    const result = await inviteCoParent("user @example.com");

    expect(result.success).toBe(false);
    expect(result.error).toContain("valid email");
  });

  // ---- Legacy family org creation ----

  it("returns error when ensureFamilyOrg fails (family not found)", async () => {
    const { supabase } = setupAuth();

    // getFamilyOrgId: no real org (legacy family)
    // ensureFamilyOrg: family lookup returns null
    let fromCallCount = 0;
    supabase.from.mockImplementation(() => {
      fromCallCount++;

      // First call: getFamilyOrgId -> check clerk_org_id
      if (fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { clerk_org_id: "user_legacy_id" }, // Not a real org
                error: null,
              }),
            }),
          }),
        };
      }

      // Second call: ensureFamilyOrg -> fetch family name
      if (fromCallCount === 2) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null, // Family not found
                error: null,
              }),
            }),
          }),
        };
      }

      return createChainableMock();
    });

    const result = await inviteCoParent("co-parent@example.com");

    expect(result.success).toBe(false);
    expect(result.error).toContain("Failed to set up family organization");
  });

  it("creates a Clerk org for legacy families before sending invitation", async () => {
    const { supabase } = setupAuth();

    const createOrgMock = vi.fn().mockResolvedValue({ id: "org_new" });
    const createInvitationMock = vi.fn().mockResolvedValue({});

    mockClerkClient.mockResolvedValue({
      organizations: {
        createOrganization: createOrgMock,
        createOrganizationInvitation: createInvitationMock,
      },
    });

    let fromCallCount = 0;
    supabase.from.mockImplementation(() => {
      fromCallCount++;

      // getFamilyOrgId: legacy family (no org_ prefix)
      if (fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { clerk_org_id: "user_legacy_id" },
                error: null,
              }),
            }),
          }),
        };
      }

      // ensureFamilyOrg: fetch family name
      if (fromCallCount === 2) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { clerk_org_id: "user_legacy_id", name: "Smith Family" },
                error: null,
              }),
            }),
          }),
        };
      }

      return createChainableMock();
    });

    // Admin supabase for family update
    mockAdminSupabase.from.mockImplementation(() => ({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }));

    const result = await inviteCoParent("co-parent@example.com");

    expect(result.success).toBe(true);
    expect(createOrgMock).toHaveBeenCalledWith({
      name: "Smith Family",
      createdBy: "clerk-parent-001",
    });
    expect(createInvitationMock).toHaveBeenCalledWith({
      organizationId: "org_new",
      emailAddress: "co-parent@example.com",
      role: "org:admin",
      inviterUserId: "clerk-parent-001",
    });
  });

  // ---- Happy path with existing org ----

  it("sends invitation when family already has a real Clerk org", async () => {
    const { supabase } = setupAuth();

    const createInvitationMock = vi.fn().mockResolvedValue({});

    mockClerkClient.mockResolvedValue({
      organizations: {
        createOrganizationInvitation: createInvitationMock,
      },
    });

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { clerk_org_id: "org_existing123" },
            error: null,
          }),
        }),
      }),
    }));

    const result = await inviteCoParent("  CoParent@Example.COM  ");

    expect(result.success).toBe(true);
    // Verify email was trimmed and lowercased
    expect(createInvitationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        emailAddress: "coparent@example.com",
      }),
    );
  });

  // ---- Duplicate invitation ----

  it("returns specific error for duplicate invitations", async () => {
    const { supabase } = setupAuth();

    mockClerkClient.mockResolvedValue({
      organizations: {
        createOrganizationInvitation: vi
          .fn()
          .mockRejectedValue(new Error("This email has already been invited")),
      },
    });

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { clerk_org_id: "org_existing" },
            error: null,
          }),
        }),
      }),
    }));

    const result = await inviteCoParent("dup@example.com");

    expect(result.success).toBe(false);
    expect(result.error).toContain("already been invited");
  });

  it("returns specific error for existing members", async () => {
    const { supabase } = setupAuth();

    mockClerkClient.mockResolvedValue({
      organizations: {
        createOrganizationInvitation: vi
          .fn()
          .mockRejectedValue(new Error("This user is already a member")),
      },
    });

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { clerk_org_id: "org_existing" },
            error: null,
          }),
        }),
      }),
    }));

    const result = await inviteCoParent("existing@example.com");

    expect(result.success).toBe(false);
    expect(result.error).toContain("already been invited or is already a member");
  });

  // ---- Generic Clerk error ----

  it("returns generic error for unknown Clerk failures", async () => {
    const { supabase } = setupAuth();

    mockClerkClient.mockResolvedValue({
      organizations: {
        createOrganizationInvitation: vi
          .fn()
          .mockRejectedValue(new Error("Network timeout")),
      },
    });

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { clerk_org_id: "org_existing" },
            error: null,
          }),
        }),
      }),
    }));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await inviteCoParent("someone@example.com");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to send invitation. Please try again.");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// listPendingInvitations
// ---------------------------------------------------------------------------

describe("listPendingInvitations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminSupabase = createChainableMock();
  });

  it("returns empty array when role is not parent", async () => {
    setupAuth({ profile: { role: "kid" } });

    const result = await listPendingInvitations();

    expect(result).toEqual([]);
  });

  it("returns empty array when family has no real Clerk org", async () => {
    const { supabase } = setupAuth();

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { clerk_org_id: "user_legacy" }, // Not org_ prefix
            error: null,
          }),
        }),
      }),
    }));

    const result = await listPendingInvitations();

    expect(result).toEqual([]);
  });

  it("returns mapped invitations from Clerk", async () => {
    const { supabase } = setupAuth();

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { clerk_org_id: "org_abc" },
            error: null,
          }),
        }),
      }),
    }));

    mockClerkClient.mockResolvedValue({
      organizations: {
        getOrganizationInvitationList: vi.fn().mockResolvedValue({
          data: [
            {
              id: "inv_001",
              emailAddress: "invited@example.com",
              createdAt: 1700000000000,
            },
            {
              id: "inv_002",
              emailAddress: "invited2@example.com",
              createdAt: 1700000001000,
            },
          ],
        }),
      },
    });

    const result = await listPendingInvitations();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "inv_001",
      emailAddress: "invited@example.com",
      createdAt: 1700000000000,
    });
    expect(result[1]).toEqual({
      id: "inv_002",
      emailAddress: "invited2@example.com",
      createdAt: 1700000001000,
    });
  });

  it("passes pending status filter to Clerk", async () => {
    const { supabase } = setupAuth();

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { clerk_org_id: "org_abc" },
            error: null,
          }),
        }),
      }),
    }));

    const getInvitationsMock = vi.fn().mockResolvedValue({ data: [] });

    mockClerkClient.mockResolvedValue({
      organizations: {
        getOrganizationInvitationList: getInvitationsMock,
      },
    });

    await listPendingInvitations();

    expect(getInvitationsMock).toHaveBeenCalledWith({
      organizationId: "org_abc",
      status: ["pending"],
    });
  });

  it("returns empty array when Clerk API throws", async () => {
    const { supabase } = setupAuth();

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { clerk_org_id: "org_abc" },
            error: null,
          }),
        }),
      }),
    }));

    mockClerkClient.mockResolvedValue({
      organizations: {
        getOrganizationInvitationList: vi.fn().mockRejectedValue(
          new Error("Clerk error"),
        ),
      },
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await listPendingInvitations();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// revokeInvitation
// ---------------------------------------------------------------------------

describe("revokeInvitation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminSupabase = createChainableMock();
  });

  it("returns error when role is not parent", async () => {
    setupAuth({ profile: { role: "kid" } });

    const result = await revokeInvitation("inv_001");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Only parents can revoke invitations.");
  });

  it("returns error when family org is not found", async () => {
    const { supabase } = setupAuth();

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { clerk_org_id: "user_legacy" }, // Not real org
            error: null,
          }),
        }),
      }),
    }));

    const result = await revokeInvitation("inv_001");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Family organization not found.");
  });

  it("successfully revokes an invitation", async () => {
    const { supabase } = setupAuth();

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { clerk_org_id: "org_abc" },
            error: null,
          }),
        }),
      }),
    }));

    const revokeMock = vi.fn().mockResolvedValue({});

    mockClerkClient.mockResolvedValue({
      organizations: {
        revokeOrganizationInvitation: revokeMock,
      },
    });

    const result = await revokeInvitation("inv_001");

    expect(result.success).toBe(true);
    expect(revokeMock).toHaveBeenCalledWith({
      organizationId: "org_abc",
      invitationId: "inv_001",
      requestingUserId: "clerk-parent-001",
    });
  });

  it("returns error when Clerk revocation fails", async () => {
    const { supabase } = setupAuth();

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { clerk_org_id: "org_abc" },
            error: null,
          }),
        }),
      }),
    }));

    mockClerkClient.mockResolvedValue({
      organizations: {
        revokeOrganizationInvitation: vi
          .fn()
          .mockRejectedValue(new Error("Invitation not found")),
      },
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await revokeInvitation("inv_001");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to revoke invitation.");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// listFamilyParents
// ---------------------------------------------------------------------------

describe("listFamilyParents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminSupabase = createChainableMock();
  });

  it("returns empty array when no parents are found", async () => {
    const { supabase } = setupAuth();

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      }),
    }));

    const result = await listFamilyParents();

    expect(result).toEqual([]);
  });

  it("returns mapped parent list with isCurrentUser flag", async () => {
    const { supabase } = setupAuth({ userId: "clerk-parent-001" });

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: [
                {
                  id: "parent-001",
                  display_name: "Parent One",
                  clerk_id: "clerk-parent-001",
                  created_at: "2026-01-01T00:00:00Z",
                },
                {
                  id: "parent-002",
                  display_name: "Parent Two",
                  clerk_id: "clerk-parent-002",
                  created_at: "2026-02-01T00:00:00Z",
                },
              ],
              error: null,
            }),
          }),
        }),
      }),
    }));

    const result = await listFamilyParents();

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      id: "parent-001",
      displayName: "Parent One",
      clerkId: "clerk-parent-001",
      createdAt: "2026-01-01T00:00:00Z",
      isCurrentUser: true,
    });

    expect(result[1]).toEqual({
      id: "parent-002",
      displayName: "Parent Two",
      clerkId: "clerk-parent-002",
      createdAt: "2026-02-01T00:00:00Z",
      isCurrentUser: false,
    });
  });

  it("queries with correct family_id and role filters", async () => {
    const { supabase } = setupAuth({ profile: { family_id: "fam-custom-99" } });

    const eqMock2 = vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    });
    const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock1 });

    supabase.from.mockImplementation(() => ({
      select: selectMock,
    }));

    await listFamilyParents();

    // Verify the select query parameters
    expect(selectMock).toHaveBeenCalledWith("id, display_name, clerk_id, created_at");
    expect(eqMock1).toHaveBeenCalledWith("family_id", "fam-custom-99");
    expect(eqMock2).toHaveBeenCalledWith("role", "parent");
  });
});
