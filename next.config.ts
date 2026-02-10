import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Blockly 12.x focus-tree registry doesn't survive React StrictMode's
  // double-mount cycle, causing "Attempted to focus unregistered tree" errors.
  reactStrictMode: false,
  headers: async () => [
    {
      // Apply security headers to all routes
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            // Only allow scripts from our own origin and Clerk's auth widgets
            // Include both dev (*.clerk.accounts.dev) and prod (*.clerk.com, *.tinkerschool.ai) FAPI domains
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com https://storage.googleapis.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://img.clerk.com https://*.clerk.accounts.dev https://*.clerk.com https://blockly-demo.appspot.com",
            "media-src 'self' blob: https://blockly-demo.appspot.com",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://*.clerk.accounts.dev https://*.clerk.com https://clerk.tinkerschool.ai https://challenges.cloudflare.com https://api.hume.ai wss://api.hume.ai https://storage.googleapis.com",
            "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com",
            "worker-src 'self' blob:",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
          ].join("; "),
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(self), geolocation=(), serial=(self)",
        },
      ],
    },
  ],
};

export default nextConfig;
