---
paths:
  - "app/**/*.{ts,tsx}"
  - "components/**/*.{ts,tsx}"
  - "middleware.ts"
---

# Next.js 15 & React Server Components

## RSC-First Architecture
- Every component is a Server Component by default. Only add `"use client"` when the component needs browser APIs, useState, useEffect, event handlers, or third-party client-only libs.
- Never add `"use client"` to page.tsx or layout.tsx files. They should always be Server Components that fetch data and pass it down.
- Keep the client boundary as small as possible. Wrap only the interactive leaf components in `"use client"`, not their parent containers.

## Data Fetching
- Fetch data in async Server Components using direct Supabase queries. Never use `useEffect` + `fetch` for initial data loading.
- Use `Promise.all()` for parallel independent queries in a single Server Component.
- Use `await requireAuth()` from `@/lib/auth/require-auth` at the top of any authenticated Server Component to get `{ userId, profile, supabase }`.
- Use `<Suspense>` boundaries around slow-loading sections so faster content streams immediately.
- Every route group should have a `loading.tsx` with appropriate skeleton UI.

## Server Actions
- All mutations (save, update, delete, share) use Server Actions in dedicated `actions.ts` files marked with `'use server'`.
- Always call `revalidatePath()` after mutations to refresh server-rendered data.
- Use `useActionState` in client components for form feedback with progressive enhancement.
- Validate auth with `await auth()` at the top of every Server Action.

## Dynamic Imports
- Always use `dynamic(() => import(...), { ssr: false })` for browser-only libraries: Blockly, Monaco, xterm.js, Web Serial components.
- Provide a `loading` fallback with skeleton UI that matches the component's dimensions.

## Routing
- Use route groups: `(auth)` for sign-in/up, `(dashboard)` for kid-facing pages, `(parent)` for parent-only pages.
- Clerk middleware protects all routes except public ones (landing, sign-in, sign-up, webhooks).
- Use `notFound()` from `next/navigation` when data is missing, never return null pages.

## Performance
- Non-workshop pages must ship under 50KB of client JS.
- Use ISR (`revalidate: 60`) for gallery and badge list pages.
- Prefer server-rendered SVG charts over client-side charting libraries on the parent dashboard.
