"use server";

import { getHumeAccessToken } from "@/lib/hume/access-token";

/**
 * Server action to fetch a fresh Hume access token.
 *
 * Called from the client before each voice `connect()` so that expired
 * tokens are transparently replaced without a full page reload.
 */
export async function refreshHumeAccessToken(): Promise<string | null> {
  return getHumeAccessToken();
}
