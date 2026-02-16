import { test, expect } from "@playwright/test";

/**
 * E2E tests for the authenticated kid lesson flow.
 *
 * Tests the core user journey:
 *   Sign in -> Home (Mission Control) -> Subjects -> Subject detail ->
 *   Open a lesson -> See lesson content
 *
 * Requires Clerk test credentials:
 *   E2E_CLERK_USER_USERNAME=test+clerk_test@gmail.com
 *   E2E_CLERK_USER_PASSWORD=testpass123
 *   npx playwright test e2e/kid-lesson-flow.spec.ts
 */

const hasClerkCreds =
  !!process.env.E2E_CLERK_USER_USERNAME &&
  !!process.env.E2E_CLERK_USER_PASSWORD;

test.describe("Kid lesson flow (authenticated)", () => {
  test.skip(!hasClerkCreds, "Clerk test credentials not configured");

  test.beforeEach(async ({ page }) => {
    // Sign in via Clerk
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");

    const emailInput = page.locator('input[name="identifier"]');
    await emailInput.fill(process.env.E2E_CLERK_USER_USERNAME!);
    await page.getByRole("button", { name: /continue/i }).click();

    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill(process.env.E2E_CLERK_USER_PASSWORD!);
    await page.getByRole("button", { name: /continue/i }).click();

    // Wait for redirect to dashboard
    await page.waitForURL(/\/(home|onboarding)/, { timeout: 15_000 });
  });

  // ---------------------------------------------------------------------------
  // Mission Control (Home)
  // ---------------------------------------------------------------------------

  test("home page renders Mission Control heading", async ({ page }) => {
    await page.goto("/home");
    await page.waitForLoadState("domcontentloaded");

    await expect(
      page.getByRole("heading", { name: /mission control/i }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("home page shows sidebar navigation", async ({ page }) => {
    await page.goto("/home");
    await page.waitForLoadState("domcontentloaded");

    // Sidebar should have main nav links (desktop view)
    const subjectsLink = page.locator("a[href='/subjects']").first();
    await expect(subjectsLink).toBeVisible({ timeout: 10_000 });
  });

  // ---------------------------------------------------------------------------
  // Subjects
  // ---------------------------------------------------------------------------

  test("subjects page renders subject grid", async ({ page }) => {
    await page.goto("/subjects");
    await page.waitForLoadState("domcontentloaded");

    // Page heading
    await expect(
      page.getByRole("heading", { name: /explore subjects/i }),
    ).toBeVisible({ timeout: 10_000 });

    // Should have at least one subject card (link to /subjects/<slug>)
    const subjectLinks = page.locator("a[href^='/subjects/']");
    const count = await subjectLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("clicking a subject navigates to subject detail", async ({ page }) => {
    await page.goto("/subjects");
    await page.waitForLoadState("domcontentloaded");

    // Click the first subject card
    const firstSubject = page.locator("a[href^='/subjects/']").first();
    await expect(firstSubject).toBeVisible({ timeout: 10_000 });

    const href = await firstSubject.getAttribute("href");
    await firstSubject.click();

    // Should navigate to /subjects/<slug>
    await page.waitForURL(/\/subjects\/[a-z-]+/, { timeout: 10_000 });
    expect(page.url()).toContain(href);
  });

  // ---------------------------------------------------------------------------
  // Subject detail -> Lessons
  // ---------------------------------------------------------------------------

  test("subject detail page shows lessons", async ({ page }) => {
    await page.goto("/subjects");
    await page.waitForLoadState("domcontentloaded");

    // Navigate to first subject
    const firstSubject = page.locator("a[href^='/subjects/']").first();
    await expect(firstSubject).toBeVisible({ timeout: 10_000 });
    await firstSubject.click();
    await page.waitForURL(/\/subjects\/[a-z-]+/, { timeout: 10_000 });

    // Subject detail page should have lesson links
    // Lessons link to /lessons/<uuid>
    const lessonLinks = page.locator("a[href^='/lessons/']");
    await expect(lessonLinks.first()).toBeVisible({ timeout: 10_000 });
    const lessonCount = await lessonLinks.count();
    expect(lessonCount).toBeGreaterThan(0);
  });

  // ---------------------------------------------------------------------------
  // Lesson page
  // ---------------------------------------------------------------------------

  test("lesson page renders lesson title and content", async ({ page }) => {
    await page.goto("/subjects");
    await page.waitForLoadState("domcontentloaded");

    // Navigate to first subject
    const firstSubject = page.locator("a[href^='/subjects/']").first();
    await expect(firstSubject).toBeVisible({ timeout: 10_000 });
    await firstSubject.click();
    await page.waitForURL(/\/subjects\/[a-z-]+/, { timeout: 10_000 });

    // Click the first lesson
    const firstLesson = page.locator("a[href^='/lessons/']").first();
    await expect(firstLesson).toBeVisible({ timeout: 10_000 });
    await firstLesson.click();
    await page.waitForURL(/\/lessons\//, { timeout: 10_000 });

    // Lesson page should have an h1 (the lesson title)
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10_000 });
    const titleText = await heading.textContent();
    expect(titleText?.trim().length).toBeGreaterThan(0);
  });

  test("lesson page shows breadcrumb navigation back to home", async ({
    page,
  }) => {
    await page.goto("/subjects");
    await page.waitForLoadState("domcontentloaded");

    // Navigate through to a lesson
    const firstSubject = page.locator("a[href^='/subjects/']").first();
    await expect(firstSubject).toBeVisible({ timeout: 10_000 });
    await firstSubject.click();
    await page.waitForURL(/\/subjects\/[a-z-]+/, { timeout: 10_000 });

    const firstLesson = page.locator("a[href^='/lessons/']").first();
    await expect(firstLesson).toBeVisible({ timeout: 10_000 });
    await firstLesson.click();
    await page.waitForURL(/\/lessons\//, { timeout: 10_000 });

    // Breadcrumb should have a "Mission Control" link back to /
    const backLink = page.locator("a[href='/']", {
      hasText: /mission control/i,
    });
    await expect(backLink).toBeVisible({ timeout: 10_000 });
  });

  test("lesson page shows subject badge", async ({ page }) => {
    await page.goto("/subjects");
    await page.waitForLoadState("domcontentloaded");

    // Navigate through to a lesson
    const firstSubject = page.locator("a[href^='/subjects/']").first();
    await expect(firstSubject).toBeVisible({ timeout: 10_000 });
    await firstSubject.click();
    await page.waitForURL(/\/subjects\/[a-z-]+/, { timeout: 10_000 });

    const firstLesson = page.locator("a[href^='/lessons/']").first();
    await expect(firstLesson).toBeVisible({ timeout: 10_000 });
    await firstLesson.click();
    await page.waitForURL(/\/lessons\//, { timeout: 10_000 });

    // Should show either "Interactive" or "Simulator Ready" or "Hardware Needed" badge
    const interactiveBadge = page.getByText("Interactive");
    const simulatorBadge = page.getByText("Simulator Ready");
    const hardwareBadge = page.getByText("Hardware Needed");

    const hasAnyBadge =
      (await interactiveBadge.isVisible().catch(() => false)) ||
      (await simulatorBadge.isVisible().catch(() => false)) ||
      (await hardwareBadge.isVisible().catch(() => false));

    expect(hasAnyBadge).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // Full navigation flow (home -> subjects -> lesson -> back)
  // ---------------------------------------------------------------------------

  test("full navigation: home -> subjects -> subject -> lesson -> back", async ({
    page,
  }) => {
    // 1. Start at home
    await page.goto("/home");
    await page.waitForLoadState("domcontentloaded");
    await expect(
      page.getByRole("heading", { name: /mission control/i }),
    ).toBeVisible({ timeout: 10_000 });

    // 2. Navigate to subjects via sidebar
    await page.locator("a[href='/subjects']").first().click();
    await page.waitForURL(/\/subjects$/, { timeout: 10_000 });
    await expect(
      page.getByRole("heading", { name: /explore subjects/i }),
    ).toBeVisible({ timeout: 10_000 });

    // 3. Click first subject
    const firstSubject = page.locator("a[href^='/subjects/']").first();
    await expect(firstSubject).toBeVisible({ timeout: 10_000 });
    await firstSubject.click();
    await page.waitForURL(/\/subjects\/[a-z-]+/, { timeout: 10_000 });

    // 4. Click first lesson
    const firstLesson = page.locator("a[href^='/lessons/']").first();
    await expect(firstLesson).toBeVisible({ timeout: 10_000 });
    await firstLesson.click();
    await page.waitForURL(/\/lessons\//, { timeout: 10_000 });

    // Verify lesson loaded
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10_000 });

    // 5. Navigate back via breadcrumb
    const backLink = page.locator("a[href='/']", {
      hasText: /mission control/i,
    });
    await expect(backLink).toBeVisible({ timeout: 10_000 });
    await backLink.click();

    // Should be back at home
    await page.waitForURL(/\/(home)?$/, { timeout: 10_000 });
  });

  // ---------------------------------------------------------------------------
  // Workshop link (coding lessons)
  // ---------------------------------------------------------------------------

  test("coding lesson shows Start Coding button linking to workshop", async ({
    page,
  }) => {
    // Navigate to the coding subject specifically
    await page.goto("/subjects/coding");

    // If page redirects (subject doesn't exist), skip gracefully
    const isCodingPage = page.url().includes("/subjects/coding");
    if (!isCodingPage) {
      test.skip();
      return;
    }

    await page.waitForLoadState("domcontentloaded");

    // Look for a lesson link
    const lessonLink = page.locator("a[href^='/lessons/']").first();
    const hasLessons = await lessonLink.isVisible({ timeout: 5_000 }).catch(() => false);

    if (!hasLessons) {
      test.skip();
      return;
    }

    await lessonLink.click();
    await page.waitForURL(/\/lessons\//, { timeout: 10_000 });

    // Coding lessons show "Start Coding" or "Continue Coding" CTA
    const startCoding = page.getByRole("link", {
      name: /start coding|continue coding/i,
    });
    const isInteractive = await page
      .getByText("Interactive")
      .isVisible()
      .catch(() => false);

    // Only non-interactive (coding) lessons have the workshop CTA
    if (!isInteractive) {
      await expect(startCoding).toBeVisible({ timeout: 5_000 });
      const href = await startCoding.getAttribute("href");
      expect(href).toContain("/workshop");
    }
  });
});

// ---------------------------------------------------------------------------
// Unauthenticated lesson access
// ---------------------------------------------------------------------------

test.describe("Lesson pages (unauthenticated)", () => {
  test("direct lesson URL redirects to sign-in", async ({ page }) => {
    // Use a fake UUID - should redirect to sign-in before even checking DB
    await page.goto("/lessons/00000000-0000-0000-0000-000000000001");

    await page.waitForURL(/sign-in/, { timeout: 10_000 });
    expect(page.url()).toContain("/sign-in");
  });
});
