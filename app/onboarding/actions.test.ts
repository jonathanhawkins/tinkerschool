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
  lte: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  upsert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
}

function createChainableMock(): ChainableMock {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};

  chain.single = vi.fn().mockResolvedValue({ data: null, error: null });
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.lte = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.upsert = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.from = vi.fn().mockReturnValue(chain);

  return chain as unknown as ChainableMock;
}

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

const mockAuth = vi.fn();
const mockClerkClient = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
  clerkClient: () => mockClerkClient(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn((name: string) => {
      if (name === "x-forwarded-for") return "192.168.1.1, 10.0.0.1";
      if (name === "x-real-ip") return "192.168.1.1";
      return null;
    }),
  }),
}));

vi.mock("@/lib/auth/pin", () => ({
  hashPin: vi.fn().mockResolvedValue("$2b$10$hashedpin1234"),
}));

let mockServerSupabase: ChainableMock;
let mockAdminSupabase: ChainableMock;

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() => Promise.resolve(mockServerSupabase)),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: vi.fn(() => mockAdminSupabase),
}));

// Import after mocks are set up
import { redirect } from "next/navigation";
import { hashPin } from "@/lib/auth/pin";
import {
  completeOnboarding,
  updateDeviceMode,
  getStarterLessonId,
  checkInvitedParentStatus,
  completeInvitedParentOnboarding,
} from "./actions";

const mockRedirect = vi.mocked(redirect);
const mockHashPin = vi.mocked(hashPin);

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

const validOnboardingData: Record<string, string> = {
  family_name: "Smith",
  parent_name: "John",
  child_name: "Cassidy",
  grade_level: "1",
  avatar_id: "robot",
  pin: "1234",
  coppa_consent: "true",
};

// ---------------------------------------------------------------------------
// completeOnboarding
// ---------------------------------------------------------------------------

describe("completeOnboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAdminSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_abc123" });
    mockClerkClient.mockResolvedValue({
      organizations: {
        createOrganization: vi.fn().mockResolvedValue({ id: "org_xyz" }),
      },
    });
  });

  // ---- Auth checks ----

  it("returns error when user is not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await completeOnboarding(makeFormData(validOnboardingData));

    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });

  // ---- Missing fields ----

  it("returns error when family_name is missing", async () => {
    const data = { ...validOnboardingData };
    delete data.family_name;
    const result = await completeOnboarding(makeFormData(data));

    expect(result.success).toBe(false);
    expect(result.error).toBe("All fields are required.");
  });

  it("returns error when parent_name is missing", async () => {
    const data = { ...validOnboardingData };
    delete data.parent_name;
    const result = await completeOnboarding(makeFormData(data));

    expect(result.success).toBe(false);
    expect(result.error).toBe("All fields are required.");
  });

  it("returns error when child_name is missing", async () => {
    const data = { ...validOnboardingData };
    delete data.child_name;
    const result = await completeOnboarding(makeFormData(data));

    expect(result.success).toBe(false);
    expect(result.error).toBe("All fields are required.");
  });

  it("returns error when grade_level is missing", async () => {
    const data = { ...validOnboardingData };
    delete data.grade_level;
    const result = await completeOnboarding(makeFormData(data));

    expect(result.success).toBe(false);
    expect(result.error).toBe("All fields are required.");
  });

  it("returns error when avatar_id is missing", async () => {
    const data = { ...validOnboardingData };
    delete data.avatar_id;
    const result = await completeOnboarding(makeFormData(data));

    expect(result.success).toBe(false);
    expect(result.error).toBe("All fields are required.");
  });

  it("returns error when pin is missing", async () => {
    const data = { ...validOnboardingData };
    delete data.pin;
    const result = await completeOnboarding(makeFormData(data));

    expect(result.success).toBe(false);
    expect(result.error).toBe("All fields are required.");
  });

  // ---- COPPA consent ----

  it("returns error when coppa_consent is false", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, coppa_consent: "false" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Parental consent is required");
  });

  it("returns error when coppa_consent is not provided", async () => {
    const data = { ...validOnboardingData };
    delete data.coppa_consent;
    const result = await completeOnboarding(makeFormData(data));

    expect(result.success).toBe(false);
    expect(result.error).toContain("Parental consent is required");
  });

  // ---- Name validation ----

  it("returns error when family_name exceeds 50 characters", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, family_name: "A".repeat(51) }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Family name must be 50 characters");
  });

  it("returns error when family_name contains invalid characters", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, family_name: "Smith<script>" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Family name can only contain");
  });

  it("returns error when parent_name exceeds 50 characters", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, parent_name: "B".repeat(51) }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Parent name must be 50 characters");
  });

  it("returns error when parent_name contains invalid characters", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, parent_name: "John@Smith" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Parent name can only contain");
  });

  it("returns error when child_name exceeds 30 characters", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, child_name: "C".repeat(31) }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Child name must be 30 characters");
  });

  it("returns error when child_name contains invalid characters", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, child_name: "Kid!@#" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Child name can only contain");
  });

  it("accepts names with accented characters and apostrophes", async () => {
    // Setup so it doesn't fail on the existing profile check
    mockServerSupabase.from.mockImplementation(() => {
      const chain = createChainableMock();
      chain.single.mockResolvedValue({ data: null, error: { code: "PGRST116" } });
      chain.eq.mockReturnValue(chain);
      chain.select.mockReturnValue(chain);
      chain.upsert.mockReturnValue(chain);
      chain.insert.mockReturnValue(chain);
      return chain;
    });

    // Will fail at a later step (Clerk org creation) since we haven't fully mocked the
    // happy path here, but the important thing is it passes name validation.
    const result = await completeOnboarding(
      makeFormData({
        ...validOnboardingData,
        family_name: "O'Brien-Dupont",
        parent_name: "Rene",
        child_name: "Jose",
      }),
    );

    // If name validation passed, we should NOT see name-related errors
    expect(result.error).not.toContain("can only contain");
  });

  // ---- PIN validation ----

  it("returns error when pin is not 4 digits", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, pin: "123" }),
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("PIN must be exactly 4 digits.");
  });

  it("returns error when pin contains non-digits", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, pin: "12ab" }),
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("PIN must be exactly 4 digits.");
  });

  it("returns error when pin is too long", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, pin: "12345" }),
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("PIN must be exactly 4 digits.");
  });

  // ---- Grade level validation ----

  it("returns error for invalid grade level", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, grade_level: "7" }),
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid grade level.");
  });

  it("returns error for non-numeric grade level", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, grade_level: "abc" }),
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid grade level.");
  });

  // ---- Avatar validation ----

  it("returns error for invalid avatar ID", async () => {
    const result = await completeOnboarding(
      makeFormData({ ...validOnboardingData, avatar_id: "unknown_avatar" }),
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid avatar selection.");
  });

  it("accepts all valid avatar IDs", async () => {
    const validAvatars = [
      "robot", "fairy", "astronaut", "wizard", "dragon", "unicorn", "ninja", "scientist",
    ];

    for (const avatar of validAvatars) {
      vi.clearAllMocks();
      mockAuth.mockResolvedValue({ userId: "user_abc123" });
      mockServerSupabase = createChainableMock();
      mockAdminSupabase = createChainableMock();

      // Mock existing profile check to return null (no existing profile)
      mockServerSupabase.from.mockImplementation(() => {
        const chain = createChainableMock();
        chain.single.mockResolvedValue({ data: null, error: { code: "PGRST116" } });
        chain.eq.mockReturnValue(chain);
        chain.select.mockReturnValue(chain);
        chain.upsert.mockReturnValue(chain);
        chain.insert.mockReturnValue(chain);
        return chain;
      });

      mockClerkClient.mockResolvedValue({
        organizations: {
          createOrganization: vi.fn().mockResolvedValue({ id: "org_xyz" }),
        },
      });

      const result = await completeOnboarding(
        makeFormData({ ...validOnboardingData, avatar_id: avatar }),
      );

      // Should not fail on avatar validation
      expect(result.error).not.toBe("Invalid avatar selection.");
    }
  });

  // ---- Existing profile redirects ----

  it("redirects to /home when parent profile already exists", async () => {
    // Mock the existing profile check to return a profile
    mockServerSupabase.from.mockImplementation(() => {
      const chain = createChainableMock();
      chain.single.mockResolvedValue({ data: { id: "existing-profile-id" }, error: null });
      chain.eq.mockReturnValue(chain);
      chain.select.mockReturnValue(chain);
      return chain;
    });

    await expect(
      completeOnboarding(makeFormData(validOnboardingData)),
    ).rejects.toThrow("REDIRECT:/home");

    expect(mockRedirect).toHaveBeenCalledWith("/home");
  });

  // ---- Clerk org creation failure ----

  it("returns error when Clerk organization creation fails", async () => {
    // Mock no existing profile
    mockServerSupabase.from.mockImplementation(() => {
      const chain = createChainableMock();
      chain.single.mockResolvedValue({ data: null, error: { code: "PGRST116" } });
      chain.eq.mockReturnValue(chain);
      chain.select.mockReturnValue(chain);
      return chain;
    });

    mockClerkClient.mockResolvedValue({
      organizations: {
        createOrganization: vi.fn().mockRejectedValue(new Error("Clerk API error")),
      },
    });

    const result = await completeOnboarding(makeFormData(validOnboardingData));

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to create family organization.");
  });

  // ---- Happy path ----

  it("successfully creates family, parent profile, kid profile, and learning profile", async () => {
    const profilesInsertMock = vi.fn();
    const familiesUpsertMock = vi.fn();
    const adminInsertMock = vi.fn();
    let fromCallCount = 0;

    // First call: profiles (existing check) -> null
    // Second call: families upsert -> { id: "family-001" }
    // Third call: profiles insert (parent) -> success
    // Fourth call: profiles insert (kid) -> { id: "kid-001" }
    mockServerSupabase.from.mockImplementation((table: string) => {
      fromCallCount++;

      if (table === "profiles" && fromCallCount === 1) {
        // Existing profile check
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
            }),
          }),
        };
      }

      if (table === "families") {
        familiesUpsertMock.mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "family-001" },
              error: null,
            }),
          }),
        });
        return { upsert: familiesUpsertMock };
      }

      if (table === "profiles" && fromCallCount === 3) {
        // Parent profile insert
        profilesInsertMock.mockResolvedValue({ error: null });
        return { insert: profilesInsertMock };
      }

      if (table === "profiles" && fromCallCount === 4) {
        // Kid profile insert
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "kid-001" },
                error: null,
              }),
            }),
          }),
        };
      }

      return createChainableMock();
    });

    // Admin client for learning profile
    adminInsertMock.mockResolvedValue({ error: null });
    mockAdminSupabase.from.mockImplementation(() => {
      return { insert: adminInsertMock };
    });

    const result = await completeOnboarding(makeFormData(validOnboardingData));

    expect(result.success).toBe(true);
    expect(result.kidProfileId).toBe("kid-001");

    // Verify hashPin was called with the pin
    expect(mockHashPin).toHaveBeenCalledWith("1234");

    // Verify family was created with COPPA consent
    expect(familiesUpsertMock).toHaveBeenCalledTimes(1);
    const familyPayload = familiesUpsertMock.mock.calls[0][0];
    expect(familyPayload.clerk_org_id).toBe("org_xyz");
    expect(familyPayload.name).toBe("Smith");
    expect(familyPayload.coppa_consent_given).toBe(true);
    expect(familyPayload.coppa_consent_ip).toBe("192.168.1.1");

    // Verify parent profile was created
    expect(profilesInsertMock).toHaveBeenCalledTimes(1);
    const parentPayload = profilesInsertMock.mock.calls[0][0];
    expect(parentPayload.clerk_id).toBe("user_abc123");
    expect(parentPayload.display_name).toBe("John");
    expect(parentPayload.role).toBe("parent");
    expect(parentPayload.avatar_id).toBe("parent");

    // Verify learning profile was created via admin client
    expect(adminInsertMock).toHaveBeenCalledTimes(1);
    const learningPayload = adminInsertMock.mock.calls[0][0];
    expect(learningPayload.profile_id).toBe("kid-001");
    expect(learningPayload.preferred_session_length).toBe(15);
  });

  // ---- Family creation failure ----

  it("returns error when family upsert fails", async () => {
    let fromCallCount = 0;

    mockServerSupabase.from.mockImplementation((table: string) => {
      fromCallCount++;

      if (table === "profiles" && fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
            }),
          }),
        };
      }

      if (table === "families") {
        return {
          upsert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Insert failed" },
              }),
            }),
          }),
        };
      }

      return createChainableMock();
    });

    const result = await completeOnboarding(makeFormData(validOnboardingData));

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to create family.");
  });

  // ---- Parent profile creation failure ----

  it("returns error when parent profile insert fails", async () => {
    let fromCallCount = 0;

    mockServerSupabase.from.mockImplementation((table: string) => {
      fromCallCount++;

      if (table === "profiles" && fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
            }),
          }),
        };
      }

      if (table === "families") {
        return {
          upsert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "family-001" },
                error: null,
              }),
            }),
          }),
        };
      }

      if (table === "profiles" && fromCallCount === 3) {
        return {
          insert: vi.fn().mockResolvedValue({ error: { message: "Duplicate" } }),
        };
      }

      return createChainableMock();
    });

    const result = await completeOnboarding(makeFormData(validOnboardingData));

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to create parent profile.");
  });

  // ---- Kid profile creation failure ----

  it("returns error when kid profile insert fails", async () => {
    let fromCallCount = 0;

    mockServerSupabase.from.mockImplementation((table: string) => {
      fromCallCount++;

      if (table === "profiles" && fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
            }),
          }),
        };
      }

      if (table === "families") {
        return {
          upsert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "family-001" },
                error: null,
              }),
            }),
          }),
        };
      }

      if (table === "profiles" && fromCallCount === 3) {
        // Parent insert success
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      }

      if (table === "profiles" && fromCallCount === 4) {
        // Kid insert failure
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Insert failed" },
              }),
            }),
          }),
        };
      }

      return createChainableMock();
    });

    const result = await completeOnboarding(makeFormData(validOnboardingData));

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to create kid profile.");
  });

  // ---- Band assignment for kid profiles ----

  it("assigns band 1 (Explorer) for kindergarten (grade 0)", async () => {
    let kidPayload: Record<string, unknown> | null = null;
    let fromCallCount = 0;

    mockServerSupabase.from.mockImplementation((table: string) => {
      fromCallCount++;

      if (table === "profiles" && fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
            }),
          }),
        };
      }

      if (table === "families") {
        return {
          upsert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: "fam-1" }, error: null }),
            }),
          }),
        };
      }

      if (table === "profiles" && fromCallCount === 3) {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }

      if (table === "profiles" && fromCallCount === 4) {
        return {
          insert: vi.fn().mockImplementation((payload: Record<string, unknown>) => {
            kidPayload = payload;
            return {
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { id: "kid-1" }, error: null }),
              }),
            };
          }),
        };
      }

      return createChainableMock();
    });

    mockAdminSupabase.from.mockImplementation(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }));

    await completeOnboarding(
      makeFormData({ ...validOnboardingData, grade_level: "0" }),
    );

    expect(kidPayload).not.toBeNull();
    expect((kidPayload as Record<string, unknown>).current_band).toBe(1);
    expect((kidPayload as Record<string, unknown>).grade_level).toBe(0);
  });

  it("assigns band 2 (Builder) for grade 2", async () => {
    let kidPayload: Record<string, unknown> | null = null;
    let fromCallCount = 0;

    mockServerSupabase.from.mockImplementation((table: string) => {
      fromCallCount++;

      if (table === "profiles" && fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
            }),
          }),
        };
      }
      if (table === "families") {
        return {
          upsert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: "fam-1" }, error: null }),
            }),
          }),
        };
      }
      if (table === "profiles" && fromCallCount === 3) {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }
      if (table === "profiles" && fromCallCount === 4) {
        return {
          insert: vi.fn().mockImplementation((payload: Record<string, unknown>) => {
            kidPayload = payload;
            return {
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { id: "kid-1" }, error: null }),
              }),
            };
          }),
        };
      }
      return createChainableMock();
    });

    mockAdminSupabase.from.mockImplementation(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }));

    await completeOnboarding(
      makeFormData({ ...validOnboardingData, grade_level: "2" }),
    );

    expect((kidPayload as Record<string, unknown> | null)?.current_band).toBe(2);
  });

  it("assigns band 5 (Creator) for grade 6", async () => {
    let kidPayload: Record<string, unknown> | null = null;
    let fromCallCount = 0;

    mockServerSupabase.from.mockImplementation((table: string) => {
      fromCallCount++;

      if (table === "profiles" && fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
            }),
          }),
        };
      }
      if (table === "families") {
        return {
          upsert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: "fam-1" }, error: null }),
            }),
          }),
        };
      }
      if (table === "profiles" && fromCallCount === 3) {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }
      if (table === "profiles" && fromCallCount === 4) {
        return {
          insert: vi.fn().mockImplementation((payload: Record<string, unknown>) => {
            kidPayload = payload;
            return {
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { id: "kid-1" }, error: null }),
              }),
            };
          }),
        };
      }
      return createChainableMock();
    });

    mockAdminSupabase.from.mockImplementation(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }));

    await completeOnboarding(
      makeFormData({ ...validOnboardingData, grade_level: "6" }),
    );

    expect((kidPayload as Record<string, unknown> | null)?.current_band).toBe(5);
  });

  // ---- Learning profile failure does not fail onboarding ----

  it("succeeds even if learning profile creation fails", async () => {
    let fromCallCount = 0;

    mockServerSupabase.from.mockImplementation((table: string) => {
      fromCallCount++;

      if (table === "profiles" && fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
            }),
          }),
        };
      }
      if (table === "families") {
        return {
          upsert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: "fam-1" }, error: null }),
            }),
          }),
        };
      }
      if (table === "profiles" && fromCallCount === 3) {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }
      if (table === "profiles" && fromCallCount === 4) {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: "kid-1" }, error: null }),
            }),
          }),
        };
      }
      return createChainableMock();
    });

    // Admin client fails for learning profile
    mockAdminSupabase.from.mockImplementation(() => ({
      insert: vi.fn().mockResolvedValue({ error: { message: "Insert failed" } }),
    }));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await completeOnboarding(makeFormData(validOnboardingData));

    expect(result.success).toBe(true);
    expect(result.kidProfileId).toBe("kid-1");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to create learning profile:",
      expect.anything(),
    );

    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// updateDeviceMode
// ---------------------------------------------------------------------------

describe("updateDeviceMode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_abc123" });
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await updateDeviceMode(
      "00000000-0000-4000-8000-000000000001",
      "usb",
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });

  it("returns error when kidProfileId is not a valid UUID", async () => {
    const result = await updateDeviceMode("not-a-uuid", "usb");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid profile ID.");
  });

  it("returns error for invalid device mode", async () => {
    const result = await updateDeviceMode(
      "00000000-0000-4000-8000-000000000001",
      "bluetooth" as "usb",
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid device mode.");
  });

  it("returns error when parent profile is not found", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    }));

    const result = await updateDeviceMode(
      "00000000-0000-4000-8000-000000000001",
      "usb",
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Parent profile not found.");
  });

  it("returns error when update query fails", async () => {
    let fromCallCount = 0;

    mockServerSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        // Parent profile lookup
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { family_id: "family-001" },
                error: null,
              }),
            }),
          }),
        };
      }

      // Update query
      return {
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: { message: "Update failed" },
            }),
          }),
        }),
      };
    });

    const result = await updateDeviceMode(
      "00000000-0000-4000-8000-000000000001",
      "usb",
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to update device mode.");
  });

  it("successfully updates device mode for all valid modes", async () => {
    const validModes = ["usb", "wifi", "simulator", "none"] as const;

    for (const mode of validModes) {
      vi.clearAllMocks();
      mockAuth.mockResolvedValue({ userId: "user_abc123" });
      mockServerSupabase = createChainableMock();

      let fromCallCount = 0;
      const updateMock = vi.fn();

      mockServerSupabase.from.mockImplementation(() => {
        fromCallCount++;

        if (fromCallCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { family_id: "family-001" },
                  error: null,
                }),
              }),
            }),
          };
        }

        updateMock.mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        });
        return { update: updateMock };
      });

      const result = await updateDeviceMode(
        "00000000-0000-4000-8000-000000000001",
        mode,
      );

      expect(result.success).toBe(true);
      expect(updateMock).toHaveBeenCalledWith({ device_mode: mode });
    }
  });
});

// ---------------------------------------------------------------------------
// getStarterLessonId
// ---------------------------------------------------------------------------

describe("getStarterLessonId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_abc123" });
  });

  it("returns null when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await getStarterLessonId(1);

    expect(result).toBeNull();
  });

  it("returns null when no module exists for the band", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        lte: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          }),
        }),
      }),
    }));

    const result = await getStarterLessonId(1);

    expect(result).toBeNull();
  });

  it("returns null when no lesson exists in the first module", async () => {
    let fromCallCount = 0;

    mockServerSupabase.from.mockImplementation((table: string) => {
      fromCallCount++;

      if (table === "modules") {
        return {
          select: vi.fn().mockReturnValue({
            lte: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: { id: "module-001" },
                      error: null,
                    }),
                  }),
                }),
              }),
            }),
          }),
        };
      }

      if (table === "lessons") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          }),
        };
      }

      return createChainableMock();
    });

    const result = await getStarterLessonId(1);

    expect(result).toBeNull();
  });

  it("returns the lesson ID when both module and lesson exist", async () => {
    mockServerSupabase.from.mockImplementation((table: string) => {
      if (table === "modules") {
        return {
          select: vi.fn().mockReturnValue({
            lte: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: { id: "module-001" },
                      error: null,
                    }),
                  }),
                }),
              }),
            }),
          }),
        };
      }

      if (table === "lessons") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: "lesson-001" },
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        };
      }

      return createChainableMock();
    });

    const result = await getStarterLessonId(1);

    expect(result).toBe("lesson-001");
  });
});

// ---------------------------------------------------------------------------
// checkInvitedParentStatus
// ---------------------------------------------------------------------------

describe("checkInvitedParentStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: "user_abc123" });
  });

  it("returns isInvitedParent: false when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await checkInvitedParentStatus();

    expect(result.isInvitedParent).toBe(false);
  });

  it("returns isInvitedParent: true with org info when user has memberships", async () => {
    mockClerkClient.mockResolvedValue({
      users: {
        getOrganizationMembershipList: vi.fn().mockResolvedValue({
          totalCount: 1,
          data: [
            {
              organization: {
                name: "Smith Family",
                id: "org_abc",
              },
            },
          ],
        }),
      },
    });

    const result = await checkInvitedParentStatus();

    expect(result.isInvitedParent).toBe(true);
    expect(result.familyName).toBe("Smith Family");
    expect(result.orgId).toBe("org_abc");
  });

  it("returns isInvitedParent: false when user has no memberships", async () => {
    mockClerkClient.mockResolvedValue({
      users: {
        getOrganizationMembershipList: vi.fn().mockResolvedValue({
          totalCount: 0,
          data: [],
        }),
      },
    });

    const result = await checkInvitedParentStatus();

    expect(result.isInvitedParent).toBe(false);
  });

  it("returns isInvitedParent: false when Clerk API throws", async () => {
    mockClerkClient.mockResolvedValue({
      users: {
        getOrganizationMembershipList: vi.fn().mockRejectedValue(
          new Error("Clerk down"),
        ),
      },
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await checkInvitedParentStatus();

    expect(result.isInvitedParent).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// completeInvitedParentOnboarding
// ---------------------------------------------------------------------------

describe("completeInvitedParentOnboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_abc123" });
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await completeInvitedParentOnboarding(
      makeFormData({ display_name: "Jane" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });

  it("returns error when display_name is missing", async () => {
    const result = await completeInvitedParentOnboarding(makeFormData({}));

    expect(result.success).toBe(false);
    expect(result.error).toBe("Display name is required.");
  });

  it("returns error when display_name is empty after trim", async () => {
    const result = await completeInvitedParentOnboarding(
      makeFormData({ display_name: "   " }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Display name is required.");
  });

  it("returns error when display_name exceeds 50 characters", async () => {
    const result = await completeInvitedParentOnboarding(
      makeFormData({ display_name: "A".repeat(51) }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("50 characters");
  });

  it("returns error when display_name contains invalid characters", async () => {
    const result = await completeInvitedParentOnboarding(
      makeFormData({ display_name: "Jane<script>" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("can only contain");
  });

  it("returns error when user has no org memberships", async () => {
    mockClerkClient.mockResolvedValue({
      users: {
        getOrganizationMembershipList: vi.fn().mockResolvedValue({
          totalCount: 0,
          data: [],
        }),
      },
    });

    const result = await completeInvitedParentOnboarding(
      makeFormData({ display_name: "Jane" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("No family invitation found.");
  });

  it("returns error when Clerk membership lookup fails", async () => {
    mockClerkClient.mockResolvedValue({
      users: {
        getOrganizationMembershipList: vi.fn().mockRejectedValue(
          new Error("Clerk error"),
        ),
      },
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await completeInvitedParentOnboarding(
      makeFormData({ display_name: "Jane" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to look up family invitation.");

    consoleSpy.mockRestore();
  });

  it("returns error when family record is not found for the org", async () => {
    mockClerkClient.mockResolvedValue({
      users: {
        getOrganizationMembershipList: vi.fn().mockResolvedValue({
          totalCount: 1,
          data: [{ organization: { id: "org_abc", name: "Smith" } }],
        }),
      },
    });

    // Family lookup returns null
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    }));

    const result = await completeInvitedParentOnboarding(
      makeFormData({ display_name: "Jane" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Family not found");
  });

  it("updates display name and returns success when profile already exists", async () => {
    mockClerkClient.mockResolvedValue({
      users: {
        getOrganizationMembershipList: vi.fn().mockResolvedValue({
          totalCount: 1,
          data: [{ organization: { id: "org_abc", name: "Smith" } }],
        }),
      },
    });

    let fromCallCount = 0;
    const updateMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    mockServerSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        // Family lookup
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "family-001" },
                error: null,
              }),
            }),
          }),
        };
      }

      if (fromCallCount === 2) {
        // Existing profile check -- profile exists
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "existing-profile" },
                error: null,
              }),
            }),
          }),
        };
      }

      // Profile update
      return { update: updateMock };
    });

    const result = await completeInvitedParentOnboarding(
      makeFormData({ display_name: "Jane" }),
    );

    expect(result.success).toBe(true);
    expect(updateMock).toHaveBeenCalledWith({ display_name: "Jane" });
  });

  it("creates a new parent profile when profile does not exist", async () => {
    mockClerkClient.mockResolvedValue({
      users: {
        getOrganizationMembershipList: vi.fn().mockResolvedValue({
          totalCount: 1,
          data: [{ organization: { id: "org_abc", name: "Smith" } }],
        }),
      },
    });

    let fromCallCount = 0;
    const insertMock = vi.fn().mockResolvedValue({ error: null });

    mockServerSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        // Family lookup
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "family-001" },
                error: null,
              }),
            }),
          }),
        };
      }

      if (fromCallCount === 2) {
        // Existing profile check -- no profile
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: "PGRST116" },
              }),
            }),
          }),
        };
      }

      // Profile insert
      return { insert: insertMock };
    });

    const result = await completeInvitedParentOnboarding(
      makeFormData({ display_name: "Jane" }),
    );

    expect(result.success).toBe(true);
    expect(insertMock).toHaveBeenCalledTimes(1);
    const payload = insertMock.mock.calls[0][0];
    expect(payload.clerk_id).toBe("user_abc123");
    expect(payload.family_id).toBe("family-001");
    expect(payload.display_name).toBe("Jane");
    expect(payload.role).toBe("parent");
    expect(payload.avatar_id).toBe("parent");
    expect(payload.current_band).toBe(0);
  });

  it("returns error when profile insert fails", async () => {
    mockClerkClient.mockResolvedValue({
      users: {
        getOrganizationMembershipList: vi.fn().mockResolvedValue({
          totalCount: 1,
          data: [{ organization: { id: "org_abc", name: "Smith" } }],
        }),
      },
    });

    let fromCallCount = 0;

    mockServerSupabase.from.mockImplementation(() => {
      fromCallCount++;

      if (fromCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "family-001" },
                error: null,
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
                data: null,
                error: { code: "PGRST116" },
              }),
            }),
          }),
        };
      }

      return {
        insert: vi.fn().mockResolvedValue({
          error: { message: "Insert failed" },
        }),
      };
    });

    const result = await completeInvitedParentOnboarding(
      makeFormData({ display_name: "Jane" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to create profile.");
  });
});
