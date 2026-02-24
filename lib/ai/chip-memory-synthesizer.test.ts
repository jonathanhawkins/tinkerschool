import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AI SDK modules so the import doesn't fail in the test environment
vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn(),
}));
vi.mock("ai", () => ({
  generateText: vi.fn(),
}));

import { shouldSynthesize, buildSynthesisContext } from "./chip-memory-synthesizer";

// ---------------------------------------------------------------------------
// shouldSynthesize
// ---------------------------------------------------------------------------

function createCountMock(count: number | null) {
  const fromFn = vi.fn().mockImplementation((table: string) => {
    if (table === "progress") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count }),
          }),
        }),
      };
    }
    return {};
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { client: { from: fromFn } as any };
}

describe("shouldSynthesize", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns false when count is 0", async () => {
    const { client } = createCountMock(0);
    expect(await shouldSynthesize(client, "p1")).toBe(false);
  });

  it("returns false when count is null", async () => {
    const { client } = createCountMock(null);
    expect(await shouldSynthesize(client, "p1")).toBe(false);
  });

  it("returns true when count is 3", async () => {
    const { client } = createCountMock(3);
    expect(await shouldSynthesize(client, "p1")).toBe(true);
  });

  it("returns true when count is 6", async () => {
    const { client } = createCountMock(6);
    expect(await shouldSynthesize(client, "p1")).toBe(true);
  });

  it("returns false when count is 4", async () => {
    const { client } = createCountMock(4);
    expect(await shouldSynthesize(client, "p1")).toBe(false);
  });

  it("returns true when count is 9", async () => {
    const { client } = createCountMock(9);
    expect(await shouldSynthesize(client, "p1")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// buildSynthesisContext
// ---------------------------------------------------------------------------

function createContextMock({
  learningProfile = { id: "lp-1", chip_notes: null, interests: [] } as {
    id: string;
    chip_notes: string | null;
    interests: string[];
  } | null,
  chats = [] as { messages: { role: string; content: string }[] }[],
  sessions = [] as {
    score: number;
    hints_used: number;
    correct_first_try: number;
    total_questions: number;
    time_seconds: number;
    lessons: { title: string; subjects: { display_name: string } | null } | null;
  }[],
}: {
  learningProfile?: {
    id: string;
    chip_notes: string | null;
    interests: string[];
  } | null;
  chats?: { messages: { role: string; content: string }[] }[];
  sessions?: {
    score: number;
    hints_used: number;
    correct_first_try: number;
    total_questions: number;
    time_seconds: number;
    lessons: { title: string; subjects: { display_name: string } | null } | null;
  }[];
} = {}) {
  const fromFn = vi.fn().mockImplementation((table: string) => {
    if (table === "learning_profiles") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: learningProfile, error: null }),
          }),
        }),
      };
    }
    if (table === "chat_sessions") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: chats, error: null }),
            }),
          }),
        }),
      };
    }
    if (table === "activity_sessions") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: sessions, error: null }),
            }),
          }),
        }),
      };
    }
    return {};
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { client: { from: fromFn } as any };
}

describe("buildSynthesisContext", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns null when learning profile does not exist", async () => {
    const { client } = createContextMock({ learningProfile: null });
    const result = await buildSynthesisContext(client, "p1");
    expect(result).toBeNull();
  });

  it("builds prompt with chat and activity data", async () => {
    const { client } = createContextMock({
      learningProfile: { id: "lp-1", chip_notes: "Loves colors", interests: ["dinosaurs"] },
      chats: [
        {
          messages: [
            { role: "user", content: "I like dinosaurs!" },
            { role: "assistant", content: "Cool!" },
          ],
        },
      ],
      sessions: [
        {
          score: 85,
          hints_used: 1,
          correct_first_try: 8,
          total_questions: 10,
          time_seconds: 120,
          lessons: { title: "Addition Fun", subjects: { display_name: "Math" } },
        },
      ],
    });

    const result = await buildSynthesisContext(client, "p1");
    expect(result).not.toBeNull();
    expect(result!.learningProfileId).toBe("lp-1");
    expect(result!.prompt).toContain("Loves colors");
    expect(result!.prompt).toContain("dinosaurs");
    expect(result!.prompt).toContain("I like dinosaurs!");
    expect(result!.prompt).toContain("Addition Fun");
    expect(result!.prompt).toContain("Math");
  });

  it("handles empty chat and activity data gracefully", async () => {
    const { client } = createContextMock({
      learningProfile: { id: "lp-1", chip_notes: null, interests: [] },
      chats: [],
      sessions: [],
    });

    const result = await buildSynthesisContext(client, "p1");
    expect(result).not.toBeNull();
    expect(result!.prompt).toContain("(no chat data)");
    expect(result!.prompt).toContain("(no activity data)");
    expect(result!.prompt).toContain("(no previous notes)");
  });
});
