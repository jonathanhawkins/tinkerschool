import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock "server-only" to prevent it from throwing in the test environment.
vi.mock("server-only", () => ({}));

// Mock the "hume" module so we can control fetchAccessToken behavior.
vi.mock("hume", () => ({
  fetchAccessToken: vi.fn(),
}));

import { fetchAccessToken } from "hume";
import { getHumeAccessToken } from "./access-token";

const mockFetchAccessToken = vi.mocked(fetchAccessToken);

describe("getHumeAccessToken", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.HUME_API_KEY = "test-api-key";
    process.env.HUME_SECRET_KEY = "test-secret-key";
  });

  it("returns null when HUME_API_KEY is missing", async () => {
    delete process.env.HUME_API_KEY;

    const result = await getHumeAccessToken();

    expect(result).toBeNull();
    expect(mockFetchAccessToken).not.toHaveBeenCalled();
  });

  it("returns null when HUME_SECRET_KEY is missing", async () => {
    delete process.env.HUME_SECRET_KEY;

    const result = await getHumeAccessToken();

    expect(result).toBeNull();
    expect(mockFetchAccessToken).not.toHaveBeenCalled();
  });

  it("returns null when both keys are missing", async () => {
    delete process.env.HUME_API_KEY;
    delete process.env.HUME_SECRET_KEY;

    const result = await getHumeAccessToken();

    expect(result).toBeNull();
    expect(mockFetchAccessToken).not.toHaveBeenCalled();
  });

  it("returns the access token when fetchAccessToken succeeds", async () => {
    mockFetchAccessToken.mockResolvedValue("hume-access-token-abc123");

    const result = await getHumeAccessToken();

    expect(result).toBe("hume-access-token-abc123");
  });

  it("returns null when fetchAccessToken returns empty string", async () => {
    mockFetchAccessToken.mockResolvedValue("");

    const result = await getHumeAccessToken();

    expect(result).toBeNull();
  });

  it('returns null when fetchAccessToken returns the string "undefined"', async () => {
    mockFetchAccessToken.mockResolvedValue("undefined");

    const result = await getHumeAccessToken();

    expect(result).toBeNull();
  });

  it("returns null when fetchAccessToken throws an error", async () => {
    mockFetchAccessToken.mockRejectedValue(new Error("network error"));

    const result = await getHumeAccessToken();

    expect(result).toBeNull();
  });

  it("passes apiKey and secretKey to fetchAccessToken correctly", async () => {
    process.env.HUME_API_KEY = "my-api-key";
    process.env.HUME_SECRET_KEY = "my-secret-key";
    mockFetchAccessToken.mockResolvedValue("token");

    await getHumeAccessToken();

    expect(mockFetchAccessToken).toHaveBeenCalledWith({
      apiKey: "my-api-key",
      secretKey: "my-secret-key",
    });
  });
});
