import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock "server-only" to prevent it from throwing in the test environment.
vi.mock("server-only", () => ({}));

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

const mockAuth = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

// Chainable Supabase mock
function createChainableMock() {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  chain.single = vi.fn().mockResolvedValue({ data: null, error: null });
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.select = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.from = vi.fn().mockReturnValue(chain);
  return chain;
}

let mockServerSupabase: ReturnType<typeof createChainableMock>;
let mockAdminSupabase: ReturnType<typeof createChainableMock>;

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() => Promise.resolve(mockServerSupabase)),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: vi.fn(() => mockAdminSupabase),
}));

// Mock Stripe
const mockStripeCreate = vi.fn();
const mockCheckoutCreate = vi.fn();
const mockPortalCreate = vi.fn();

vi.mock("@/lib/stripe", () => ({
  createStripeClient: vi.fn(() => ({
    customers: { create: mockStripeCreate },
    checkout: {
      sessions: { create: mockCheckoutCreate },
    },
    billingPortal: {
      sessions: { create: mockPortalCreate },
    },
  })),
}));

vi.mock("@/lib/stripe/config", () => ({
  getPriceId: vi.fn(() => "price_test_123"),
}));

// Import after mocks
import { createCheckoutSession, createPortalSession } from "./actions";

// ---------------------------------------------------------------------------
// createCheckoutSession
// ---------------------------------------------------------------------------

describe("createCheckoutSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAdminSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_parent" });
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await createCheckoutSession("monthly");

    expect(result.error).toBe("Not authenticated");
    expect(result.url).toBeUndefined();
  });

  it("returns error when user is not a parent", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: "kid", family_id: "fam-001" },
          }),
        }),
      }),
    }));

    const result = await createCheckoutSession("monthly");

    expect(result.error).toBe("Only parents can manage billing");
  });

  it("returns error when profile not found", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }));

    const result = await createCheckoutSession("monthly");

    expect(result.error).toBe("Only parents can manage billing");
  });

  it("returns error when family not found", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: "parent", family_id: "fam-001" },
          }),
        }),
      }),
    }));

    mockAdminSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }));

    const result = await createCheckoutSession("monthly");

    expect(result.error).toBe("Family not found");
  });

  it("returns error when family already has active subscription", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: "parent", family_id: "fam-001" },
          }),
        }),
      }),
    }));

    let adminCallCount = 0;
    mockAdminSupabase.from.mockImplementation(() => {
      adminCallCount++;

      if (adminCallCount === 1) {
        // Family lookup with stripe_customer_id
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: "fam-001",
                  stripe_customer_id: "cus_123",
                  name: "Smith",
                },
              }),
            }),
          }),
        };
      }

      // Subscription status check
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { stripe_subscription_status: "active" },
            }),
          }),
        }),
      };
    });

    const result = await createCheckoutSession("monthly");

    expect(result.error).toBe("You already have an active subscription");
  });

  it("creates new Stripe customer when none exists", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: "parent", family_id: "fam-001" },
          }),
        }),
      }),
    }));

    let adminCallCount = 0;
    mockAdminSupabase.from.mockImplementation(() => {
      adminCallCount++;

      if (adminCallCount === 1) {
        // Family lookup - no stripe_customer_id
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: "fam-001",
                  stripe_customer_id: null,
                  name: "Smith",
                },
              }),
            }),
          }),
        };
      }

      if (adminCallCount === 2) {
        // Save customer ID
        return {
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      }

      // Subscription status check
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { stripe_subscription_status: null },
            }),
          }),
        }),
      };
    });

    mockStripeCreate.mockResolvedValue({ id: "cus_new_123" });
    mockCheckoutCreate.mockResolvedValue({ url: "https://checkout.stripe.com/test" });

    const result = await createCheckoutSession("monthly");

    expect(mockStripeCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Smith",
        metadata: { family_id: "fam-001" },
      }),
    );
    expect(result.url).toBe("https://checkout.stripe.com/test");
  });

  it("returns checkout URL on success", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: "parent", family_id: "fam-001" },
          }),
        }),
      }),
    }));

    let adminCallCount = 0;
    mockAdminSupabase.from.mockImplementation(() => {
      adminCallCount++;
      if (adminCallCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "fam-001", stripe_customer_id: "cus_existing", name: "Smith" },
              }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { stripe_subscription_status: null },
            }),
          }),
        }),
      };
    });

    mockCheckoutCreate.mockResolvedValue({ url: "https://checkout.stripe.com/sess_123" });

    const result = await createCheckoutSession("monthly");

    expect(result.url).toBe("https://checkout.stripe.com/sess_123");
    expect(result.error).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// createPortalSession
// ---------------------------------------------------------------------------

describe("createPortalSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerSupabase = createChainableMock();
    mockAdminSupabase = createChainableMock();
    mockAuth.mockResolvedValue({ userId: "user_parent" });
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const result = await createPortalSession();

    expect(result.error).toBe("Not authenticated");
  });

  it("returns error when user is not a parent", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: "kid", family_id: "fam-001" },
          }),
        }),
      }),
    }));

    const result = await createPortalSession();

    expect(result.error).toBe("Only parents can manage billing");
  });

  it("returns error when no billing account found", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: "parent", family_id: "fam-001" },
          }),
        }),
      }),
    }));

    mockAdminSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { stripe_customer_id: null },
          }),
        }),
      }),
    }));

    const result = await createPortalSession();

    expect(result.error).toBe("No billing account found");
  });

  it("returns portal URL on success", async () => {
    mockServerSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: "parent", family_id: "fam-001" },
          }),
        }),
      }),
    }));

    mockAdminSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { stripe_customer_id: "cus_123" },
          }),
        }),
      }),
    }));

    mockPortalCreate.mockResolvedValue({ url: "https://billing.stripe.com/portal_123" });

    const result = await createPortalSession();

    expect(result.url).toBe("https://billing.stripe.com/portal_123");
    expect(result.error).toBeUndefined();
    expect(mockPortalCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_123",
      }),
    );
  });
});
