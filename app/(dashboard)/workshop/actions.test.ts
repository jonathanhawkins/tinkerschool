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
  gte: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  upsert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
}

function createChainableMock(): ChainableMock {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};

  chain.single = vi.fn().mockResolvedValue({ data: null, error: null });
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.gte = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockResolvedValue({ error: null });
  chain.upsert = vi.fn().mockResolvedValue({ error: null });
  chain.update = vi.fn().mockReturnValue(chain);
  chain.delete = vi.fn().mockReturnValue(chain);
  chain.from = vi.fn().mockReturnValue(chain);

  return chain as unknown as ChainableMock;
}

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

const mockAuth = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/badges/evaluate-badges", () => ({
  evaluateBadges: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/gamification/streaks", () => ({
  updateStreak: vi.fn().mockResolvedValue({ currentStreak: 1, longestStreak: 1, isNewDay: true }),
}));

vi.mock("@/lib/gamification/xp", () => ({
  awardXP: vi.fn().mockResolvedValue({ xp: 20, level: 1, levelName: "Beginner", leveledUp: false, xpAwarded: 20 }),
}));

let mockServerSupabase: ChainableMock;

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() => Promise.resolve(mockServerSupabase)),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: vi.fn(() => mockServerSupabase),
}));

// Import after mocks
import {
  saveProject,
  updateProgress,
  submitProjectToGallery,
  deleteProject,
  renameProject,
  recordDeviceFlash,
} from "./actions";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value);
  }
  return fd;
}

function setupKidProfile() {
  let fromCallCount = 0;
  mockServerSupabase.from.mockImplementation(() => {
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

    // Subsequent calls return chainable mock
    return createChainableMock();
  });
}

// ---------------------------------------------------------------------------
// saveProject
// ---------------------------------------------------------------------------

describe("saveProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_123" });
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await saveProject(makeFormData({ title: "Test" }));

    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });

  it("returns error when profile not found", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }));

    const result = await saveProject(makeFormData({ title: "Test" }));

    expect(result.success).toBe(false);
    expect(result.error).toBe("Profile not found");
  });

  it("returns error for invalid lesson_id format", async () => {
    setupKidProfile();

    const result = await saveProject(
      makeFormData({ title: "Test", lesson_id: "not-a-uuid" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid lesson ID");
  });

  it("saves project successfully with default title", async () => {
    let fromCallCount = 0;
    const insertMock = vi.fn().mockResolvedValue({ error: null });

    mockServerSupabase.from.mockImplementation(() => {
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

      if (fromCallCount === 2) {
        return { insert: insertMock };
      }

      return createChainableMock();
    });

    const result = await saveProject(makeFormData({}));

    expect(result.success).toBe(true);
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        profile_id: "kid-001",
        family_id: "fam-001",
        title: "My Project",
      }),
    );
  });

  it("truncates title to 100 characters", async () => {
    let fromCallCount = 0;
    const insertMock = vi.fn().mockResolvedValue({ error: null });

    mockServerSupabase.from.mockImplementation(() => {
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
      if (fromCallCount === 2) return { insert: insertMock };
      return createChainableMock();
    });

    await saveProject(makeFormData({ title: "A".repeat(200) }));

    const payload = insertMock.mock.calls[0][0];
    expect(payload.title).toHaveLength(100);
  });

  it("returns error when insert fails", async () => {
    let fromCallCount = 0;

    mockServerSupabase.from.mockImplementation(() => {
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
      if (fromCallCount === 2) {
        return { insert: vi.fn().mockResolvedValue({ error: { message: "Failed" } }) };
      }
      return createChainableMock();
    });

    const result = await saveProject(makeFormData({ title: "Test" }));

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to save project");
  });
});

// ---------------------------------------------------------------------------
// updateProgress
// ---------------------------------------------------------------------------

describe("updateProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_123" });
  });

  it("returns error for invalid UUID", async () => {
    const result = await updateProgress("bad-id", "in_progress");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid lesson ID");
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await updateProgress(
      "00000000-0000-4000-8000-000000000001",
      "in_progress",
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });

  it("returns error when profile not found", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }));

    const result = await updateProgress(
      "00000000-0000-4000-8000-000000000001",
      "in_progress",
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Profile not found");
  });

  it("upserts in_progress with ignoreDuplicates=true", async () => {
    let fromCallCount = 0;
    const upsertMock = vi.fn().mockResolvedValue({ error: null });

    mockServerSupabase.from.mockImplementation(() => {
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
      return { upsert: upsertMock };
    });

    const result = await updateProgress(
      "00000000-0000-4000-8000-000000000001",
      "in_progress",
    );

    expect(result.success).toBe(true);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ status: "in_progress" }),
      expect.objectContaining({ ignoreDuplicates: true }),
    );
  });

  it("upserts completed with ignoreDuplicates=false and awards XP", async () => {
    let fromCallCount = 0;
    const upsertMock = vi.fn().mockResolvedValue({ error: null });

    mockServerSupabase.from.mockImplementation(() => {
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
      return { upsert: upsertMock };
    });

    const result = await updateProgress(
      "00000000-0000-4000-8000-000000000001",
      "completed",
    );

    expect(result.success).toBe(true);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ status: "completed" }),
      expect.objectContaining({ ignoreDuplicates: false }),
    );
  });

  it("returns error when upsert fails", async () => {
    let fromCallCount = 0;

    mockServerSupabase.from.mockImplementation(() => {
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
      return { upsert: vi.fn().mockResolvedValue({ error: { message: "Failed" } }) };
    });

    const result = await updateProgress(
      "00000000-0000-4000-8000-000000000001",
      "completed",
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to update progress");
  });
});

// ---------------------------------------------------------------------------
// submitProjectToGallery
// ---------------------------------------------------------------------------

describe("submitProjectToGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_123" });
  });

  it("returns error for invalid project ID", async () => {
    const result = await submitProjectToGallery("bad");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid project ID");
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await submitProjectToGallery("00000000-0000-4000-8000-000000000001");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });

  it("returns error when profile not found", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }));

    const result = await submitProjectToGallery("00000000-0000-4000-8000-000000000001");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Profile not found");
  });

  it("succeeds when update works", async () => {
    let fromCallCount = 0;
    mockServerSupabase.from.mockImplementation(() => {
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
      // update chain
      return {
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }),
        }),
      };
    });

    const result = await submitProjectToGallery("00000000-0000-4000-8000-000000000001");
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// deleteProject
// ---------------------------------------------------------------------------

describe("deleteProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_123" });
  });

  it("returns error for invalid project ID", async () => {
    const result = await deleteProject("bad");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid project ID");
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await deleteProject("00000000-0000-4000-8000-000000000001");
    expect(result.success).toBe(false);
  });

  it("succeeds for kid deleting own project", async () => {
    let fromCallCount = 0;
    mockServerSupabase.from.mockImplementation(() => {
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
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }),
        }),
      };
    });

    const result = await deleteProject("00000000-0000-4000-8000-000000000001");
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// renameProject
// ---------------------------------------------------------------------------

describe("renameProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_123" });
  });

  it("returns error for invalid project ID", async () => {
    const result = await renameProject("bad", "New Name");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid project ID");
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await renameProject(
      "00000000-0000-4000-8000-000000000001",
      "New",
    );
    expect(result.success).toBe(false);
  });

  it("returns error for empty title", async () => {
    const result = await renameProject(
      "00000000-0000-4000-8000-000000000001",
      "   ",
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Title must be 1-100 characters");
  });

  it("returns error for title over 100 characters", async () => {
    const result = await renameProject(
      "00000000-0000-4000-8000-000000000001",
      "A".repeat(101),
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Title must be 1-100 characters");
  });

  it("succeeds with valid title", async () => {
    let fromCallCount = 0;
    mockServerSupabase.from.mockImplementation(() => {
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
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }),
        }),
      };
    });

    const result = await renameProject(
      "00000000-0000-4000-8000-000000000001",
      "  My Cool Project  ",
    );
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// recordDeviceFlash
// ---------------------------------------------------------------------------

describe("recordDeviceFlash", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_123" });
  });

  it("returns error for invalid device type", async () => {
    const result = await recordDeviceFlash("bluetooth" as "usb-serial");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid device type");
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await recordDeviceFlash("simulator");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });

  it("returns error when profile not found", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }));

    const result = await recordDeviceFlash("simulator");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Profile not found");
  });

  it("skips insert if recent session exists (dedup)", async () => {
    let fromCallCount = 0;
    mockServerSupabase.from.mockImplementation(() => {
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

      if (fromCallCount === 2) {
        // Recent sessions check - found one
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: [{ id: "session-recent" }],
                }),
              }),
            }),
          }),
        };
      }

      return createChainableMock();
    });

    const result = await recordDeviceFlash("simulator");

    expect(result.success).toBe(true);
    // No badges should be evaluated (we short-circuited)
  });

  it("inserts session and evaluates badges for valid flash", async () => {
    let fromCallCount = 0;
    const insertMock = vi.fn().mockResolvedValue({ error: null });

    mockServerSupabase.from.mockImplementation(() => {
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

      if (fromCallCount === 2) {
        // No recent sessions
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({ data: [] }),
              }),
            }),
          }),
        };
      }

      if (fromCallCount === 3) {
        return { insert: insertMock };
      }

      return createChainableMock();
    });

    const result = await recordDeviceFlash("usb-serial");

    expect(result.success).toBe(true);
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        profile_id: "kid-001",
        device_type: "usb-serial",
      }),
    );
  });

  it("accepts all valid device types", async () => {
    const validTypes = ["usb-serial", "wifi-webrepl", "simulator"] as const;

    for (const deviceType of validTypes) {
      vi.clearAllMocks();
      mockAuth.mockResolvedValue({ userId: "user_123" });
      mockServerSupabase = createChainableMock();

      let fromCallCount = 0;
      mockServerSupabase.from.mockImplementation(() => {
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
        if (fromCallCount === 2) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({ data: [] }),
                }),
              }),
            }),
          };
        }
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      });

      const result = await recordDeviceFlash(deviceType);
      expect(result.success).toBe(true);
    }
  });
});
