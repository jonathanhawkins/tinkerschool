-- 011_add_stripe_billing.sql
-- Add Stripe billing columns to the families table.
-- Subscription is per-family (one parent pays, all kids benefit).

ALTER TABLE public.families
  ADD COLUMN stripe_customer_id text UNIQUE,
  ADD COLUMN subscription_tier text NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'supporter')),
  ADD COLUMN stripe_subscription_id text UNIQUE,
  ADD COLUMN stripe_subscription_status text,
  ADD COLUMN stripe_price_id text,
  ADD COLUMN stripe_current_period_end timestamptz;

-- Indexes for webhook lookups
CREATE INDEX idx_families_stripe_customer_id
  ON public.families (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX idx_families_stripe_subscription_id
  ON public.families (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;
