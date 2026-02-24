import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AI SDK modules so the import doesn't fail in the test environment
const mockGenerateText = vi.fn();
vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn().mockReturnValue("mock-haiku-model"),
}));
vi.mock("ai", () => ({
  generateText: (...args: unknown[]) => mockGenerateText(...args),
}));

import { shouldSynthesize, buildSynthesisContext, synthesizeChipNotes } from "./chip-memory-synthesizer";

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

// ---------------------------------------------------------------------------
// synthesizeChipNotes (full pipeline)
// ---------------------------------------------------------------------------

/**
 * Creates a mock that handles all tables touched by synthesizeChipNotes:
 * - progress (count query for shouldSynthesize)
 * - learning_profiles (select for buildSynthesisContext + update for writing notes)
 * - chat_sessions (select for buildSynthesisContext)
 * - activity_sessions (select for buildSynthesisContext)
 */
function createPipelineMock({
  completedCount = 3,
  learningProfile = { id: "lp-1", chip_notes: null, interests: ["dinosaurs"] } as {
    id: string;
    chip_notes: string | null;
    interests: string[];
  } | null,
}: {
  completedCount?: number;
  learningProfile?: { id: string; chip_notes: string | null; interests: string[] } | null;
} = {}) {
  const updateEqFn = vi.fn().mockResolvedValue({ error: null });
  const updateFn = vi.fn().mockReturnValue({ eq: updateEqFn });

  const fromFn = vi.fn().mockImplementation((table: string) => {
    if (table === "progress") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: completedCount }),
          }),
        }),
      };
    }
    if (table === "learning_profiles") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: learningProfile, error: null }),
          }),
        }),
        update: updateFn,
      };
    }
    if (table === "chat_sessions") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: [{ messages: [{ role: "user", content: "I love robots!" }] }],
                error: null,
              }),
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
              limit: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }),
        }),
      };
    }
    return {};
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { client: { from: fromFn } as any, updateFn, updateEqFn };
}

describe("synthesizeChipNotes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("skips when shouldSynthesize returns false (non-multiple of 3)", async () => {
    const { client, updateFn } = createPipelineMock({ completedCount: 4 });

    await synthesizeChipNotes(client, "p1");

    expect(mockGenerateText).not.toHaveBeenCalled();
    expect(updateFn).not.toHaveBeenCalled();
  });

  it("skips when learning profile does not exist", async () => {
    const { client, updateFn } = createPipelineMock({
      completedCount: 3,
      learningProfile: null,
    });

    await synthesizeChipNotes(client, "p1");

    expect(mockGenerateText).not.toHaveBeenCalled();
    expect(updateFn).not.toHaveBeenCalled();
  });

  it("calls generateText and writes notes on successful synthesis", async () => {
    const { client, updateFn } = createPipelineMock({ completedCount: 6 });
    mockGenerateText.mockResolvedValue({ text: "This child loves robots and learns quickly." });

    await synthesizeChipNotes(client, "p1");

    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        maxOutputTokens: 300,
      }),
    );
    // Verify the prompt includes context from the learning profile
    const callArg = mockGenerateText.mock.calls[0][0];
    expect(callArg.prompt).toContain("dinosaurs");
    expect(updateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        chip_notes: "This child loves robots and learns quickly.",
      }),
    );
  });

  it("truncates notes to MAX_NOTES_LENGTH (500 chars)", async () => {
    const { client, updateFn } = createPipelineMock({ completedCount: 9 });
    const longText = "x".repeat(700);
    mockGenerateText.mockResolvedValue({ text: longText });

    await synthesizeChipNotes(client, "p1");

    expect(updateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        chip_notes: "x".repeat(500),
      }),
    );
  });

  it("skips update when generateText returns empty text", async () => {
    const { client, updateFn } = createPipelineMock({ completedCount: 3 });
    mockGenerateText.mockResolvedValue({ text: "" });

    await synthesizeChipNotes(client, "p1");

    expect(mockGenerateText).toHaveBeenCalled();
    expect(updateFn).not.toHaveBeenCalled();
  });
});
