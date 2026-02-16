import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock "server-only" to prevent it from throwing in the test environment.
vi.mock("server-only", () => ({}));

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockRequireAuth = vi.fn();

vi.mock("@/lib/auth/require-auth", () => ({
  requireAuth: () => mockRequireAuth(),
}));

// ---------------------------------------------------------------------------
// Chainable Supabase mock
// ---------------------------------------------------------------------------

interface ChainableMock {
  from: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
}

function createChainableMock(): ChainableMock {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};

  chain.single = vi.fn().mockResolvedValue({ data: null, error: null });
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.select = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.delete = vi.fn().mockReturnValue(chain);
  chain.from = vi.fn().mockReturnValue(chain);

  return chain as unknown as ChainableMock;
}

// Import after mocks
import { updateKidName } from "./actions";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: "parent-001",
    clerk_id: "clerk-001",
    family_id: "fam-001",
    display_name: "Parent",
    avatar_id: "parent",
    role: "parent",
    grade_level: null,
    current_band: 0,
    device_mode: "none",
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

let mockSupabase: ChainableMock;

function setupAuth(profile?: Record<string, unknown>) {
  mockSupabase = createChainableMock();
  const p = makeProfile(profile);
  mockRequireAuth.mockResolvedValue({
    userId: p.clerk_id,
    profile: p,
    supabase: mockSupabase,
  });
  return mockSupabase;
}

// ---------------------------------------------------------------------------
// updateKidName
// ---------------------------------------------------------------------------

describe("updateKidName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid profile UUID", async () => {
    setupAuth();
    const result = await updateKidName("bad-id", "Cassidy");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid profile ID.");
  });

  it("returns error for empty name", async () => {
    setupAuth();
    const result = await updateKidName(
      "00000000-0000-4000-8000-000000000001",
      "   ",
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Name cannot be empty.");
  });

  it("returns error for name exceeding 30 characters", async () => {
    setupAuth();
    const result = await updateKidName(
      "00000000-0000-4000-8000-000000000001",
      "A".repeat(31),
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain("30 characters");
  });

  it("returns error for name with invalid characters", async () => {
    setupAuth();
    const result = await updateKidName(
      "00000000-0000-4000-8000-000000000001",
      "Kid<script>",
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain("can only contain");
  });

  it("returns error when role is not parent", async () => {
    setupAuth({ role: "kid" });
    const result = await updateKidName(
      "00000000-0000-4000-8000-000000000001",
      "NewName",
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Only parents can edit learner names.");
  });

  it("returns error when kid profile not found", async () => {
    const supabase = setupAuth();
    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }));

    const result = await updateKidName(
      "00000000-0000-4000-8000-000000000001",
      "NewName",
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Learner profile not found.");
  });

  it("returns error when kid is in a different family", async () => {
    const supabase = setupAuth({ family_id: "fam-001" });
    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: "kid-001", family_id: "fam-999", role: "kid" },
          }),
        }),
      }),
    }));

    const result = await updateKidName(
      "00000000-0000-4000-8000-000000000001",
      "NewName",
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Learner profile not found.");
  });

  it("returns error when target profile is not a kid", async () => {
    const supabase = setupAuth({ family_id: "fam-001" });
    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: "parent-002", family_id: "fam-001", role: "parent" },
          }),
        }),
      }),
    }));

    const result = await updateKidName(
      "00000000-0000-4000-8000-000000000001",
      "NewName",
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Can only edit learner profiles.");
  });

  it("successfully updates kid name", async () => {
    const supabase = setupAuth({ family_id: "fam-001" });
    let fromCallCount = 0;
    const updateMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    supabase.from.mockImplementation(() => {
      fromCallCount++;
      if (fromCallCount === 1) {
        // Kid profile lookup
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "kid-001", family_id: "fam-001", role: "kid" },
              }),
            }),
          }),
        };
      }
      // Update
      return { update: updateMock };
    });

    const result = await updateKidName(
      "00000000-0000-4000-8000-000000000001",
      "  Cassidy  ",
    );
    expect(result.success).toBe(true);
    expect(updateMock).toHaveBeenCalledWith({ display_name: "Cassidy" });
  });

  it("accepts names with accented characters and apostrophes", async () => {
    const supabase = setupAuth({ family_id: "fam-001" });
    let fromCallCount = 0;

    supabase.from.mockImplementation(() => {
      fromCallCount++;
      if (fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "kid-001", family_id: "fam-001", role: "kid" },
              }),
            }),
          }),
        };
      }
      return {
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      };
    });

    const result = await updateKidName(
      "00000000-0000-4000-8000-000000000001",
      "O'Brien-Jose",
    );
    expect(result.success).toBe(true);
  });

  it("returns error when update query fails", async () => {
    const supabase = setupAuth({ family_id: "fam-001" });
    let fromCallCount = 0;

    supabase.from.mockImplementation(() => {
      fromCallCount++;
      if (fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "kid-001", family_id: "fam-001", role: "kid" },
              }),
            }),
          }),
        };
      }
      return {
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: { message: "Update failed" } }),
        }),
      };
    });

    const result = await updateKidName(
      "00000000-0000-4000-8000-000000000001",
      "ValidName",
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to update name.");
  });
});
