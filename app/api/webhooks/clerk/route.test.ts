import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks — must be declared before importing the module under test
// ---------------------------------------------------------------------------

// Mock "server-only" to prevent it from throwing in the test environment.
vi.mock("server-only", () => ({}));

// Mock next/headers — the Clerk webhook reads svix-* headers via `headers()`.
const mockHeadersMap = new Map<string, string>();
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: (name: string) => mockHeadersMap.get(name) ?? null,
  })),
}));

// Mock svix Webhook class — must use a real class so `new Webhook(...)` works.
const mockVerify = vi.fn();
vi.mock("svix", () => {
  return {
    Webhook: class MockWebhook {
      verify = mockVerify;
    },
  };
});

// Mock Supabase admin client — we build chainable query builder mocks.
const mockUpsert = vi.fn();
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockMaybeSingle = vi.fn();
const mockSingle = vi.fn();

function buildChain() {
  // Each method returns the chain so they can be composed in any order.
  const chain: Record<string, ReturnType<typeof vi.fn>> = {
    upsert: mockUpsert,
    insert: mockInsert,
    select: mockSelect,
    eq: mockEq,
    maybeSingle: mockMaybeSingle,
    single: mockSingle,
  };
  for (const fn of Object.values(chain)) {
    fn.mockReturnValue(chain);
  }
  return chain;
}

const mockFromChain = buildChain();
const mockFrom = vi.fn().mockReturnValue(mockFromChain);

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

// ---------------------------------------------------------------------------
// Import the handler under test AFTER mocks are registered
// ---------------------------------------------------------------------------
import { POST } from "./route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setHeaders(
  overrides: Partial<Record<string, string>> = {},
) {
  mockHeadersMap.clear();
  const defaults: Record<string, string> = {
    "svix-id": "msg_test123",
    "svix-timestamp": "1234567890",
    "svix-signature": "v1,abc123signature",
  };
  const merged = { ...defaults, ...overrides };
  for (const [k, v] of Object.entries(merged)) {
    if (v !== undefined) {
      mockHeadersMap.set(k, v);
    }
  }
}

function makeRequest(body: unknown = {}): Request {
  return new Request("https://tinkerschool.ai/api/webhooks/clerk", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/webhooks/clerk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeadersMap.clear();
    process.env.CLERK_WEBHOOK_SECRET = "whsec_test_secret";

    // Reset chainable mock return values
    buildChainDefaults();
  });

  function buildChainDefaults() {
    mockUpsert.mockReturnValue(mockFromChain);
    mockInsert.mockReturnValue(mockFromChain);
    mockSelect.mockReturnValue(mockFromChain);
    mockEq.mockReturnValue(mockFromChain);
    mockMaybeSingle.mockResolvedValue({ data: null });
    mockSingle.mockResolvedValue({
      data: { id: "family-uuid-123" },
    });
  }

  // -------------------------------------------------------------------------
  // Missing CLERK_WEBHOOK_SECRET
  // -------------------------------------------------------------------------
  it("returns 500 when CLERK_WEBHOOK_SECRET is not set", async () => {
    delete process.env.CLERK_WEBHOOK_SECRET;
    setHeaders();

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Webhook secret not configured");
  });

  // -------------------------------------------------------------------------
  // Missing svix headers
  // -------------------------------------------------------------------------
  it("returns 400 when svix-id header is missing", async () => {
    mockHeadersMap.clear(); // all missing
    // Only set two of three headers
    mockHeadersMap.set("svix-timestamp", "123");
    mockHeadersMap.set("svix-signature", "v1,abc");

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Missing svix headers");
  });

  it("returns 400 when svix-timestamp header is missing", async () => {
    mockHeadersMap.clear();
    mockHeadersMap.set("svix-id", "msg_123");
    mockHeadersMap.set("svix-signature", "v1,abc");

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Missing svix headers");
  });

  it("returns 400 when svix-signature header is missing", async () => {
    mockHeadersMap.clear();
    mockHeadersMap.set("svix-id", "msg_123");
    mockHeadersMap.set("svix-timestamp", "123");

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Missing svix headers");
  });

  // -------------------------------------------------------------------------
  // Signature verification failure
  // -------------------------------------------------------------------------
  it("returns 401 when signature verification fails", async () => {
    setHeaders();
    mockVerify.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Invalid signature");
  });

  // -------------------------------------------------------------------------
  // user.created event — logs only (no DB mutation)
  // -------------------------------------------------------------------------
  it("handles user.created event and returns 200", async () => {
    setHeaders();
    const eventPayload = {
      type: "user.created",
      data: {
        id: "user_abc123",
        first_name: "Cassidy",
        last_name: null,
        email_addresses: [{ email_address: "parent@test.com" }],
        image_url: null,
        public_metadata: {},
      },
    };
    mockVerify.mockReturnValue(eventPayload);

    const res = await POST(makeRequest(eventPayload));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    // user.created only logs, no Supabase mutation expected
    expect(mockFrom).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // user.updated event — logs only (no DB mutation)
  // -------------------------------------------------------------------------
  it("handles user.updated event and returns 200", async () => {
    setHeaders();
    const eventPayload = {
      type: "user.updated",
      data: {
        id: "user_abc123",
        first_name: "Cassidy",
        last_name: "Smith",
        email_addresses: [{ email_address: "parent@test.com" }],
        image_url: "https://img.clerk.com/abc.png",
        public_metadata: { displayName: "Cass" },
      },
    };
    mockVerify.mockReturnValue(eventPayload);

    const res = await POST(makeRequest(eventPayload));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // organizationMembership.created — upserts family + creates profile stub
  // -------------------------------------------------------------------------
  it("handles organizationMembership.created — upserts family and creates profile", async () => {
    setHeaders();

    const eventPayload = {
      type: "organizationMembership.created",
      data: {
        organization: { id: "org_family1", name: "Smith Family" },
        public_user_data: {
          user_id: "user_parent1",
          first_name: "Alice",
          last_name: "Smith",
        },
        role: "org:admin",
      },
    };
    mockVerify.mockReturnValue(eventPayload);

    // family upsert returns an id
    mockSingle.mockResolvedValue({
      data: { id: "family-uuid-abc" },
    });
    // profile lookup returns null (no existing profile)
    mockMaybeSingle.mockResolvedValue({ data: null });

    const res = await POST(makeRequest(eventPayload));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);

    // Should call from("families") for upsert and from("profiles") for lookup + insert
    expect(mockFrom).toHaveBeenCalledWith("families");
    expect(mockFrom).toHaveBeenCalledWith("profiles");
    expect(mockUpsert).toHaveBeenCalledWith(
      { clerk_org_id: "org_family1", name: "Smith Family" },
      { onConflict: "clerk_org_id" },
    );
    expect(mockInsert).toHaveBeenCalledWith({
      clerk_id: "user_parent1",
      family_id: "family-uuid-abc",
      display_name: "Alice Smith",
      avatar_id: "chip",
      role: "parent",
      current_band: 0,
    });
  });

  it("handles organizationMembership.created — sets kid role for non-admin", async () => {
    setHeaders();

    const eventPayload = {
      type: "organizationMembership.created",
      data: {
        organization: { id: "org_family1", name: "Smith Family" },
        public_user_data: {
          user_id: "user_kid1",
          first_name: "Cassidy",
          last_name: null,
        },
        role: "org:member",
      },
    };
    mockVerify.mockReturnValue(eventPayload);

    mockSingle.mockResolvedValue({
      data: { id: "family-uuid-abc" },
    });
    mockMaybeSingle.mockResolvedValue({ data: null });

    const res = await POST(makeRequest(eventPayload));

    expect(res.status).toBe(200);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        clerk_id: "user_kid1",
        display_name: "Cassidy",
        role: "kid",
        current_band: 2,
      }),
    );
  });

  it("handles organizationMembership.created — creates learning_profile for kid", async () => {
    setHeaders();

    const eventPayload = {
      type: "organizationMembership.created",
      data: {
        organization: { id: "org_family1", name: "Smith Family" },
        public_user_data: {
          user_id: "user_kid2",
          first_name: "Lila",
          last_name: null,
        },
        role: "org:member",
      },
    };
    mockVerify.mockReturnValue(eventPayload);

    mockSingle.mockResolvedValue({
      data: { id: "new-kid-profile-uuid" },
    });
    mockMaybeSingle.mockResolvedValue({ data: null });

    const res = await POST(makeRequest(eventPayload));

    expect(res.status).toBe(200);
    // Should insert both the profile and the learning_profile
    expect(mockInsert).toHaveBeenCalledTimes(2);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        profile_id: "new-kid-profile-uuid",
        interests: [],
        preferred_encouragement: "enthusiastic",
      }),
    );
  });

  it("handles organizationMembership.created — does NOT create learning_profile for parent", async () => {
    setHeaders();

    const eventPayload = {
      type: "organizationMembership.created",
      data: {
        organization: { id: "org_family1", name: "Smith Family" },
        public_user_data: {
          user_id: "user_parent2",
          first_name: "Alice",
          last_name: null,
        },
        role: "org:admin",
      },
    };
    mockVerify.mockReturnValue(eventPayload);

    mockSingle.mockResolvedValue({
      data: { id: "new-parent-profile-uuid" },
    });
    mockMaybeSingle.mockResolvedValue({ data: null });

    const res = await POST(makeRequest(eventPayload));

    expect(res.status).toBe(200);
    // Should only insert the profile, NOT a learning_profile
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        role: "parent",
      }),
    );
  });

  it("handles organizationMembership.created — uses 'Member' when name is empty", async () => {
    setHeaders();

    const eventPayload = {
      type: "organizationMembership.created",
      data: {
        organization: { id: "org_family1", name: "Family" },
        public_user_data: {
          user_id: "user_noname",
          first_name: null,
          last_name: null,
        },
        role: "org:member",
      },
    };
    mockVerify.mockReturnValue(eventPayload);

    mockSingle.mockResolvedValue({
      data: { id: "family-uuid-abc" },
    });
    mockMaybeSingle.mockResolvedValue({ data: null });

    const res = await POST(makeRequest(eventPayload));

    expect(res.status).toBe(200);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ display_name: "Member" }),
    );
  });

  it("handles organizationMembership.created — skips profile insert when profile exists", async () => {
    setHeaders();

    const eventPayload = {
      type: "organizationMembership.created",
      data: {
        organization: { id: "org_family1", name: "Smith Family" },
        public_user_data: {
          user_id: "user_existing",
          first_name: "Bob",
          last_name: null,
        },
        role: "org:admin",
      },
    };
    mockVerify.mockReturnValue(eventPayload);

    mockSingle.mockResolvedValue({
      data: { id: "family-uuid-abc" },
    });
    // Profile already exists
    mockMaybeSingle.mockResolvedValue({
      data: { id: "existing-profile-uuid" },
    });

    const res = await POST(makeRequest(eventPayload));

    expect(res.status).toBe(200);
    // insert should NOT be called for profiles since profile exists
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("handles organizationMembership.created — skips profile when family upsert fails", async () => {
    setHeaders();

    const eventPayload = {
      type: "organizationMembership.created",
      data: {
        organization: { id: "org_fail", name: "Fail Family" },
        public_user_data: {
          user_id: "user_abc",
          first_name: "Test",
          last_name: null,
        },
        role: "org:admin",
      },
    };
    mockVerify.mockReturnValue(eventPayload);

    // family upsert returns null
    mockSingle.mockResolvedValue({ data: null });

    const res = await POST(makeRequest(eventPayload));

    expect(res.status).toBe(200);
    // Should not attempt profile lookup/insert since family is null
    expect(mockInsert).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // organizationMembership.deleted — log only
  // -------------------------------------------------------------------------
  it("handles organizationMembership.deleted and returns 200", async () => {
    setHeaders();

    const eventPayload = {
      type: "organizationMembership.deleted",
      data: {
        organization: { id: "org_family1", name: "Smith Family" },
        public_user_data: {
          user_id: "user_removed",
          first_name: "Bob",
          last_name: null,
        },
        role: "org:member",
      },
    };
    mockVerify.mockReturnValue(eventPayload);

    const res = await POST(makeRequest(eventPayload));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    // Deletion only logs, no mutations
    expect(mockFrom).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Unhandled event types — returns 200 (no-op)
  // -------------------------------------------------------------------------
  it("returns 200 for unhandled event types", async () => {
    setHeaders();

    const eventPayload = {
      type: "session.created",
      data: { id: "sess_123" },
    };
    mockVerify.mockReturnValue(eventPayload);

    const res = await POST(makeRequest(eventPayload));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Internal error during event handling
  // -------------------------------------------------------------------------
  it("returns 500 when event handling throws an error", async () => {
    setHeaders();

    const eventPayload = {
      type: "organizationMembership.created",
      data: {
        organization: { id: "org_family1", name: "Smith Family" },
        public_user_data: {
          user_id: "user_error",
          first_name: "Error",
          last_name: "User",
        },
        role: "org:admin",
      },
    };
    mockVerify.mockReturnValue(eventPayload);

    // Make the upsert chain throw
    mockSingle.mockRejectedValue(new Error("Database connection lost"));

    const res = await POST(makeRequest(eventPayload));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal error processing webhook");
  });

  // -------------------------------------------------------------------------
  // Verify svix headers are passed correctly to wh.verify
  // -------------------------------------------------------------------------
  it("passes the correct svix headers to Webhook.verify", async () => {
    setHeaders({
      "svix-id": "msg_custom_id",
      "svix-timestamp": "9999999999",
      "svix-signature": "v1,custom_sig",
    });

    const eventPayload = { type: "user.created", data: { id: "u1" } };
    mockVerify.mockReturnValue(eventPayload);

    await POST(makeRequest(eventPayload));

    expect(mockVerify).toHaveBeenCalledWith(
      expect.any(String),
      {
        "svix-id": "msg_custom_id",
        "svix-timestamp": "9999999999",
        "svix-signature": "v1,custom_sig",
      },
    );
  });
});
