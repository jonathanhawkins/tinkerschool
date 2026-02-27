// ---------------------------------------------------------------------------
// Welcome Subscriber — Email Template
// ---------------------------------------------------------------------------

interface WelcomeSubscriberEmailInput {
  /** Subscriber name (optional) */
  name?: string;
}

/**
 * Generate the HTML body for the welcome email sent to new subscribers.
 */
export function buildWelcomeSubscriberHtml(input: WelcomeSubscriberEmailInput): string {
  const greeting = input.name ? escapeHtml(input.name) : "there";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to TinkerSchool!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1C1917;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #F97316; padding: 24px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #FFFFFF;">
                TinkerSchool
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #1C1917;">
                Welcome, ${greeting}!
              </h2>

              <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Thanks for joining the TinkerSchool community! We're a family of makers, thinkers, and learners building an AI-powered education platform for kids.
              </p>

              <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Here's what you can expect from us:
              </p>

              <ul style="margin: 0 0 20px 0; padding-left: 20px; font-size: 15px; line-height: 1.8; color: #334155;">
                <li>Free homeschool schedule templates and printables</li>
                <li>Hands-on STEM activity ideas for ages 5-12</li>
                <li>Tips on using AI tools for personalized learning</li>
                <li>Updates on new lessons and features</li>
              </ul>

              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                In the meantime, check out our latest resources on the blog:
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 12px; background-color: #F97316;">
                    <a href="https://tinkerschool.ai/blog" style="display: inline-block; padding: 12px 28px; font-size: 15px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 12px;">
                      Visit the Blog
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #94A3B8;">
                TinkerSchool &mdash; AI-Powered Learning for Kids
              </p>
              <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                <a href="https://tinkerschool.ai/privacy" style="color: #94A3B8; text-decoration: underline;">Privacy Policy</a>
                &nbsp;&middot;&nbsp;
                <a href="https://tinkerschool.ai/unsubscribe" style="color: #94A3B8; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

/**
 * Generate the plain text fallback for the welcome email.
 */
export function buildWelcomeSubscriberText(input: WelcomeSubscriberEmailInput): string {
  const greeting = input.name ?? "there";
  return [
    "Welcome to TinkerSchool!",
    "========================",
    "",
    `Hi ${greeting},`,
    "",
    "Thanks for joining the TinkerSchool community! We're a family of makers,",
    "thinkers, and learners building an AI-powered education platform for kids.",
    "",
    "Here's what you can expect from us:",
    "- Free homeschool schedule templates and printables",
    "- Hands-on STEM activity ideas for ages 5-12",
    "- Tips on using AI tools for personalized learning",
    "- Updates on new lessons and features",
    "",
    "Check out our latest resources: https://tinkerschool.ai/blog",
    "",
    "---",
    "TinkerSchool — AI-Powered Learning for Kids",
    "Privacy Policy: https://tinkerschool.ai/privacy",
    "Unsubscribe: https://tinkerschool.ai/unsubscribe",
  ].join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
