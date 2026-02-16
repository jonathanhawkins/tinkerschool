import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { getPriceId, getBillingInterval } from "./config";

// ---------------------------------------------------------------------------
// getPriceId
// ---------------------------------------------------------------------------

describe("getPriceId", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns monthly price ID from env", () => {
    process.env.STRIPE_PRICE_SUPPORTER_MONTHLY = "price_monthly_123";

    expect(getPriceId("monthly")).toBe("price_monthly_123");
  });

  it("returns yearly price ID from env", () => {
    process.env.STRIPE_PRICE_SUPPORTER_YEARLY = "price_yearly_456";

    expect(getPriceId("yearly")).toBe("price_yearly_456");
  });

  it("throws when monthly price ID is missing", () => {
    delete process.env.STRIPE_PRICE_SUPPORTER_MONTHLY;

    expect(() => getPriceId("monthly")).toThrow(
      "Missing environment variable: STRIPE_PRICE_SUPPORTER_MONTHLY",
    );
  });

  it("throws when yearly price ID is missing", () => {
    delete process.env.STRIPE_PRICE_SUPPORTER_YEARLY;

    expect(() => getPriceId("yearly")).toThrow(
      "Missing environment variable: STRIPE_PRICE_SUPPORTER_YEARLY",
    );
  });
});

// ---------------------------------------------------------------------------
// getBillingInterval
// ---------------------------------------------------------------------------

describe("getBillingInterval", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.STRIPE_PRICE_SUPPORTER_MONTHLY = "price_monthly_abc";
    process.env.STRIPE_PRICE_SUPPORTER_YEARLY = "price_yearly_xyz";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns 'monthly' for the monthly price ID", () => {
    expect(getBillingInterval("price_monthly_abc")).toBe("monthly");
  });

  it("returns 'yearly' for the yearly price ID", () => {
    expect(getBillingInterval("price_yearly_xyz")).toBe("yearly");
  });

  it("returns undefined for an unknown price ID", () => {
    expect(getBillingInterval("price_unknown")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getBillingInterval("")).toBeUndefined();
  });
});
