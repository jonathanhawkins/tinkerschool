---
paths:
  - "lib/supabase/**/*.ts"
  - "supabase/**/*"
  - "app/api/**/*.ts"
---

# Supabase & Database

## Client Usage
- **Server Components & Server Actions:** Use `createServerSupabaseClient()` from `@/lib/supabase/server`. This injects the Clerk JWT automatically.
- **Client Components:** Use `useSupabaseClient()` hook from `@/lib/supabase/client`. This uses the Clerk session token.
- **Webhooks & admin operations:** Use `createAdminSupabaseClient()` from `@/lib/supabase/admin` with the service role key. Never expose the service role key to the client.
- Never use the Supabase client at the module top-level in a Server Component -- always create it inside the async function body after auth.

## Row Level Security (RLS)
- RLS is mandatory on all user-data tables. Every table with user data has RLS enabled.
- Kids see their own data. Parents see all data within their family.
- Curriculum tables (`modules`, `lessons`, `badges`) are publicly readable.
- Always test RLS policies for both parent and kid roles after schema changes.
- The `auth.uid()` in RLS corresponds to the Clerk user ID passed via JWT.

## UUID Format
- UUIDs must contain only hex characters (0-9, a-f). Patterns like `b2m1-0000-...` are INVALID (`m` is not hex).
- Use format: `00000002-0001-4000-8000-000000000001` (8-4-4-4-12 hex chars).
- SQL `LANGUAGE sql` functions validate table references at creation time. Always create tables BEFORE helper functions that reference them. Use `LANGUAGE plpgsql` if you need to reference tables that may not exist yet.

## Schema Conventions
- Primary keys: `UUID DEFAULT gen_random_uuid()`.
- User references: `TEXT` type storing Clerk user IDs (not UUID -- Clerk IDs are strings like `user_xxx`).
- Timestamps: `TIMESTAMPTZ DEFAULT now()`.
- JSON data: `JSONB` type for flexible structured data (lesson content, chat messages, badge criteria).
- Use `CHECK` constraints for enum-like columns (role, status, band, connection_type).

## Migrations
- All schema changes go through `supabase/migrations/` files.
- Name migrations descriptively: `20240101000000_create_families_and_profiles.sql`.
- Include RLS policies in the same migration as the table creation.
- Seed data (curriculum content) goes in `supabase/seed.sql`.

## Real-Time
- Use Supabase real-time subscriptions sparingly -- only for the parent dashboard progress updates.
- Real-time channels must be cleaned up in `useEffect` return functions.
