"use client";

/**
 * COPPA-compliant analytics wrapper.
 *
 * Under COPPA, persistent identifiers (device fingerprints, analytics IDs)
 * collected from children under 13 constitute "personal information" and
 * require verifiable parental consent. Rather than requiring consent for
 * analytics, we simply exclude analytics from kid-facing authenticated
 * pages entirely.
 *
 * Analytics only load on:
 * - Public/marketing pages (/, /privacy, /terms, /support, /demo)
 * - Auth pages (/sign-in, /sign-up)
 * - Parent-only dashboard (/dashboard -- the parent route group)
 *
 * Analytics do NOT load on:
 * - Kid-facing authenticated pages (/home, /workshop, /lessons/*, /subjects/*, etc.)
 * - Onboarding (to avoid tracking children during setup)
 */

import { usePathname } from "next/navigation";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Pathname prefixes where analytics are ALLOWED.
 * Everything else (kid-facing pages) is excluded by default.
 */
const ANALYTICS_ALLOWED_PATTERNS = [
  // Public/marketing pages
  "/privacy",
  "/terms",
  "/support",
  "/demo",
  "/sign-in",
  "/sign-up",
  // Parent-only dashboard (the (parent) route group renders at /dashboard)
  "/dashboard",
];

function shouldLoadAnalytics(pathname: string): boolean {
  // Landing page
  if (pathname === "/") return true;

  // Check allowed prefixes
  return ANALYTICS_ALLOWED_PATTERNS.some((prefix) =>
    pathname.startsWith(prefix)
  );
}

export function CoppaAnalytics() {
  const pathname = usePathname();

  if (!shouldLoadAnalytics(pathname)) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "5d17afae58b64c0798cc717bae46bbb1"}'
      />
    </>
  );
}
