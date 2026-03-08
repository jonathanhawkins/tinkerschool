import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes that do NOT require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/privacy",
  "/terms",
  "/api/webhooks(.*)",
  "/api/demo-chat",
  "/demo(.*)",
  "/firmware(.*)",
  "/support",
  "/onboarding(.*)",
  "/opengraph-image(.*)",
  "/twitter-image(.*)",
  "/api/coppa-confirm(.*)",
  "/coppa-confirmed(.*)",
  "/blog(.*)",
  "/alpha(.*)",
]);

// Routes that should be indexable by search engines (public marketing pages)
const isIndexableRoute = createRouteMatcher([
  "/",
  "/demo(.*)",
  "/blog(.*)",
  "/privacy",
  "/terms",
  "/support",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Set X-Robots-Tag header directly in middleware response.
  // This is more reliable than next.config.ts headers on Cloudflare Workers,
  // where the Worker may not run in front of all responses.
  const response = NextResponse.next();

  if (isIndexableRoute(req)) {
    response.headers.set(
      "X-Robots-Tag",
      "index, follow, max-image-preview:large, max-snippet:-1"
    );
  } else {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|bin|elf|hex|txt|xml)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
