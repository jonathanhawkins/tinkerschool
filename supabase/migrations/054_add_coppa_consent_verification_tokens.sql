-- COPPA Email Plus verification tokens
-- Tracks confirmation links sent to parents during onboarding.
-- Parents must click the link within 48 hours to confirm consent.

CREATE TABLE IF NOT EXISTS public.coppa_consent_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  parent_email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '48 hours'),
  confirmed_at timestamptz,
  CONSTRAINT token_not_empty CHECK (char_length(token) > 0)
);

-- Index for fast token lookup
CREATE INDEX idx_coppa_consent_tokens_token ON public.coppa_consent_tokens(token);

-- Index for cleanup of expired unconfirmed tokens
CREATE INDEX idx_coppa_consent_tokens_expires ON public.coppa_consent_tokens(expires_at)
  WHERE confirmed_at IS NULL;

-- RLS: only service role can access these tokens
ALTER TABLE public.coppa_consent_tokens ENABLE ROW LEVEL SECURITY;

-- No RLS policies = only service role (admin) can read/write.
-- This is intentional: tokens should never be accessible via client-side queries.

COMMENT ON TABLE public.coppa_consent_tokens IS
  'COPPA Email Plus verification tokens. Parents click a link to confirm consent within 48 hours.';
