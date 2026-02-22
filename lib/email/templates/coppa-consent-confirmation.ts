// ---------------------------------------------------------------------------
// COPPA Consent Confirmation — Email Template
// ---------------------------------------------------------------------------
//
// Sent to parents after onboarding to confirm their consent under the FTC's
// "Email Plus" method. Summarizes what data is collected, which third parties
// process it, and how to review/delete data or withdraw consent.
// ---------------------------------------------------------------------------

interface CoppaConsentEmailInput {
  /** The child's display name */
  kidName: string;
  /** ISO timestamp of when consent was given */
  consentTimestamp: string;
  /** Verification URL the parent must click to confirm consent */
  verificationUrl?: string;
}

/**
 * Generate the HTML body for the COPPA consent confirmation email.
 */
export function buildCoppaConsentHtml(input: CoppaConsentEmailInput): string {
  const { kidName, consentTimestamp, verificationUrl } = input;
  const formattedDate = new Date(consentTimestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>COPPA Consent Confirmation — TinkerSchool</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1C1917;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #F97316; padding: 32px 32px 24px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #FFFFFF;">
                TinkerSchool
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">
                COPPA Consent Confirmation
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
                Thank you for signing up for TinkerSchool! This email confirms your consent for us to collect and use information from <strong>${kidName}</strong> for educational purposes.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 13px; color: #64748B;">
                Consent recorded on ${formattedDate}
              </p>

              <!-- What We Collect -->
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #1C1917;">
                What We Collect
              </h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr><td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #334155;">&#8226; First name and grade level (for lesson personalization)</td></tr>
                <tr><td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #334155;">&#8226; Learning progress, projects, and activity scores</td></tr>
                <tr><td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #334155;">&#8226; AI chat conversations with Chip (our AI tutor)</td></tr>
                <tr><td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #334155;">&#8226; Learning style preferences and skill proficiency levels</td></tr>
              </table>

              <!-- Third-Party Services -->
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #1C1917;">
                Third-Party Services
              </h2>
              <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.5; color: #334155;">
                The following services process your child's data to provide TinkerSchool's features:
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr><td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #334155;"><strong>Anthropic (Claude AI)</strong> — Powers Chip, the AI tutor. Chat messages are sent to Anthropic for processing but are not used to train their models.</td></tr>
                <tr><td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #334155;"><strong>Supabase</strong> — Secure cloud database where progress and project data is stored.</td></tr>
                <tr><td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #334155;"><strong>Clerk</strong> — Authentication service that manages your family account and sign-in.</td></tr>
              </table>

              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #334155; font-weight: 600;">
                Your child's data is NEVER sold or used for advertising.
              </p>

              <!-- Your Rights -->
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #1C1917;">
                Your Rights
              </h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr><td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #334155;"><strong>Review data:</strong> Parent Dashboard &gt; Settings</td></tr>
                <tr><td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #334155;"><strong>Export data:</strong> Parent Dashboard &gt; Settings &gt; Export Child Data</td></tr>
                <tr><td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #334155;"><strong>Delete data:</strong> Parent Dashboard &gt; Settings &gt; Delete Account</td></tr>
                <tr><td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #334155;"><strong>Withdraw consent:</strong> Email <a href="mailto:privacy@tinkerschool.ai" style="color: #F97316; text-decoration: underline;">privacy@tinkerschool.ai</a></td></tr>
              </table>

              ${verificationUrl ? `
              <!-- Verification CTA -->
              <div style="background-color: #FFF7ED; border: 2px solid #F97316; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
                <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #1C1917;">
                  Please confirm your consent
                </p>
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748B;">
                  Click the button below within 48 hours to verify your parental consent.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td style="background-color: #F97316; border-radius: 12px; text-align: center;">
                      <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #FFFFFF; text-decoration: none;">
                        Confirm My Consent
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
              ` : ""}

              <!-- Privacy Policy Link -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px auto;">
                <tr>
                  <td style="background-color: ${verificationUrl ? "#E2E8F0" : "#F97316"}; border-radius: 12px; text-align: center;">
                    <a href="https://tinkerschool.ai/privacy" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: ${verificationUrl ? "#334155" : "#FFFFFF"}; text-decoration: none;">
                      Read Our Full Privacy Policy
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #94A3B8;">
                If you did not create a TinkerSchool account, please ignore this email or contact us at <a href="mailto:privacy@tinkerschool.ai" style="color: #F97316; text-decoration: underline;">privacy@tinkerschool.ai</a>.
              </p>
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
 * Generate the plain text fallback for the COPPA consent confirmation email.
 */
export function buildCoppaConsentText(input: CoppaConsentEmailInput): string {
  const { kidName, consentTimestamp, verificationUrl } = input;
  const formattedDate = new Date(consentTimestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return [
    "COPPA Consent Confirmation — TinkerSchool",
    "==========================================",
    "",
    `Thank you for signing up for TinkerSchool! This email confirms your consent for us to collect and use information from ${kidName} for educational purposes.`,
    "",
    `Consent recorded on ${formattedDate}`,
    ...(verificationUrl
      ? [
          "",
          "*** PLEASE CONFIRM YOUR CONSENT ***",
          "Click the link below within 48 hours to verify your parental consent:",
          verificationUrl,
          "",
        ]
      : []),
    "",
    "WHAT WE COLLECT",
    `- First name and grade level (for lesson personalization)`,
    `- Learning progress, projects, and activity scores`,
    `- AI chat conversations with Chip (our AI tutor)`,
    `- Learning style preferences and skill proficiency levels`,
    "",
    "THIRD-PARTY SERVICES",
    `- Anthropic (Claude AI): Powers Chip, the AI tutor. Chat messages are sent to Anthropic for processing but are not used to train their models.`,
    `- Supabase: Secure cloud database where progress and project data is stored.`,
    `- Clerk: Authentication service that manages your family account and sign-in.`,
    "",
    `Your child's data is NEVER sold or used for advertising.`,
    "",
    "YOUR RIGHTS",
    `- Review data: Parent Dashboard > Settings`,
    `- Export data: Parent Dashboard > Settings > Export Child Data`,
    `- Delete data: Parent Dashboard > Settings > Delete Account`,
    `- Withdraw consent: Email privacy@tinkerschool.ai`,
    "",
    "Privacy Policy: https://tinkerschool.ai/privacy",
    "",
    "---",
    "If you did not create a TinkerSchool account, please ignore this email or contact us at privacy@tinkerschool.ai.",
    "",
    "TinkerSchool — AI-Powered Learning for Kids",
  ].join("\n");
}
