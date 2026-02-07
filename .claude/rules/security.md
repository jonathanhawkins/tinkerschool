# Security & Child Safety

## Data Protection
- This platform serves children ages 5-12. All data handling must comply with COPPA principles.
- Never collect personal information from kids beyond what the parent provides during onboarding (display name, age/grade, avatar choice).
- Kids do not have email addresses in the system. Authentication is PIN-based under the parent's Clerk account.
- All kid data is scoped to the family via Supabase RLS. Kids cannot see other families' data.

## API Security
- Never expose API keys in client-side code: `CLERK_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY` are server-only.
- All API routes (`app/api/`) must validate auth with `await auth()` before processing.
- Clerk webhook routes must verify the svix signature before processing events.
- Rate limit the AI buddy API route to prevent abuse.

## Content Safety
- AI buddy (Chip) system prompt includes strict topic guardrails. Chip only discusses: coding, math, science, creative projects.
- All AI conversations are logged and available to parents in the parent dashboard.
- User-generated content in the gallery is family-scoped by default. Public sharing (if enabled) requires parent approval.

## Input Validation
- Validate all form inputs server-side in Server Actions, not just client-side.
- Sanitize user-generated content (project titles, chat messages) before storing and displaying.
- MicroPython code uploaded to devices is generated from Blockly blocks -- not arbitrary user input (for Band 1-2). Band 3+ text editing should still be validated for basic safety.

## Environment Variables
- Use `.env.local` for local development (gitignored).
- Use Vercel environment variables for production.
- Never commit `.env` files or secrets to version control.
