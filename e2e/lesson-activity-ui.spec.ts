import { test, expect } from "@playwright/test";

/**
 * E2E tests for lesson activity UI — option alignment, narration behavior,
 * and interactive element layout.
 *
 * Bug class: visual layout regressions in activity widgets (left-aligned
 * content in centered containers, auto-firing side-effects burning tokens).
 *
 * Requires Clerk test credentials:
 *   E2E_CLERK_USER_USERNAME=test+clerk_test@gmail.com
 *   E2E_CLERK_USER_PASSWORD=testpass123
 *   npx playwright test e2e/lesson-activity-ui.spec.ts
 */

const hasClerkCreds =
  !!process.env.E2E_CLERK_USER_USERNAME &&
  !!process.env.E2E_CLERK_USER_PASSWORD;

// ---------------------------------------------------------------------------
// Helper: sign in and navigate to the first interactive lesson
// ---------------------------------------------------------------------------

async function signInAndOpenLesson(page: import("@playwright/test").Page) {
  await page.goto("/sign-in");
  await page.waitForLoadState("domcontentloaded");

  const emailInput = page.locator('input[name="identifier"]');
  await emailInput.fill(process.env.E2E_CLERK_USER_USERNAME!);
  await page.getByRole("button", { name: /continue/i }).click();

  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.fill(process.env.E2E_CLERK_USER_PASSWORD!);
  await page.getByRole("button", { name: /continue/i }).click();

  await page.waitForURL(/\/(home|onboarding)/, { timeout: 15_000 });

  // Navigate to subjects -> first subject -> first lesson
  await page.goto("/subjects");
  await page.waitForLoadState("domcontentloaded");

  const firstSubject = page.locator("a[href^='/subjects/']").first();
  await expect(firstSubject).toBeVisible({ timeout: 10_000 });
  await firstSubject.click();
  await page.waitForURL(/\/subjects\/[a-z-]+/, { timeout: 10_000 });

  const firstLesson = page.locator("a[href^='/lessons/']").first();
  await expect(firstLesson).toBeVisible({ timeout: 10_000 });
  await firstLesson.click();
  await page.waitForURL(/\/lessons\//, { timeout: 10_000 });

  // Wait for lesson content to load
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toBeVisible({ timeout: 10_000 });
}

// ---------------------------------------------------------------------------
// Multiple choice option alignment
// ---------------------------------------------------------------------------

test.describe("Multiple choice option alignment", () => {
  test.skip(!hasClerkCreds, "Clerk test credentials not configured");

  test("option buttons use centered content alignment", async ({ page }) => {
    await signInAndOpenLesson(page);

    // Wait for activity options to render (multiple choice option buttons)
    const optionButtons = page.locator("[data-testid='activity-option']");

    // If this lesson doesn't have multiple choice, skip gracefully
    const count = await optionButtons.count().catch(() => 0);
    if (count === 0) {
      test.skip();
      return;
    }

    // Check every option button has justify-center (not justify-start)
    for (let i = 0; i < count; i++) {
      const button = optionButtons.nth(i);
      const justifyContent = await button.evaluate(
        (el) => window.getComputedStyle(el).justifyContent,
      );
      expect(justifyContent).toBe("center");
    }
  });

  test("emoji-only options are horizontally centered", async ({ page }) => {
    await signInAndOpenLesson(page);

    // Look for buttons that contain an emoji span but no visible text
    const optionButtons = page.locator("[data-testid='activity-option']");
    const count = await optionButtons.count().catch(() => 0);
    if (count === 0) {
      test.skip();
      return;
    }

    for (let i = 0; i < count; i++) {
      const button = optionButtons.nth(i);
      const textAlign = await button.evaluate(
        (el) => window.getComputedStyle(el).textAlign,
      );
      expect(textAlign).toBe("center");
    }
  });

  test("text-only options are also centered", async ({ page }) => {
    await signInAndOpenLesson(page);

    const optionButtons = page.locator("[data-testid='activity-option']");
    const count = await optionButtons.count().catch(() => 0);
    if (count === 0) {
      test.skip();
      return;
    }

    // All options — regardless of content type — should be centered
    for (let i = 0; i < count; i++) {
      const button = optionButtons.nth(i);
      const justifyContent = await button.evaluate(
        (el) => window.getComputedStyle(el).justifyContent,
      );
      expect(justifyContent).toBe("center");
    }
  });
});

// ---------------------------------------------------------------------------
// Auto-narration should NOT fire on page load
// ---------------------------------------------------------------------------

test.describe("Narration is user-initiated only", () => {
  test.skip(!hasClerkCreds, "Clerk test credentials not configured");

  test("speechSynthesis.speak is not called automatically on lesson load", async ({
    page,
  }) => {
    // Instrument speechSynthesis before navigation
    await page.addInitScript(() => {
      const calls: string[] = [];
      const origSpeak = window.speechSynthesis.speak.bind(
        window.speechSynthesis,
      );
      window.speechSynthesis.speak = (utterance: SpeechSynthesisUtterance) => {
        calls.push(utterance.text);
        // Don't actually speak — just record
      };
      // Expose recorded calls for test assertions
      (window as unknown as Record<string, unknown>).__speechCalls = calls;
    });

    await signInAndOpenLesson(page);

    // Wait a generous amount of time for any auto-speak to trigger
    await page.waitForTimeout(3000);

    // Check that no speechSynthesis.speak calls were made
    const calls = await page.evaluate(
      () =>
        (window as unknown as Record<string, unknown>).__speechCalls as
          | string[]
          | undefined,
    );
    expect(calls ?? []).toEqual([]);
  });

  test("Hear Again button triggers narration on click", async ({ page }) => {
    // Instrument speechSynthesis
    await page.addInitScript(() => {
      const calls: string[] = [];
      window.speechSynthesis.speak = (utterance: SpeechSynthesisUtterance) => {
        calls.push(utterance.text);
      };
      (window as unknown as Record<string, unknown>).__speechCalls = calls;
    });

    await signInAndOpenLesson(page);

    // Look for the "Hear Again" / replay button
    const hearAgain = page.getByRole("button", {
      name: /hear.*again|hear chip/i,
    });
    const hasHearAgain = await hearAgain
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    if (!hasHearAgain) {
      // Not a Pre-K lesson with narrator — skip
      test.skip();
      return;
    }

    // Verify no auto-speak happened before clicking
    const callsBefore = await page.evaluate(
      () =>
        (window as unknown as Record<string, unknown>).__speechCalls as
          | string[]
          | undefined,
    );
    expect(callsBefore ?? []).toEqual([]);

    // Click the button
    await hearAgain.click();

    // Now speech should have been triggered
    await page.waitForTimeout(500);
    const callsAfter = await page.evaluate(
      () =>
        (window as unknown as Record<string, unknown>).__speechCalls as
          | string[]
          | undefined,
    );
    expect((callsAfter ?? []).length).toBeGreaterThan(0);
  });

  test("activity speaker icon triggers narration on click", async ({
    page,
  }) => {
    // Instrument speechSynthesis
    await page.addInitScript(() => {
      const calls: string[] = [];
      window.speechSynthesis.speak = (utterance: SpeechSynthesisUtterance) => {
        calls.push(utterance.text);
      };
      (window as unknown as Record<string, unknown>).__speechCalls = calls;
    });

    await signInAndOpenLesson(page);

    // Look for any speaker/volume icon button in the activity area
    const speakerBtn = page.getByRole("button", {
      name: /speak|hear|listen|read aloud/i,
    });
    const hasSpeaker = await speakerBtn
      .first()
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    if (!hasSpeaker) {
      test.skip();
      return;
    }

    // Confirm zero auto-speaks
    const callsBefore = await page.evaluate(
      () =>
        (window as unknown as Record<string, unknown>).__speechCalls as
          | string[]
          | undefined,
    );
    expect(callsBefore ?? []).toEqual([]);

    // Click the speaker button
    await speakerBtn.first().click();
    await page.waitForTimeout(500);

    const callsAfter = await page.evaluate(
      () =>
        (window as unknown as Record<string, unknown>).__speechCalls as
          | string[]
          | undefined,
    );
    expect((callsAfter ?? []).length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Activity widget touch targets (44px minimum for kid-facing UI)
// ---------------------------------------------------------------------------

test.describe("Activity widget touch targets", () => {
  test.skip(!hasClerkCreds, "Clerk test credentials not configured");

  test("all option buttons meet 44px minimum touch target", async ({
    page,
  }) => {
    await signInAndOpenLesson(page);

    const optionButtons = page.locator("[data-testid='activity-option']");
    const count = await optionButtons.count().catch(() => 0);
    if (count === 0) {
      test.skip();
      return;
    }

    for (let i = 0; i < count; i++) {
      const button = optionButtons.nth(i);
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
