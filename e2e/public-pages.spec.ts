import { test, expect } from "@playwright/test";

test.describe("Public pages (no auth required)", () => {
  test("landing page loads with hero and CTA", async ({ page }) => {
    await page.goto("/");

    // Page should load (not redirect to sign-in)
    await expect(page).toHaveURL("/");

    // Hero heading should be visible
    await expect(
      page.getByRole("heading", { level: 1 })
    ).toBeVisible({ timeout: 10_000 });

    // Hero CTA "Get Started" link should be visible (in hero section)
    await expect(
      page.locator("a[href='/sign-up']").first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("landing page has desktop navigation links", async ({ page }) => {
    // Use desktop viewport (default is 1280x720)
    await page.goto("/");

    // Desktop nav should have Sign In link (hidden on mobile via md:flex)
    const signInLink = page.locator("nav a[href='/sign-in']").first();
    await expect(signInLink).toBeVisible({ timeout: 10_000 });
  });

  test("privacy policy page loads", async ({ page }) => {
    const response = await page.goto("/privacy");

    // Should load successfully (200 or 304)
    expect(response?.ok()).toBe(true);

    // Should have privacy heading
    await expect(
      page.getByRole("heading", { name: /privacy/i }).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("terms of service page loads", async ({ page }) => {
    const response = await page.goto("/terms");

    expect(response?.ok()).toBe(true);

    await expect(
      page.getByRole("heading", { name: /terms/i }).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("sign-in page loads", async ({ page }) => {
    await page.goto("/sign-in");

    // Clerk renders its sign-in component
    expect(page.url()).toContain("/sign-in");
  });

  test("sign-up page loads", async ({ page }) => {
    await page.goto("/sign-up");

    expect(page.url()).toContain("/sign-up");
  });
});

test.describe("Protected pages redirect to sign-in", () => {
  test("dashboard redirects unauthenticated users", async ({ page }) => {
    await page.goto("/home");

    await page.waitForURL(/sign-in/, { timeout: 10_000 });
    expect(page.url()).toContain("/sign-in");
  });

  test("workshop redirects unauthenticated users", async ({ page }) => {
    await page.goto("/workshop");

    await page.waitForURL(/sign-in/, { timeout: 10_000 });
    expect(page.url()).toContain("/sign-in");
  });

  test("subjects page redirects unauthenticated users", async ({ page }) => {
    await page.goto("/subjects");

    await page.waitForURL(/sign-in/, { timeout: 10_000 });
    expect(page.url()).toContain("/sign-in");
  });

  test("achievements page redirects unauthenticated users", async ({ page }) => {
    await page.goto("/achievements");

    await page.waitForURL(/sign-in/, { timeout: 10_000 });
    expect(page.url()).toContain("/sign-in");
  });
});

test.describe("SEO and metadata", () => {
  test("landing page has TinkerSchool in title", async ({ page }) => {
    await page.goto("/");

    await page.waitForLoadState("domcontentloaded");
    const title = await page.title();
    expect(title.toLowerCase()).toContain("tinkerschool");
  });

  test("landing page has meta description", async ({ page }) => {
    await page.goto("/");

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);
  });

  test("landing page has Open Graph tags", async ({ page }) => {
    await page.goto("/");

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });

  test("robots.txt is accessible", async ({ request }) => {
    // Use request API instead of page for non-HTML responses
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain("User-Agent");
  });
});

test.describe("Accessibility basics", () => {
  test("landing page has exactly one h1", async ({ page }) => {
    await page.goto("/");

    await page.waitForLoadState("domcontentloaded");

    const h1s = page.getByRole("heading", { level: 1 });
    await expect(h1s).toHaveCount(1);
  });

  test("landing page images have alt text", async ({ page }) => {
    await page.goto("/");

    await page.waitForLoadState("domcontentloaded");

    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      const role = await img.getAttribute("role");
      const ariaHidden = await img.getAttribute("aria-hidden");

      // Every img should have alt text, or be decorative
      const isDecorative = role === "presentation" || ariaHidden === "true";
      expect(
        alt !== null || isDecorative,
        `Image ${i} is missing alt text and is not marked as decorative`
      ).toBe(true);
    }
  });

  test("privacy page is navigable with keyboard", async ({ page }) => {
    await page.goto("/privacy");

    await page.waitForLoadState("domcontentloaded");

    // Tab through the page -- should be able to reach a focusable element
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });

  test("landing page CTA buttons have accessible names", async ({ page }) => {
    await page.goto("/");

    // Get Started link should be accessible
    const getStarted = page.locator("a[href='/sign-up']").first();
    await expect(getStarted).toBeVisible({ timeout: 10_000 });
    const text = await getStarted.textContent();
    expect(text?.trim()).toBeTruthy();
  });
});

test.describe("Navigation flows", () => {
  test("landing page Get Started links to sign-up", async ({ page }) => {
    await page.goto("/");

    const ctaLink = page.locator("a[href='/sign-up']").first();
    await expect(ctaLink).toBeVisible({ timeout: 10_000 });
    await ctaLink.click();

    await page.waitForURL(/sign-up/, { timeout: 10_000 });
    expect(page.url()).toContain("/sign-up");
  });

  test("privacy page has back navigation", async ({ page }) => {
    await page.goto("/privacy");

    // Should have a link back to home or landing
    const backLink = page.locator("a[href='/']").first();
    await expect(backLink).toBeVisible({ timeout: 10_000 });
  });
});
