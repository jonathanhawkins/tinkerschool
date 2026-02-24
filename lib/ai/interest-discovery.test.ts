import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  detectInterests,
  discoverInterests,
  INTEREST_CATEGORIES,
} from "./interest-discovery";

// ---------------------------------------------------------------------------
// detectInterests (pure function)
// ---------------------------------------------------------------------------

describe("detectInterests", () => {
  it("detects dinosaur interest", () => {
    expect(detectInterests("I love dinosaurs!")).toContain("dinosaurs");
  });

  it("detects T-Rex variant", () => {
    expect(detectInterests("T-Rex is my favorite")).toContain("dinosaurs");
  });

  it("detects space interest", () => {
    expect(detectInterests("I want to go to Mars")).toContain("space");
  });

  it("detects multiple interests in one message", () => {
    const result = detectInterests("I love rockets and dinosaurs and painting");
    expect(result).toContain("space");
    expect(result).toContain("dinosaurs");
    expect(result).toContain("art & drawing");
  });

  it("returns empty array for message with no interests", () => {
    expect(detectInterests("What is 2 + 3?")).toEqual([]);
  });

  it("is case-insensitive", () => {
    expect(detectInterests("MINECRAFT is awesome")).toContain("video games");
  });

  it("detects sports", () => {
    expect(detectInterests("I play soccer after school")).toContain("sports");
  });

  it("detects cooking", () => {
    expect(detectInterests("I helped bake cookies")).toContain("cooking & food");
  });

  it("detects superheroes", () => {
    expect(detectInterests("Spider-Man is cool")).toContain("superheroes");
  });

  it("detects nature", () => {
    expect(detectInterests("I saw a butterfly in the garden")).toContain("nature");
  });

  it("detects robots & technology", () => {
    expect(detectInterests("I want to build a robot")).toContain("robots & technology");
  });

  it("detects fairy tales & fantasy", () => {
    expect(detectInterests("I love unicorns and dragons")).toContain("fairy tales & fantasy");
  });

  it("uses word boundaries (no false positives)", () => {
    // "cart" should not trigger "art & drawing"
    expect(detectInterests("Put it in the cart")).not.toContain("art & drawing");
  });

  it("has exactly 15 interest categories", () => {
    expect(INTEREST_CATEGORIES).toHaveLength(15);
  });
});

// ---------------------------------------------------------------------------
// discoverInterests (Supabase interactions)
// ---------------------------------------------------------------------------

function createMockSupabase(existingInterests: string[] | null) {
  const updateEqFn = vi.fn().mockResolvedValue({ error: null });
  const updateFn = vi.fn().mockReturnValue({ eq: updateEqFn });

  const fromFn = vi.fn().mockImplementation((table: string) => {
    if (table === "learning_profiles") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: existingInterests !== null
                ? { id: "lp-1", interests: existingInterests }
                : null,
            }),
          }),
        }),
        update: updateFn,
      };
    }
    return {};
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { client: { from: fromFn } as any, updateFn, updateEqFn };
}

describe("discoverInterests", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("appends new interest to existing list", async () => {
    const { client, updateFn } = createMockSupabase(["space"]);

    await discoverInterests(client, "profile-1", "I love dinosaurs");

    expect(updateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        interests: expect.arrayContaining(["space", "dinosaurs"]),
      }),
    );
  });

  it("does not duplicate existing interests", async () => {
    const { client, updateFn } = createMockSupabase(["dinosaurs"]);

    await discoverInterests(client, "profile-1", "I love dinosaurs");

    expect(updateFn).not.toHaveBeenCalled();
  });

  it("does nothing when no interests detected", async () => {
    const { client, updateFn } = createMockSupabase(["space"]);

    await discoverInterests(client, "profile-1", "What is 2 plus 3?");

    expect(updateFn).not.toHaveBeenCalled();
  });

  it("does nothing when learning profile not found", async () => {
    const { client, updateFn } = createMockSupabase(null);

    await discoverInterests(client, "profile-1", "I love dinosaurs");

    expect(updateFn).not.toHaveBeenCalled();
  });

  it("caps interests at 20", async () => {
    // Start with 19 existing interests
    const existing = Array.from({ length: 19 }, (_, i) => `interest-${i}`);
    const { client, updateFn } = createMockSupabase(existing);

    // Detect 3 new interests
    await discoverInterests(
      client,
      "profile-1",
      "I love dinosaurs and rockets and painting",
    );

    // Should be capped at 20
    const updatedInterests = updateFn.mock.calls[0][0].interests;
    expect(updatedInterests.length).toBeLessThanOrEqual(20);
  });
});
