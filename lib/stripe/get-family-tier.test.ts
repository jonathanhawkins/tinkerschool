import { describe, it, expect, vi, beforeEach } from "vitest";

import { getFamilyTier } from "./get-family-tier";

/**
 * getFamilyTier takes a SupabaseClient and familyId, queries the families
 * table for subscription_tier, and returns "supporter" or "free".
 *
 * We mock the Supabase client chain: supabase.from().select().eq().single()
 */

function createMockSupabase(resolvedData: unknown) {
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: resolvedData }),
        }),
      }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe("getFamilyTier", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns "supporter" when family has subscription_tier = "supporter"', async () => {
    const supabase = createMockSupabase({ subscription_tier: "supporter" });

    const tier = await getFamilyTier(supabase, "family-123");

    expect(tier).toBe("supporter");
    expect(supabase.from).toHaveBeenCalledWith("families");
  });

  it('returns "free" when family has subscription_tier = "free"', async () => {
    const supabase = createMockSupabase({ subscription_tier: "free" });

    const tier = await getFamilyTier(supabase, "family-456");

    expect(tier).toBe("free");
  });

  it('returns "free" when family has subscription_tier = null', async () => {
    const supabase = createMockSupabase({ subscription_tier: null });

    const tier = await getFamilyTier(supabase, "family-789");

    expect(tier).toBe("free");
  });

  it('returns "free" when family lookup returns null data', async () => {
    const supabase = createMockSupabase(null);

    const tier = await getFamilyTier(supabase, "nonexistent-family");

    expect(tier).toBe("free");
  });

  it('returns "free" for unrecognized subscription_tier values', async () => {
    const supabase = createMockSupabase({ subscription_tier: "premium" });

    const tier = await getFamilyTier(supabase, "family-unknown-tier");

    expect(tier).toBe("free");
  });

  it('returns "free" when subscription_tier is undefined', async () => {
    const supabase = createMockSupabase({});

    const tier = await getFamilyTier(supabase, "family-no-tier");

    expect(tier).toBe("free");
  });

  it("passes the correct familyId to the query chain", async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = {
      from: vi.fn().mockReturnValue({ select: mockSelect }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    await getFamilyTier(supabase, "my-family-id");

    expect(supabase.from).toHaveBeenCalledWith("families");
    expect(mockSelect).toHaveBeenCalledWith("subscription_tier");
    expect(mockEq).toHaveBeenCalledWith("id", "my-family-id");
    expect(mockSingle).toHaveBeenCalled();
  });
});
