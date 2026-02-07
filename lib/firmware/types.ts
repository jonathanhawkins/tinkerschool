/**
 * Types for firmware catalog and version management.
 */

/** A single firmware release from the GitHub Releases API. */
export interface FirmwareRelease {
  /** GitHub release tag (e.g. "2.4.1") */
  version: string;
  /** Release title from GitHub */
  title: string;
  /** Release notes (markdown) */
  notes: string;
  /** ISO date string */
  publishedAt: string;
  /** Direct download URL for the firmware .bin asset */
  downloadUrl: string;
  /** File size in bytes */
  size: number;
  /** Whether this is the recommended version (bundled locally) */
  isRecommended: boolean;
  /** Whether this is bundled in public/firmware/ for offline use */
  isBundled: boolean;
}

/** Result from fetching the firmware catalog. */
export interface FirmwareCatalog {
  releases: FirmwareRelease[];
  /** When this catalog was fetched (ISO date) */
  fetchedAt: string;
}
