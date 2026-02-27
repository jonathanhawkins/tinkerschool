-- =============================================================================
-- 078: Create email_subscribers table for blog/landing page email capture
-- =============================================================================

create table if not exists public.email_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  name       text,
  source     text not null default 'unknown',    -- e.g. 'blog_footer', 'landing_page', 'pdf_download'
  referrer   text,                                -- which page they subscribed from
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,                       -- for double opt-in (future)
  unsubscribed_at timestamptz,                    -- soft unsubscribe tracking

  constraint email_subscribers_email_unique unique (email)
);

-- Index for quick lookups
create index if not exists idx_email_subscribers_email on public.email_subscribers (email);
create index if not exists idx_email_subscribers_created_at on public.email_subscribers (created_at desc);

-- RLS: service role only (no public read/write)
alter table public.email_subscribers enable row level security;

-- No public policies — only service-role (admin) client can access this table.
-- This keeps subscriber data private and prevents enumeration.

comment on table public.email_subscribers is 'Email subscribers from blog, landing page, and lead magnets. Service-role access only.';
