// ---------------------------------------------------------------------------
// Generic Parent Notification — Email Template
// ---------------------------------------------------------------------------

interface ParentNotificationEmailInput {
  /** Notification title */
  title: string;
  /** Notification body (plain text, newlines preserved) */
  body: string;
  /** The child's display name */
  kidName: string;
}

/**
 * Generate the HTML body for a generic parent notification email.
 */
export function buildParentNotificationHtml(input: ParentNotificationEmailInput): string {
  const { title, body, kidName } = input;
  const htmlBody = body
    .split("\n")
    .map((line) => (line.trim() === "" ? "<br />" : `<p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.6; color: #334155;">${escapeHtml(line)}</p>`))
    .join("\n              ");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} — TinkerSchool</title>
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
              <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #1C1917;">
                ${escapeHtml(title)}
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 13px; color: #64748B;">
                Update about ${escapeHtml(kidName)}
              </p>
              ${htmlBody}
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
 * Generate the plain text fallback for a generic parent notification.
 */
export function buildParentNotificationText(input: ParentNotificationEmailInput): string {
  const { title, body, kidName } = input;
  return [
    `${title} — TinkerSchool`,
    "=".repeat(title.length + 16),
    "",
    `Update about ${kidName}`,
    "",
    body,
    "",
    "---",
    "TinkerSchool — AI-Powered Learning for Kids",
    "Privacy Policy: https://tinkerschool.ai/privacy",
  ].join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
