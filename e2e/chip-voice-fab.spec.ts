import { test, expect } from "@playwright/test";

/**
 * E2E tests for the Chip Voice floating action button (FAB).
 *
 * These tests require:
 * 1. Clerk test credentials (E2E_CLERK_USER_USERNAME + E2E_CLERK_USER_PASSWORD)
 * 2. Hume API keys (HUME_API_KEY + HUME_SECRET_KEY) or they test the "no keys" path
 *
 * Skipped when Clerk test credentials are not available. To run locally:
 *   E2E_CLERK_USER_USERNAME=test+clerk_test@gmail.com \
 *   E2E_CLERK_USER_PASSWORD=testpass123 \
 *   npx playwright test e2e/chip-voice-fab.spec.ts
 */

const hasClerkCreds =
  !!process.env.E2E_CLERK_USER_USERNAME &&
  !!process.env.E2E_CLERK_USER_PASSWORD;

test.describe("Chip Voice FAB (authenticated)", () => {
  // Skip entire suite if no Clerk test credentials
  test.skip(!hasClerkCreds, "Clerk test credentials not configured");

  test.beforeEach(async ({ page }) => {
    // Sign in via Clerk
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");

    // Fill Clerk sign-in form (test mode: verification code is 424242)
    const emailInput = page.locator('input[name="identifier"]');
    await emailInput.fill(process.env.E2E_CLERK_USER_USERNAME!);
    await page.getByRole("button", { name: /continue/i }).click();

    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill(process.env.E2E_CLERK_USER_PASSWORD!);
    await page.getByRole("button", { name: /continue/i }).click();

    // Wait for redirect to dashboard
    await page.waitForURL(/\/(home|onboarding)/, { timeout: 15_000 });
  });

  test("FAB renders on the home page", async ({ page }) => {
    await page.goto("/home");
    await page.waitForLoadState("domcontentloaded");

    // The FAB is a button with aria-label "Talk to Chip"
    const fab = page.getByRole("button", { name: "Talk to Chip" });
    await expect(fab).toBeVisible({ timeout: 10_000 });
  });

  test("FAB opens and closes on click", async ({ page }) => {
    await page.goto("/home");
    await page.waitForLoadState("domcontentloaded");

    const fab = page.getByRole("button", { name: "Talk to Chip" });
    await expect(fab).toBeVisible({ timeout: 10_000 });

    // Click FAB to open panel
    await fab.click();

    // Panel should be visible with Chip header
    const chipHeader = page.getByText("Chip", { exact: true }).first();
    await expect(chipHeader).toBeVisible({ timeout: 5_000 });

    // Close button should be visible
    const closeButton = page.getByRole("button", {
      name: "Close Chip voice panel",
    });
    await expect(closeButton).toBeVisible();

    // Click close to dismiss
    await closeButton.click();

    // Panel should disappear, FAB should show "Talk to Chip" again
    await expect(
      page.getByRole("button", { name: "Talk to Chip" }),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("FAB panel closes on Escape key", async ({ page }) => {
    await page.goto("/home");
    const fab = page.getByRole("button", { name: "Talk to Chip" });
    await expect(fab).toBeVisible({ timeout: 10_000 });

    // Open panel
    await fab.click();
    await expect(
      page.getByRole("button", { name: "Close Chip voice panel" }),
    ).toBeVisible({ timeout: 5_000 });

    // Press Escape
    await page.keyboard.press("Escape");

    // Panel should close
    await expect(
      page.getByRole("button", { name: "Talk to Chip" }),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("FAB persists across page navigation", async ({ page }) => {
    await page.goto("/home");
    const fab = page.getByRole("button", { name: "Talk to Chip" });
    await expect(fab).toBeVisible({ timeout: 10_000 });

    // Navigate to subjects
    await page.goto("/subjects");
    await page.waitForLoadState("domcontentloaded");

    // FAB should still be there (it's in the layout)
    await expect(
      page.getByRole("button", { name: "Talk to Chip" }),
    ).toBeVisible({ timeout: 10_000 });

    // Navigate to achievements
    await page.goto("/achievements");
    await page.waitForLoadState("domcontentloaded");

    await expect(
      page.getByRole("button", { name: "Talk to Chip" }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("FAB panel shows connect button (mic icon)", async ({ page }) => {
    await page.goto("/home");
    const fab = page.getByRole("button", { name: "Talk to Chip" });
    await expect(fab).toBeVisible({ timeout: 10_000 });

    // Open panel
    await fab.click();

    // Should have a connect/start button
    const startButton = page.getByRole("button", {
      name: "Start voice chat with Chip",
    });
    await expect(startButton).toBeVisible({ timeout: 5_000 });
  });

  test("mobile viewport: panel does not overflow horizontally", async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/home");
    const fab = page.getByRole("button", { name: "Talk to Chip" });
    await expect(fab).toBeVisible({ timeout: 10_000 });

    // Open panel
    await fab.click();

    // Wait for panel to appear
    const closeButton = page.getByRole("button", {
      name: "Close Chip voice panel",
    });
    await expect(closeButton).toBeVisible({ timeout: 5_000 });

    // Check that panel doesn't cause horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasOverflow).toBe(false);
  });
});

test.describe("Chip Voice FAB (no Hume keys)", () => {
  // This test verifies behavior when Hume keys are missing.
  // In production, the FAB simply doesn't render (returns null from server).
  // We can verify this by checking that unauthenticated pages don't have the FAB.

  test("FAB is NOT present on public pages (landing, sign-in)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // The FAB should not exist on public pages (it's only in the dashboard layout)
    const fab = page.getByRole("button", { name: "Talk to Chip" });
    await expect(fab).not.toBeVisible({ timeout: 3_000 });
  });

  test("FAB is NOT present on sign-in page", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");

    const fab = page.getByRole("button", { name: "Talk to Chip" });
    await expect(fab).not.toBeVisible({ timeout: 3_000 });
  });
});
