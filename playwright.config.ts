import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E test configuration for TinkerSchool.
 *
 * Runs against a local Next.js dev server on port 3000.
 * Start it manually with `npm run dev` or let `webServer` handle it.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "http://localhost:3020",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3020",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
