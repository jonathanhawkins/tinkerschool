import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock "server-only" to prevent it from throwing in the test environment.
vi.mock("server-only", () => ({}));

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

const mockAuth = vi.fn();
const mockDeleteOrg = vi.fn().mockResolvedValue({});
const mockDeleteUser = vi.fn().mockResolvedValue({});

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
  clerkClient: () => Promise.resolve({
    organizations: { deleteOrganization: mockDeleteOrg },
    users: { deleteUser: mockDeleteUser },
  }),
}));

// ---------------------------------------------------------------------------
// Chainable Supabase mock factory
// ---------------------------------------------------------------------------

function createChainableMock() {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};

  chain.maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  chain.single = vi.fn().mockResolvedValue({ data: null, error: null });
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.gte = vi.fn().mockReturnValue(chain);
  chain.in = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.upsert = vi.fn().mockReturnValue(chain);
  chain.from = vi.fn().mockReturnValue(chain);

  return chain;
}

let mockAdminSupabase: ReturnType<typeof createChainableMock>;

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: vi.fn(() => mockAdminSupabase),
}));

// Import after mocks
import { exportChildData, deleteAccount } from "./actions";

// ---------------------------------------------------------------------------
// exportChildData
// ---------------------------------------------------------------------------

describe("exportChildData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_parent" });
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await exportChildData("kid-001");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });

  it("returns error when caller is not a parent", async () => {
    let fromCallCount = 0;
    mockAdminSupabase.from.mockImplementation(() => {
      fromCallCount++;
      if (fromCallCount === 1) {
        // Parent profile lookup - role is kid
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "kid-001", role: "kid", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }
      return createChainableMock();
    });

    const result = await exportChildData("kid-001");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Only parents can export child data");
  });

  it("returns error when parent profile not found", async () => {
    mockAdminSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }));

    const result = await exportChildData("kid-001");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Only parents can export child data");
  });

  it("returns error when kid profile not found", async () => {
    let fromCallCount = 0;
    mockAdminSupabase.from.mockImplementation(() => {
      fromCallCount++;
      if (fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "parent-001", role: "parent", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }
      if (fromCallCount === 2) {
        // Kid profile lookup - not found
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null }),
            }),
          }),
        };
      }
      return createChainableMock();
    });

    const result = await exportChildData("kid-001");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Child not found in your family");
  });

  it("returns error when kid is in a different family", async () => {
    let fromCallCount = 0;
    mockAdminSupabase.from.mockImplementation(() => {
      fromCallCount++;
      if (fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "parent-001", role: "parent", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }
      if (fromCallCount === 2) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: "kid-001",
                  display_name: "Cassidy",
                  avatar_id: "robot",
                  grade_level: 1,
                  current_band: 2,
                  role: "kid",
                  family_id: "fam-999", // Different family
                  created_at: "2026-01-01T00:00:00Z",
                },
              }),
            }),
          }),
        };
      }
      return createChainableMock();
    });

    const result = await exportChildData("kid-001");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Child not found in your family");
  });

  it("successfully exports child data as JSON", async () => {
    let fromCallCount = 0;
    mockAdminSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        // Parent profile
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "parent-001", role: "parent", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }

      if (fromCallCount === 2) {
        // Kid profile
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: "kid-001",
                  display_name: "Cassidy",
                  avatar_id: "robot",
                  grade_level: 1,
                  current_band: 2,
                  role: "kid",
                  family_id: "fam-001",
                  created_at: "2026-01-01T00:00:00Z",
                },
              }),
            }),
          }),
        };
      }

      // All the parallel data fetches (progress, chat_sessions, etc.)
      // Return chainable mock with empty data for all
      const chain = createChainableMock();

      // Make the final resolved value return empty data arrays
      const mockResolved = {
        data: [],
        error: null,
      };

      // Override the chain to resolve with empty data
      chain.eq.mockReturnValue({
        ...chain,
        order: vi.fn().mockResolvedValue(mockResolved),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      });
      chain.select.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue(mockResolved),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
          in: vi.fn().mockResolvedValue(mockResolved),
        }),
      });

      return chain;
    });

    const result = await exportChildData("kid-001");

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();

    const parsed = JSON.parse(result.data!);
    expect(parsed.exportedBy).toBe("parent");
    expect(parsed.child.displayName).toBe("Cassidy");
    expect(parsed.child.avatarId).toBe("robot");
    expect(parsed.child.gradeLevel).toBe(1);
    expect(parsed).toHaveProperty("progress");
    expect(parsed).toHaveProperty("chatSessions");
    expect(parsed).toHaveProperty("voiceSessions");
    expect(parsed).toHaveProperty("projects");
    expect(parsed).toHaveProperty("badges");
    expect(parsed).toHaveProperty("learningProfile");
    expect(parsed).toHaveProperty("activitySessions");
  });
});

// ---------------------------------------------------------------------------
// deleteAccount
// ---------------------------------------------------------------------------

describe("deleteAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_parent", orgId: "org_123" });
  });

  it("returns error when confirmText is not DELETE", async () => {
    const result = await deleteAccount("delete");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Please type DELETE to confirm account deletion.");
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null, orgId: null });

    const result = await deleteAccount("DELETE");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });

  it("returns error when caller is not a parent", async () => {
    mockAdminSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: "kid-001", role: "kid", family_id: "fam-001" },
          }),
        }),
      }),
    }));

    const result = await deleteAccount("DELETE");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Only parents can delete the family account");
  });

  it("returns error when parent profile not found", async () => {
    mockAdminSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }));

    const result = await deleteAccount("DELETE");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Only parents can delete the family account");
  });

  it("successfully deletes all family data and Clerk resources", async () => {
    let fromCallCount = 0;
    const deleteMock = vi.fn().mockResolvedValue({ error: null });

    mockAdminSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        // Parent profile lookup
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "parent-001", role: "parent", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }

      if (fromCallCount === 2) {
        // Family profiles lookup
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: [{ id: "parent-001" }, { id: "kid-001" }],
            }),
          }),
        };
      }

      // All delete operations return chainable mock
      return {
        delete: vi.fn().mockReturnValue({
          in: deleteMock,
          eq: deleteMock,
        }),
      };
    });

    const result = await deleteAccount("DELETE");

    expect(result.success).toBe(true);
    expect(mockDeleteOrg).toHaveBeenCalledWith("org_123");
    expect(mockDeleteUser).toHaveBeenCalledWith("user_parent");
  });

  it("still succeeds if Clerk org deletion fails", async () => {
    let fromCallCount = 0;
    const deleteMock = vi.fn().mockResolvedValue({ error: null });

    mockAdminSupabase.from.mockImplementation(() => {
      fromCallCount++;
      if (fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "parent-001", role: "parent", family_id: "fam-001" },
              }),
            }),
          }),
        };
      }
      if (fromCallCount === 2) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: [{ id: "parent-001" }],
            }),
          }),
        };
      }
      return {
        delete: vi.fn().mockReturnValue({
          in: deleteMock,
          eq: deleteMock,
        }),
      };
    });

    mockDeleteOrg.mockRejectedValue(new Error("Clerk org not found"));

    const result = await deleteAccount("DELETE");

    // Should still succeed -- Clerk errors are logged but not blocking
    expect(result.success).toBe(true);
  });
});
