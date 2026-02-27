import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Hoisted mocks — vi.hoisted() values are available inside vi.mock() factories
// ---------------------------------------------------------------------------

const { mockStreamText, mockConvertToModelMessages, mockAnthropicProvider } =
  vi.hoisted(() => ({
    mockStreamText: vi.fn(),
    mockConvertToModelMessages: vi.fn().mockResolvedValue([]),
    mockAnthropicProvider: vi.fn().mockReturnValue("mock-anthropic-model"),
  }));

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

// Clerk auth
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

// Rate limiter
vi.mock("@/lib/rate-limit", () => ({
  checkAiBuddyRateLimit: vi.fn(),
}));

// Supabase admin client
vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabaseClient: vi.fn(),
}));

// System prompt builder
vi.mock("@/lib/ai/chip-system-prompt", () => ({
  getChipSystemPrompt: vi.fn().mockReturnValue("mock-system-prompt"),
}));

// Badge evaluator
vi.mock("@/lib/badges/evaluate-badges", () => ({
  evaluateBadges: vi.fn(),
}));

// AI SDK
vi.mock("ai", () => ({
  streamText: mockStreamText,
  convertToModelMessages: mockConvertToModelMessages,
}));

// Anthropic SDK provider
vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: mockAnthropicProvider,
}));

// ---------------------------------------------------------------------------
// Import mocked modules
// ---------------------------------------------------------------------------

import { auth } from "@clerk/nextjs/server";
import { checkAiBuddyRateLimit } from "@/lib/rate-limit";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getChipSystemPrompt } from "@/lib/ai/chip-system-prompt";

import { POST } from "./route";

// ---------------------------------------------------------------------------
// Typed mocks
// ---------------------------------------------------------------------------

const mockAuth = vi.mocked(auth);
const mockCheckRateLimit = vi.mocked(checkAiBuddyRateLimit);
const mockCreateAdminClient = vi.mocked(createAdminSupabaseClient);
const mockGetChipSystemPrompt = vi.mocked(getChipSystemPrompt);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Creates a minimal valid request body. */
function validBody(overrides: Record<string, unknown> = {}) {
  return {
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "How do I add numbers?",
        parts: [{ type: "text", text: "How do I add numbers?" }],
      },
    ],
    kidName: "Cassidy",
    age: 7,
    band: 2,
    ...overrides,
  };
}

/** Builds a Request with JSON body. */
function makeRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/ai-buddy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Builds a Request with invalid (non-JSON) body. */
function makeInvalidJsonRequest(): Request {
  return new Request("http://localhost:3000/api/ai-buddy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not-json!!!",
  });
}

/** Creates a mock supabase client that returns null for everything. */
function createEmptyMockSupabase() {
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
          neq: vi.fn().mockResolvedValue({ data: [], error: null }),
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      }),
    }),
  };
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.resetAllMocks();

  // Default: authenticated user
  mockAuth.mockResolvedValue({ userId: "user_123" } as never);

  // Default: not rate limited
  mockCheckRateLimit.mockResolvedValue({ limited: false, remaining: 29 });

  // Default: supabase client returns no profile
  const mockSupabase = createEmptyMockSupabase();
  mockCreateAdminClient.mockReturnValue(mockSupabase as never);

  // Default: system prompt builder
  mockGetChipSystemPrompt.mockReturnValue("mock-system-prompt");

  // Default: anthropic provider
  mockAnthropicProvider.mockReturnValue("mock-anthropic-model");

  // Default: AI SDK streamText returns a mock with toUIMessageStreamResponse
  mockStreamText.mockReturnValue({
    toUIMessageStreamResponse: () =>
      new Response("streamed-response", { status: 200 }),
  });

  // Default: convertToModelMessages returns empty array
  mockConvertToModelMessages.mockResolvedValue([]);
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/ai-buddy", () => {
  // -----------------------------------------------------------------------
  // Authentication
  // -----------------------------------------------------------------------

  describe("authentication", () => {
    it("returns 401 when not authenticated", async () => {
      mockAuth.mockResolvedValue({ userId: null } as never);

      const res = await POST(makeRequest(validBody()));

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe("Unauthorized");
    });

    it("returns 401 when userId is undefined", async () => {
      mockAuth.mockResolvedValue({} as never);

      const res = await POST(makeRequest(validBody()));

      expect(res.status).toBe(401);
    });
  });

  // -----------------------------------------------------------------------
  // Rate limiting
  // -----------------------------------------------------------------------

  describe("rate limiting", () => {
    it("returns 429 when rate limited", async () => {
      mockCheckRateLimit.mockResolvedValue({ limited: true, remaining: 0 });

      const res = await POST(makeRequest(validBody()));

      expect(res.status).toBe(429);
      const json = await res.json();
      expect(json.error).toContain("Chip needs a little rest");
      expect(res.headers.get("X-RateLimit-Remaining")).toBe("0");
    });

    it("includes remaining count in rate limit response header", async () => {
      mockCheckRateLimit.mockResolvedValue({ limited: true, remaining: 5 });

      const res = await POST(makeRequest(validBody()));

      expect(res.status).toBe(429);
      expect(res.headers.get("X-RateLimit-Remaining")).toBe("5");
    });
  });

  // -----------------------------------------------------------------------
  // Request body parsing
  // -----------------------------------------------------------------------

  describe("request body parsing", () => {
    it("returns 400 for invalid JSON body", async () => {
      const res = await POST(makeInvalidJsonRequest());

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Invalid JSON body");
    });

    it("returns 400 when messages is missing", async () => {
      const body = validBody();
      delete (body as Record<string, unknown>).messages;
      const res = await POST(makeRequest(body));

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Invalid request body");
    });

    it("returns 400 when messages exceeds MAX_MESSAGES (50)", async () => {
      const tooManyMessages = Array.from({ length: 51 }, (_, i) => ({
        id: `msg-${i}`,
        role: "user",
        content: `message ${i}`,
        parts: [{ type: "text", text: `message ${i}` }],
      }));
      const res = await POST(
        makeRequest(validBody({ messages: tooManyMessages }))
      );

      expect(res.status).toBe(400);
    });

    it("returns 400 when kidName is empty string", async () => {
      const res = await POST(makeRequest(validBody({ kidName: "" })));
      expect(res.status).toBe(400);
    });

    it("returns 400 when kidName is missing", async () => {
      const body = validBody();
      delete (body as Record<string, unknown>).kidName;
      const res = await POST(makeRequest(body));
      expect(res.status).toBe(400);
    });

    it("returns 400 when age is out of range (< 3)", async () => {
      const res = await POST(makeRequest(validBody({ age: 2 })));
      expect(res.status).toBe(400);
    });

    it("returns 400 when age is out of range (> 14)", async () => {
      const res = await POST(makeRequest(validBody({ age: 15 })));
      expect(res.status).toBe(400);
    });

    it("accepts band 0 (Pre-K)", async () => {
      const res = await POST(makeRequest(validBody({ band: 0 })));
      expect(res.status).not.toBe(400);
    });

    it("returns 400 when band is out of range (-1)", async () => {
      const res = await POST(makeRequest(validBody({ band: -1 })));
      expect(res.status).toBe(400);
    });

    it("returns 400 when band is out of range (7)", async () => {
      const res = await POST(makeRequest(validBody({ band: 7 })));
      expect(res.status).toBe(400);
    });
  });

  // -----------------------------------------------------------------------
  // Subject validation
  // -----------------------------------------------------------------------

  describe("subject validation", () => {
    it("accepts valid subject slugs", async () => {
      const res = await POST(
        makeRequest(validBody({ currentSubject: "math" }))
      );

      expect(res.status).toBe(200);
    });

    it("rejects invalid subject by treating it as undefined (no 400)", async () => {
      const res = await POST(
        makeRequest(validBody({ currentSubject: "hacking" }))
      );

      // Should still proceed (invalid subject becomes undefined)
      expect(res.status).toBe(200);
      // Verify the system prompt was called without the invalid subject
      expect(mockGetChipSystemPrompt).toHaveBeenCalledWith(
        expect.objectContaining({ currentSubject: undefined })
      );
    });
  });

  // -----------------------------------------------------------------------
  // Input truncation
  // -----------------------------------------------------------------------

  describe("input truncation", () => {
    it("truncates currentLesson to MAX_LESSON_LENGTH (200)", async () => {
      const longLesson = "a".repeat(500);
      const res = await POST(
        makeRequest(validBody({ currentLesson: longLesson }))
      );

      expect(res.status).toBe(200);
      expect(mockGetChipSystemPrompt).toHaveBeenCalledWith(
        expect.objectContaining({
          currentLesson: "a".repeat(200),
        })
      );
    });

    it("truncates currentCode to MAX_CODE_LENGTH (10000)", async () => {
      const longCode = "x".repeat(15_000);
      const res = await POST(
        makeRequest(validBody({ currentCode: longCode }))
      );

      expect(res.status).toBe(200);
      expect(mockGetChipSystemPrompt).toHaveBeenCalledWith(
        expect.objectContaining({
          currentCode: "x".repeat(10_000),
        })
      );
    });

    it("passes through short lesson/code unchanged", async () => {
      const res = await POST(
        makeRequest(
          validBody({
            currentLesson: "Adding 2-digit numbers",
            currentCode: "print(1+1)",
          })
        )
      );

      expect(res.status).toBe(200);
      expect(mockGetChipSystemPrompt).toHaveBeenCalledWith(
        expect.objectContaining({
          currentLesson: "Adding 2-digit numbers",
          currentCode: "print(1+1)",
        })
      );
    });
  });

  // -----------------------------------------------------------------------
  // chatSessionId validation
  // -----------------------------------------------------------------------

  describe("chatSessionId validation", () => {
    it("accepts a valid UUID chatSessionId", async () => {
      const res = await POST(
        makeRequest(
          validBody({
            chatSessionId: "00000000-0000-4000-8000-000000000001",
          })
        )
      );

      expect(res.status).toBe(200);
    });

    it("discards an invalid chatSessionId (non-UUID)", async () => {
      const res = await POST(
        makeRequest(validBody({ chatSessionId: "not-a-uuid" }))
      );

      // Should still succeed — invalid session ID is silently dropped
      expect(res.status).toBe(200);
    });
  });

  // -----------------------------------------------------------------------
  // AI SDK integration
  // -----------------------------------------------------------------------

  describe("AI SDK call", () => {
    it("calls streamText with the correct parameters", async () => {
      const res = await POST(makeRequest(validBody()));

      expect(res.status).toBe(200);
      expect(mockStreamText).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "mock-anthropic-model",
          system: "mock-system-prompt",
          maxOutputTokens: 300,
          temperature: 0.7,
        })
      );
    });

    it("calls convertToModelMessages with the request messages", async () => {
      const body = validBody();
      const res = await POST(makeRequest(body));

      expect(res.status).toBe(200);
      expect(mockConvertToModelMessages).toHaveBeenCalledWith(body.messages);
    });

    it("returns a streaming response", async () => {
      const res = await POST(makeRequest(validBody()));

      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe("streamed-response");
    });
  });

  // -----------------------------------------------------------------------
  // System prompt construction
  // -----------------------------------------------------------------------

  describe("system prompt construction", () => {
    it("calls getChipSystemPrompt with verified defaults when no profile found", async () => {
      const res = await POST(makeRequest(validBody()));

      expect(res.status).toBe(200);
      expect(mockGetChipSystemPrompt).toHaveBeenCalledWith(
        expect.objectContaining({
          childName: "Friend", // default when no profile
          age: 7, // default
          gradeLevel: 1, // default grade level
        })
      );
    });

    it("uses server-verified profile data for the system prompt", async () => {
      // Set up Supabase to return a profile with personalization.
      // Note: some queries chain multiple .eq() calls (e.g. progress),
      // so the eq mock must also return itself for chaining.
      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === "profiles") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "profile-1",
                    display_name: "Cassidy",
                    grade_level: 1,
                    current_band: 2,
                    family_id: "family-1",
                  },
                }),
              }),
            }),
          };
        }
        if (table === "families") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { subscription_tier: "free" },
                }),
              }),
            }),
          };
        }
        // learning_profiles, skill_proficiencies, progress
        // Build a chainable eq mock that supports .eq().eq().order().limit()
        const chainableEq: Record<string, unknown> = {
          single: vi.fn().mockResolvedValue({ data: null }),
          neq: vi.fn().mockResolvedValue({ data: [], error: null }),
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        };
        // Support chaining: .eq().eq()
        chainableEq.eq = vi.fn().mockReturnValue(chainableEq);

        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue(chainableEq),
          }),
        };
      });

      mockCreateAdminClient.mockReturnValue({ from: mockFrom } as never);

      const res = await POST(makeRequest(validBody()));

      expect(res.status).toBe(200);
      expect(mockGetChipSystemPrompt).toHaveBeenCalledWith(
        expect.objectContaining({
          childName: "Cassidy",
          age: 6, // grade_level(1) + 5
          gradeLevel: 1, // actual grade_level from profile
        })
      );
    });
  });

  // -----------------------------------------------------------------------
  // Edge: 50 messages (at the limit)
  // -----------------------------------------------------------------------

  describe("message limit boundary", () => {
    it("accepts exactly 50 messages", async () => {
      const fiftyMessages = Array.from({ length: 50 }, (_, i) => ({
        id: `msg-${i}`,
        role: i % 2 === 0 ? "user" : "assistant",
        content: `message ${i}`,
        parts: [{ type: "text", text: `message ${i}` }],
      }));

      const res = await POST(
        makeRequest(validBody({ messages: fiftyMessages }))
      );

      expect(res.status).toBe(200);
    });
  });
});
