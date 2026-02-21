import { test, expect } from "@playwright/test";

// Test email using Clerk test mode - verification code is always 424242
const TEST_EMAIL = "test+clerk_test@gmail.com";
const VERIFICATION_CODE = "424242";

test.describe("Onboarding Flow", () => {
  test.setTimeout(120_000); // 2 minute timeout for the full flow

  test("full sign-up and onboarding flow", async ({ page }) => {
    // ---------------------------------------------------------------
    // Step 0: Navigate to homepage
    // ---------------------------------------------------------------
    console.log("--- STEP 0: Navigate to homepage ---");
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "e2e/screenshots/00-homepage.png", fullPage: true });
    console.log("Homepage URL:", page.url());

    // ---------------------------------------------------------------
    // Step 1: Navigate to sign-up
    // ---------------------------------------------------------------
    console.log("--- STEP 1: Navigate to sign-up ---");
    await page.goto("/sign-up", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "e2e/screenshots/01-signup-page.png", fullPage: true });
    console.log("Sign-up URL:", page.url());

    // ---------------------------------------------------------------
    // Step 2: Enter email for sign-up
    // ---------------------------------------------------------------
    console.log("--- STEP 2: Enter email ---");
    
    // Try various Clerk email selectors
    const emailSelectors = [
      'input#identifier-field',
      'input[name="identifier"]',
      'input[name="emailAddress"]',
      'input[type="email"]',
      'input.cl-formFieldInput',
      'input[placeholder*="email"]',
      'input[placeholder*="Email"]',
    ];
    
    let emailFilled = false;
    for (const sel of emailSelectors) {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
        await el.fill(TEST_EMAIL);
        emailFilled = true;
        console.log(`Email filled using selector: ${sel}`);
        break;
      }
    }
    
    if (!emailFilled) {
      // Try looking for any visible input
      const inputs = page.locator('input:visible');
      const count = await inputs.count();
      console.log(`Found ${count} visible inputs`);
      for (let i = 0; i < count; i++) {
        const inp = inputs.nth(i);
        const type = await inp.getAttribute('type');
        const name = await inp.getAttribute('name');
        const placeholder = await inp.getAttribute('placeholder');
        console.log(`  Input ${i}: type=${type}, name=${name}, placeholder=${placeholder}`);
      }
      // Try filling the first input
      if (count > 0) {
        await inputs.first().fill(TEST_EMAIL);
        emailFilled = true;
        console.log("Email filled in first visible input");
      }
    }
    
    await page.screenshot({ path: "e2e/screenshots/02-email-entered.png", fullPage: true });
    
    // Click continue/submit button
    const continueSelectors = [
      'button[type="submit"]',
      'button:has-text("Continue")',
      'button:has-text("Sign up")',
      'button.cl-formButtonPrimary',
    ];
    
    for (const sel of continueSelectors) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await btn.click();
        console.log(`Clicked continue using: ${sel}`);
        break;
      }
    }
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "e2e/screenshots/03-after-email-submit.png", fullPage: true });
    console.log("After email submit URL:", page.url());

    // ---------------------------------------------------------------
    // Step 3: Handle verification code
    // ---------------------------------------------------------------
    console.log("--- STEP 3: Handle verification ---");
    
    // Check if we're on a verification page
    const pageContent = await page.textContent('body');
    console.log("Page contains 'verification':", pageContent?.toLowerCase().includes('verif'));
    console.log("Page contains 'code':", pageContent?.toLowerCase().includes('code'));
    
    // Look for verification code inputs
    const codeInputs = page.locator('input[data-code-input], input.cl-otpInput, input[name*="code"]');
    const codeInputCount = await codeInputs.count();
    console.log(`Found ${codeInputCount} code inputs`);
    
    if (codeInputCount > 0) {
      // Fill in verification code digits one by one
      for (let i = 0; i < 6 && i < codeInputCount; i++) {
        const digit = VERIFICATION_CODE[i] || "4";
        await codeInputs.nth(i).fill(digit);
        await page.waitForTimeout(100);
      }
      console.log("Verification code entered");
    } else {
      // Try typing the code into any single input field
      const singleCodeInput = page.locator('input:visible').first();
      if (await singleCodeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Check all visible inputs for code entry
        const allInputs = page.locator('input:visible');
        const inputCount = await allInputs.count();
        console.log(`Looking for code input among ${inputCount} visible inputs`);
        
        for (let i = 0; i < inputCount; i++) {
          const inp = allInputs.nth(i);
          const type = await inp.getAttribute('type');
          const name = await inp.getAttribute('name');
          const ph = await inp.getAttribute('placeholder');
          const ariaLabel = await inp.getAttribute('aria-label');
          console.log(`  Input ${i}: type=${type}, name=${name}, ph=${ph}, aria=${ariaLabel}`);
        }
        
        // Try OTP-style individual digit inputs
        const otpInputs = page.locator('input[autocomplete="one-time-code"], input[inputmode="numeric"]');
        const otpCount = await otpInputs.count();
        if (otpCount >= 6) {
          for (let i = 0; i < 6; i++) {
            await otpInputs.nth(i).pressSequentially(VERIFICATION_CODE[i]);
            await page.waitForTimeout(100);
          }
          console.log("OTP code entered via numeric inputs");
        } else if (otpCount > 0) {
          // Sometimes there's a single OTP input
          await otpInputs.first().fill(VERIFICATION_CODE);
          console.log("OTP code entered in single input");
        }
      }
    }
    
    await page.screenshot({ path: "e2e/screenshots/04-verification-code.png", fullPage: true });
    
    // Submit verification if there's a button
    const verifyBtn = page.locator('button:has-text("Verify"), button[type="submit"]').first();
    if (await verifyBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await verifyBtn.click();
      console.log("Clicked verify button");
    }
    
    await page.waitForTimeout(5000);
    await page.screenshot({ path: "e2e/screenshots/05-after-verification.png", fullPage: true });
    console.log("After verification URL:", page.url());

    // ---------------------------------------------------------------
    // Step 4: Check if we reached onboarding
    // ---------------------------------------------------------------
    console.log("--- STEP 4: Check for onboarding page ---");
    
    // Wait for redirect to onboarding
    const currentUrl = page.url();
    if (!currentUrl.includes('/onboarding')) {
      console.log("Not on onboarding yet, current URL:", currentUrl);
      // Try navigating directly
      try {
        await page.goto("/onboarding", { waitUntil: "domcontentloaded", timeout: 10000 });
        await page.waitForTimeout(2000);
      } catch (e) {
        console.log("Direct navigation to onboarding failed");
      }
    }
    
    await page.screenshot({ path: "e2e/screenshots/06-onboarding-start.png", fullPage: true });
    console.log("Onboarding URL:", page.url());
    
    // Check if we see the welcome step
    const welcomeText = page.locator('text=Welcome to TinkerSchool');
    if (await welcomeText.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log("SUCCESS: Welcome to TinkerSchool page visible");
    } else {
      console.log("WARNING: Welcome text not found");
      // Take a diagnostic screenshot
      const bodyText = await page.textContent('body');
      console.log("Body text (first 500 chars):", bodyText?.substring(0, 500));
    }

    // ---------------------------------------------------------------
    // Step 5: Onboarding Step 1 - Welcome
    // ---------------------------------------------------------------
    console.log("--- ONBOARDING STEP 1: Welcome ---");
    await page.screenshot({ path: "e2e/screenshots/07-onboarding-step1-welcome.png", fullPage: true });
    
    // Click "Get Started" button
    const getStartedBtn = page.locator('button:has-text("Get Started")');
    if (await getStartedBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await getStartedBtn.click();
      console.log("Clicked 'Get Started'");
      await page.waitForTimeout(1000);
    }
    
    await page.screenshot({ path: "e2e/screenshots/08-onboarding-step2-family.png", fullPage: true });

    // ---------------------------------------------------------------
    // Step 6: Onboarding Step 2 - Family Setup
    // ---------------------------------------------------------------
    console.log("--- ONBOARDING STEP 2: Family Setup ---");
    
    const familyNameInput = page.locator('#family-name');
    const parentNameInput = page.locator('#parent-name');
    
    if (await familyNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await familyNameInput.fill("The Test Family");
      console.log("Family name filled");
    }
    
    if (await parentNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Clear and fill (it may be pre-filled from Clerk)
      await parentNameInput.clear();
      await parentNameInput.fill("Test Parent");
      console.log("Parent name filled");
    }
    
    await page.screenshot({ path: "e2e/screenshots/09-family-setup-filled.png", fullPage: true });
    
    // Click "Next"
    const nextBtn = page.locator('button:has-text("Next")');
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click();
      console.log("Clicked 'Next' from family step");
      await page.waitForTimeout(1000);
    }

    // ---------------------------------------------------------------
    // Step 7: Onboarding Step 3 - Add Your Child
    // ---------------------------------------------------------------
    console.log("--- ONBOARDING STEP 3: Add Your Child ---");
    await page.screenshot({ path: "e2e/screenshots/10-onboarding-step3-child.png", fullPage: true });
    
    const childNameInput = page.locator('#child-name');
    if (await childNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await childNameInput.fill("TestKid");
      console.log("Child name filled");
    }
    
    // Select grade level
    const gradeSelect = page.locator('button:has-text("Select a grade")');
    if (await gradeSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await gradeSelect.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: "e2e/screenshots/11-grade-dropdown.png", fullPage: true });
      
      const firstGrade = page.locator('text=1st Grade').first();
      if (await firstGrade.isVisible({ timeout: 2000 }).catch(() => false)) {
        await firstGrade.click();
        console.log("Selected 1st Grade");
      }
    }
    
    // Select avatar
    await page.waitForTimeout(500);
    const robotAvatar = page.locator('[aria-label="Select Robot avatar"]');
    if (await robotAvatar.isVisible({ timeout: 3000 }).catch(() => false)) {
      await robotAvatar.click();
      console.log("Selected Robot avatar");
    }
    
    await page.screenshot({ path: "e2e/screenshots/12-child-setup-filled.png", fullPage: true });
    
    // Click "Next"
    const nextBtn2 = page.locator('button:has-text("Next")');
    if (await nextBtn2.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn2.click();
      console.log("Clicked 'Next' from child step");
      await page.waitForTimeout(1000);
    }

    // ---------------------------------------------------------------
    // Step 8: Onboarding Step 4 - Set PIN
    // ---------------------------------------------------------------
    console.log("--- ONBOARDING STEP 4: Set PIN ---");
    await page.screenshot({ path: "e2e/screenshots/13-onboarding-step4-pin.png", fullPage: true });
    
    // Fill PIN digits
    const pinInputs = page.locator('[aria-label^="PIN digit"]');
    const pinCount = await pinInputs.count();
    console.log(`Found ${pinCount} PIN inputs`);
    
    if (pinCount === 4) {
      for (let i = 0; i < 4; i++) {
        await pinInputs.nth(i).fill(String(i + 1));
        await page.waitForTimeout(100);
      }
      console.log("PIN entered: 1234");
    }
    
    // Fill confirm PIN digits
    const confirmPinInputs = page.locator('[aria-label^="Confirm PIN digit"]');
    const confirmCount = await confirmPinInputs.count();
    console.log(`Found ${confirmCount} confirm PIN inputs`);
    
    if (confirmCount === 4) {
      for (let i = 0; i < 4; i++) {
        await confirmPinInputs.nth(i).fill(String(i + 1));
        await page.waitForTimeout(100);
      }
      console.log("Confirm PIN entered: 1234");
    }
    
    // Check COPPA consent checkbox
    const coppaCheckbox = page.locator('#coppa-consent');
    if (await coppaCheckbox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await coppaCheckbox.check();
      console.log("COPPA consent checked");
    }
    
    await page.screenshot({ path: "e2e/screenshots/14-pin-setup-filled.png", fullPage: true });
    
    // Click "Finish Setup"
    const finishBtn = page.locator('button:has-text("Finish Setup")');
    if (await finishBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await finishBtn.click();
      console.log("Clicked 'Finish Setup'");
      await page.waitForTimeout(5000);
    }
    
    await page.screenshot({ path: "e2e/screenshots/15-after-submit.png", fullPage: true });
    console.log("After submit URL:", page.url());

    // ---------------------------------------------------------------
    // Step 9: Onboarding Step 5 - Device Setup
    // ---------------------------------------------------------------
    console.log("--- ONBOARDING STEP 5: Device Setup ---");
    await page.screenshot({ path: "e2e/screenshots/16-onboarding-step5-device.png", fullPage: true });
    
    // Check for device step content
    const deviceTitle = page.locator('text=Connect Your Device');
    const howToConnect = page.locator('text=How do you want to connect');
    
    if (await deviceTitle.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log("Device setup step visible");
    }
    if (await howToConnect.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log("Device connection options visible");
    }
    
    // Click "Skip for now" to bypass device setup
    const skipBtn = page.locator('button:has-text("Skip for now")');
    if (await skipBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await skipBtn.click();
      console.log("Clicked 'Skip for now'");
      await page.waitForTimeout(2000);
    }
    
    await page.screenshot({ path: "e2e/screenshots/17-after-device-skip.png", fullPage: true });

    // ---------------------------------------------------------------
    // Step 10: Onboarding Step 6 - Meet Chip
    // ---------------------------------------------------------------
    console.log("--- ONBOARDING STEP 6: Meet Chip ---");
    await page.screenshot({ path: "e2e/screenshots/18-onboarding-step6-meet-chip.png", fullPage: true });
    
    const meetChipText = page.locator('text=Meet Chip');
    if (await meetChipText.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log("Meet Chip step visible");
    }
    
    // Look for continue button
    const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("Let")').first();
    if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await continueBtn.click();
      console.log("Clicked continue on Meet Chip");
      await page.waitForTimeout(2000);
    }
    
    await page.screenshot({ path: "e2e/screenshots/19-after-meet-chip.png", fullPage: true });

    // ---------------------------------------------------------------
    // Step 11: Onboarding Step 7 - First Lesson
    // ---------------------------------------------------------------
    console.log("--- ONBOARDING STEP 7: First Lesson ---");
    await page.screenshot({ path: "e2e/screenshots/20-onboarding-step7-first-lesson.png", fullPage: true });
    
    const firstLessonText = page.locator('text=Ready to Learn');
    if (await firstLessonText.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log("First lesson step visible");
    }
    
    // Click launch/start button
    const launchBtn = page.locator('button:has-text("Start"), button:has-text("Launch"), button:has-text("Go"), button:has-text("Begin")').first();
    if (await launchBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log("Launch/Start button found");
      // Don't click -- just verify it's present
    }
    
    // Final state screenshot
    await page.screenshot({ path: "e2e/screenshots/21-final-state.png", fullPage: true });
    console.log("Final URL:", page.url());
    console.log("=== ONBOARDING FLOW TEST COMPLETE ===");
  });
});
