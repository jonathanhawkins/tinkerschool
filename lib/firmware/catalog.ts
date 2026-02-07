/**
 * Fetches UIFlow2 firmware releases for M5StickC Plus 2 from GitHub.
 *
 * Uses the GitHub Releases API (no auth needed for public repos).
 * Results are cached in memory for 1 hour to avoid rate limits.
 */

import type { FirmwareCatalog, FirmwareRelease } from "./types";
import {
  ASSET_PATTERN,
  BUNDLED_FIRMWARE_PATH,
  GITHUB_REPO,
  RECOMMENDED_VERSION,
} from "./constants";

/** GitHub Releases API response shape (only fields we use). */
interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
    size: number;
  }>;
}

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

let cachedCatalog: FirmwareCatalog | null = null;
let cachedAt = 0;

/**
 * Fetch available UIFlow2 firmware versions from GitHub Releases.
 *
 * Returns cached results if available and less than 1 hour old.
 * Falls back to just the bundled version if GitHub is unreachable.
 */
export async function fetchFirmwareCatalog(): Promise<FirmwareCatalog> {
  // Return cache if fresh
  if (cachedCatalog && Date.now() - cachedAt < CACHE_TTL) {
    return cachedCatalog;
  }

  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=20`;
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!res.ok) {
      throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
    }

    const releases: GitHubRelease[] = await res.json();
    const firmwareReleases: FirmwareRelease[] = [];

    for (const release of releases) {
      // Find the stickcplus2 asset
      const asset = release.assets.find((a) => ASSET_PATTERN.test(a.name));
      if (!asset) continue;

      const version = release.tag_name.replace(/^v/, "");

      firmwareReleases.push({
        version,
        title: release.name || `UIFlow2 v${version}`,
        notes: release.body || "",
        publishedAt: release.published_at,
        downloadUrl: asset.browser_download_url,
        size: asset.size,
        isRecommended: version === RECOMMENDED_VERSION,
        isBundled: version === RECOMMENDED_VERSION,
      });
    }

    // If the bundled version wasn't found in releases, add it manually
    const hasBundled = firmwareReleases.some((r) => r.isBundled);
    if (!hasBundled) {
      firmwareReleases.unshift({
        version: RECOMMENDED_VERSION,
        title: `UIFlow2 v${RECOMMENDED_VERSION} (Bundled)`,
        notes: "Locally bundled firmware - always available offline.",
        publishedAt: new Date().toISOString(),
        downloadUrl: BUNDLED_FIRMWARE_PATH,
        size: 8_384_512,
        isRecommended: true,
        isBundled: true,
      });
    }

    cachedCatalog = {
      releases: firmwareReleases,
      fetchedAt: new Date().toISOString(),
    };
    cachedAt = Date.now();

    return cachedCatalog;
  } catch (err) {
    console.error("Failed to fetch firmware catalog:", err);

    // Fallback: return just the bundled version
    return {
      releases: [
        {
          version: RECOMMENDED_VERSION,
          title: `UIFlow2 v${RECOMMENDED_VERSION} (Bundled)`,
          notes: "Locally bundled firmware - always available offline.",
          publishedAt: new Date().toISOString(),
          downloadUrl: BUNDLED_FIRMWARE_PATH,
          size: 8_384_512,
          isRecommended: true,
          isBundled: true,
        },
      ],
      fetchedAt: new Date().toISOString(),
    };
  }
}
