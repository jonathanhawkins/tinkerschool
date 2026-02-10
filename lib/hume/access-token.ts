/**
 * Server-only utility for fetching short-lived Hume access tokens.
 *
 * Uses the Hume OAuth2 client-credentials flow. The returned token is
 * passed to the client-side VoiceProvider so that secret keys never
 * leave the server.
 */
import "server-only";

import { fetchAccessToken } from "hume";

/**
 * Fetches a short-lived Hume access token.
 * Returns `null` if the required env vars are not configured.
 */
export async function getHumeAccessToken(): Promise<string | null> {
  const apiKey = process.env.HUME_API_KEY;
  const secretKey = process.env.HUME_SECRET_KEY;

  if (!apiKey || !secretKey) {
    return null;
  }

  try {
    const accessToken = await fetchAccessToken({
      apiKey,
      secretKey,
    });

    if (!accessToken || accessToken === "undefined") {
      return null;
    }

    return accessToken;
  } catch {
    // Hume API might be down, rate-limited, or keys invalid.
    // Return null so the FAB gracefully hides instead of crashing the layout.
    return null;
  }
}
