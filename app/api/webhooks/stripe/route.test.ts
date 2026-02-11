import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks — must be declared before importing the module under test
// ---------------------------------------------------------------------------

// Mock "server-only" to prevent it from throwing in the test environment.
vi.mock("server-only", () => ({}));

// Mock Supabase admin client — chainable query builder.
const mockUpdate = vi.fn();
const mockEq = vi.fn();

function resetChain() {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {
    update: mockUpdate,
    eq: mockEq,
  };
  for (const fn of Object.values(chain)) {
    fn.mockReturnValue(chain);
  }
  return chain;
}

const mockFromChain = resetChain();
const mockFrom = vi.fn().mockReturnValue(mockFromChain);

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

// Mock Stripe client — webhooks.constructEvent and subscriptions.retrieve.
const mockConstructEvent = vi.fn();
const mockSubscriptionsRetrieve = vi.fn();

vi.mock("@/lib/stripe", () => ({
  createStripeClient: vi.fn(() => ({
    webhooks: {
      constructEvent: mockConstructEvent,
    },
    subscriptions: {
      retrieve: mockSubscriptionsRetrieve,
    },
  })),
}));

// ---------------------------------------------------------------------------
// Import the handler under test AFTER mocks are registered
// ---------------------------------------------------------------------------
import { POST } from "./route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(
  body: unknown = {},
  stripeSignature: string | null = "sig_test_123",
): Request {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (stripeSignature !== null) {
    headers["stripe-signature"] = stripeSignature;
  }
  return new Request("https://tinkerschool.ai/api/webhooks/stripe", {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
}

function makeCheckoutSessionEvent(overrides: Record<string, unknown> = {}) {
  return {
    type: "checkout.session.completed",
    data: {
      object: {
        metadata: { family_id: "family-uuid-123" },
        customer: "cus_test123",
        subscription: "sub_test456",
        ...overrides,
      },
    },
  };
}

function makeSubscriptionUpdatedEvent(
  status: string,
  overrides: Record<string, unknown> = {},
) {
  return {
    type: "customer.subscription.updated",
    data: {
      object: {
        customer: "cus_test123",
        status,
        items: {
          data: [
            {
              price: { id: "price_abc" },
              current_period_end: 1700000000,
            },
          ],
        },
        ...overrides,
      },
    },
  };
}

function makeSubscriptionDeletedEvent(
  overrides: Record<string, unknown> = {},
) {
  return {
    type: "customer.subscription.deleted",
    data: {
      object: {
        customer: "cus_test123",
        status: "canceled",
        items: {
          data: [
            {
              price: { id: "price_abc" },
              current_period_end: 1700000000,
            },
          ],
        },
        ...overrides,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_stripe_test";
    process.env.STRIPE_SECRET_KEY = "sk_test_123";

    // Reset chain defaults
    resetChain();
    mockFrom.mockReturnValue(mockFromChain);
  });

  // -------------------------------------------------------------------------
  // Missing STRIPE_WEBHOOK_SECRET
  // -------------------------------------------------------------------------
  it("returns 500 when STRIPE_WEBHOOK_SECRET is not set", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Webhook secret not configured");
  });

  // -------------------------------------------------------------------------
  // Missing stripe-signature header
  // -------------------------------------------------------------------------
  it("returns 400 when stripe-signature header is missing", async () => {
    const res = await POST(makeRequest({}, null));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Missing stripe-signature header");
  });

  // -------------------------------------------------------------------------
  // Signature verification failure
  // -------------------------------------------------------------------------
  it("returns 401 when signature verification fails", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("No signatures found matching the expected signature");
    });

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Invalid signature");
  });

  // -------------------------------------------------------------------------
  // checkout.session.completed — updates family to supporter tier
  // -------------------------------------------------------------------------
  it("handles checkout.session.completed — updates family to supporter tier", async () => {
    const event = makeCheckoutSessionEvent();
    mockConstructEvent.mockReturnValue(event);
    mockSubscriptionsRetrieve.mockResolvedValue({
      status: "active",
      items: {
        data: [
          {
            price: { id: "price_monthly_10" },
            current_period_end: 1700000000,
          },
        ],
      },
    });

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);

    // Should retrieve the subscription
    expect(mockSubscriptionsRetrieve).toHaveBeenCalledWith("sub_test456");

    // Should update the families table
    expect(mockFrom).toHaveBeenCalledWith("families");
    expect(mockUpdate).toHaveBeenCalledWith({
      stripe_customer_id: "cus_test123",
      subscription_tier: "supporter",
      stripe_subscription_id: "sub_test456",
      stripe_subscription_status: "active",
      stripe_price_id: "price_monthly_10",
      stripe_current_period_end: new Date(1700000000 * 1000).toISOString(),
    });
    expect(mockEq).toHaveBeenCalledWith("id", "family-uuid-123");
  });

  it("handles checkout.session.completed — customer as object with id", async () => {
    const event = makeCheckoutSessionEvent({
      customer: { id: "cus_obj_id" },
      subscription: { id: "sub_obj_id" },
    });
    mockConstructEvent.mockReturnValue(event);
    mockSubscriptionsRetrieve.mockResolvedValue({
      status: "active",
      items: {
        data: [
          {
            price: { id: "price_xyz" },
            current_period_end: 1800000000,
          },
        ],
      },
    });

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockSubscriptionsRetrieve).toHaveBeenCalledWith("sub_obj_id");
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        stripe_customer_id: "cus_obj_id",
        stripe_subscription_id: "sub_obj_id",
      }),
    );
  });

  it("handles checkout.session.completed — skips when family_id is missing", async () => {
    const event = makeCheckoutSessionEvent({
      metadata: {},
      customer: "cus_test123",
    });
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    // Should NOT update families since family_id is missing
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("handles checkout.session.completed — skips when customer is missing", async () => {
    const event = makeCheckoutSessionEvent({
      customer: null,
      metadata: { family_id: "fam-123" },
    });
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("handles checkout.session.completed — skips DB update when no subscription", async () => {
    const event = makeCheckoutSessionEvent({
      subscription: null,
    });
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    // No subscription means the if (subscriptionId) block is skipped
    expect(mockSubscriptionsRetrieve).not.toHaveBeenCalled();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // customer.subscription.updated — syncs subscription status
  // -------------------------------------------------------------------------
  it("handles customer.subscription.updated — active status sets supporter tier", async () => {
    const event = makeSubscriptionUpdatedEvent("active");
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);

    expect(mockFrom).toHaveBeenCalledWith("families");
    expect(mockUpdate).toHaveBeenCalledWith({
      subscription_tier: "supporter",
      stripe_subscription_status: "active",
      stripe_price_id: "price_abc",
      stripe_current_period_end: new Date(1700000000 * 1000).toISOString(),
    });
    expect(mockEq).toHaveBeenCalledWith("stripe_customer_id", "cus_test123");
  });

  it("handles customer.subscription.updated — trialing status sets supporter tier", async () => {
    const event = makeSubscriptionUpdatedEvent("trialing");
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        subscription_tier: "supporter",
        stripe_subscription_status: "trialing",
      }),
    );
  });

  it("handles customer.subscription.updated — past_due status sets free tier", async () => {
    const event = makeSubscriptionUpdatedEvent("past_due");
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        subscription_tier: "free",
        stripe_subscription_status: "past_due",
      }),
    );
  });

  it("handles customer.subscription.updated — canceled status sets free tier", async () => {
    const event = makeSubscriptionUpdatedEvent("canceled");
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        subscription_tier: "free",
        stripe_subscription_status: "canceled",
      }),
    );
  });

  it("handles customer.subscription.updated — customer as object with id", async () => {
    const event = makeSubscriptionUpdatedEvent("active", {
      customer: { id: "cus_object_123" },
    });
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockEq).toHaveBeenCalledWith(
      "stripe_customer_id",
      "cus_object_123",
    );
  });

  it("handles customer.subscription.updated — skips when customer is missing", async () => {
    const event = makeSubscriptionUpdatedEvent("active", {
      customer: null,
    });
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    // No DB update when customerId is falsy
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("handles customer.subscription.updated — null price and period_end", async () => {
    const event = {
      type: "customer.subscription.updated",
      data: {
        object: {
          customer: "cus_test",
          status: "active",
          items: {
            data: [
              {
                price: null,
                current_period_end: null,
              },
            ],
          },
        },
      },
    };
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        stripe_price_id: null,
        stripe_current_period_end: null,
      }),
    );
  });

  // -------------------------------------------------------------------------
  // customer.subscription.deleted — resets to free tier
  // -------------------------------------------------------------------------
  it("handles customer.subscription.deleted — resets family to free tier", async () => {
    const event = makeSubscriptionDeletedEvent();
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);

    expect(mockFrom).toHaveBeenCalledWith("families");
    expect(mockUpdate).toHaveBeenCalledWith({
      subscription_tier: "free",
      stripe_subscription_id: null,
      stripe_subscription_status: "canceled",
      stripe_price_id: null,
      stripe_current_period_end: null,
    });
    expect(mockEq).toHaveBeenCalledWith("stripe_customer_id", "cus_test123");
  });

  it("handles customer.subscription.deleted — customer as object with id", async () => {
    const event = makeSubscriptionDeletedEvent({
      customer: { id: "cus_del_obj" },
    });
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockEq).toHaveBeenCalledWith("stripe_customer_id", "cus_del_obj");
  });

  it("handles customer.subscription.deleted — skips when customer is missing", async () => {
    const event = makeSubscriptionDeletedEvent({ customer: null });
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Unhandled event types — returns 200 (no-op)
  // -------------------------------------------------------------------------
  it("returns 200 for unhandled event types", async () => {
    const event = {
      type: "payment_intent.created",
      data: { object: { id: "pi_123" } },
    };
    mockConstructEvent.mockReturnValue(event);

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Internal error during event handling
  // -------------------------------------------------------------------------
  it("returns 500 when event handling throws an error", async () => {
    const event = makeSubscriptionDeletedEvent();
    mockConstructEvent.mockReturnValue(event);

    // Make the update chain throw
    mockUpdate.mockImplementation(() => {
      throw new Error("Database timeout");
    });

    const res = await POST(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal error processing webhook");
  });

  // -------------------------------------------------------------------------
  // Stripe constructEvent receives correct arguments
  // -------------------------------------------------------------------------
  it("passes correct arguments to stripe.webhooks.constructEvent", async () => {
    const event = { type: "ping", data: { object: {} } };
    mockConstructEvent.mockReturnValue(event);

    const body = { test: "data" };
    const req = makeRequest(body, "sig_custom_test");

    await POST(req);

    expect(mockConstructEvent).toHaveBeenCalledWith(
      JSON.stringify(body),
      "sig_custom_test",
      "whsec_stripe_test",
    );
  });
});
