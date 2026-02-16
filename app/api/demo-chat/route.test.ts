import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the AI SDK dependencies
vi.mock("@ai-sdk/openai", () => ({
  openai: vi.fn(() => "mock-model"),
}));

vi.mock("ai", () => ({
  convertToModelMessages: vi.fn().mockResolvedValue([]),
  streamText: vi.fn(() => ({
    toUIMessageStreamResponse: vi.fn(() => new Response("streamed")),
  })),
}));

import { POST } from "./route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(
  body: unknown,
  ip = "192.168.1.1",
): Request {
  const headers = new Headers();
  headers.set("x-forwarded-for", ip);

  return new Request("http://localhost:3000/api/demo-chat", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

// ---------------------------------------------------------------------------
// POST /api/demo-chat
// ---------------------------------------------------------------------------

describe("POST /api/demo-chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://localhost:3000/api/demo-chat", {
      method: "POST",
      headers: new Headers({ "x-forwarded-for": "10.0.0.1" }),
      body: "not json",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe("Invalid JSON");
  });

  it("returns 400 when messages is not an array", async () => {
    const request = makeRequest({ messages: "not-an-array" }, "10.0.0.2");

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("returns 400 when messages exceed limit (10)", async () => {
    const messages = Array.from({ length: 11 }, (_, i) => ({
      id: `msg-${i}`,
      role: "user",
      content: "Hello",
    }));

    const request = makeRequest({ messages }, "10.0.0.3");

    const response = await POST(request);

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain("Too many messages");
  });

  it("streams response for valid request", async () => {
    const request = makeRequest(
      {
        messages: [
          { id: "1", role: "user", content: "Hello Chip!" },
        ],
      },
      "10.0.0.4",
    );

    const response = await POST(request);

    expect(response.status).toBe(200);
  });

  it("returns 429 after rate limit is exceeded", async () => {
    const testIp = "10.0.0.5";

    // Send 21 requests from the same IP (limit is 20)
    for (let i = 0; i < 20; i++) {
      await POST(
        makeRequest({ messages: [{ id: `${i}`, role: "user", content: "Hi" }] }, testIp),
      );
    }

    // 21st request should be rate limited
    const response = await POST(
      makeRequest({ messages: [{ id: "21", role: "user", content: "Hi" }] }, testIp),
    );

    expect(response.status).toBe(429);
    const json = await response.json();
    expect(json.error).toContain("break");
  });

  it("accepts exactly 10 messages", async () => {
    const messages = Array.from({ length: 10 }, (_, i) => ({
      id: `msg-${i}`,
      role: "user",
      content: "Hello",
    }));

    const request = makeRequest({ messages }, "10.0.0.6");

    const response = await POST(request);

    expect(response.status).toBe(200);
  });

  it("handles missing x-forwarded-for header", async () => {
    const request = new Request("http://localhost:3000/api/demo-chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ id: "1", role: "user", content: "Hi" }],
      }),
    });

    const response = await POST(request);

    // Should still work, IP defaults to "unknown"
    expect(response.status).toBe(200);
  });
});
