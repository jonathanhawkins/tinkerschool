import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|bin|elf|hex|txt|xml)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
