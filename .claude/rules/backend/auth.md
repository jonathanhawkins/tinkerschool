---
paths:
  - "app/**/*.{ts,tsx}"
  - "lib/auth/**/*.ts"
  - "lib/clerk/**/*.ts"
  - "middleware.ts"
---

# Authentication (Clerk)

## Account Model
- **Parent:** Real Clerk user with email + password or OAuth. Role: `org:admin` in Clerk Organization.
- **Kid:** Managed profile under parent's Clerk Organization. Role: `org:member`. No email required, PIN-based login (4-digit numeric).
- **Family:** Clerk Organization grouping parent + kid(s).
- Kid metadata stored in Clerk `publicMetadata`: `displayName`, `avatarId`, `gradeLevel`, `currentBand`.
- Kid PIN stored as bcrypt hash in Clerk `privateMetadata`.

## Auth Patterns
- Use `requireAuth()` from `@/lib/auth/require-auth` in Server Components. It returns `{ userId, profile, supabase }` or redirects to sign-in/onboarding.
- Use `await auth()` from `@clerk/nextjs/server` in Server Actions and API routes.
- Use `useUser()` from `@clerk/nextjs` in client components for user data.
- Clerk middleware in `middleware.ts` protects all routes except: `/`, `/sign-in(.*)`, `/sign-up(.*)`, `/api/webhooks(.*)`.

## Webhook Sync
- Clerk `user.created` webhook creates a corresponding `profiles` record in Supabase.
- Webhook route: `app/api/webhooks/clerk/route.ts`. Verify with svix signature.
- Use the admin Supabase client (service role) in webhook handlers.

## Testing (Dev Mode)
- **Test emails:** Use `+clerk_test` suffix (e.g. `test+clerk_test@gmail.com`). No real email is sent; verification code is always `424242`.
- **Test phones:** Any fictional number works. SMS code is always `424242`.
- **E2E (Playwright):** Use `setupClerkTestingToken()` from `@clerk/testing/playwright` to bypass bot detection. Set `E2E_CLERK_USER_USERNAME` + `E2E_CLERK_USER_PASSWORD` env vars.
- **Dashboard:** Can also create test users directly in the Clerk Dashboard (no verification needed).

## Security
- Never expose Clerk secret key or Supabase service role key in client code.
- Kid PIN validation happens server-side only via API route.
- Parent routes (`(parent)/`) must verify the user has role `parent` in their profile.
- Kid routes must scope all data queries to the active kid's profile.
