-- =========================================================================
-- Migration 009: Add COPPA parental consent tracking to families
-- =========================================================================
-- Tracks whether the parent/guardian has given verifiable parental consent
-- as required by COPPA for collecting children's information.
-- =========================================================================

ALTER TABLE public.families
  ADD COLUMN IF NOT EXISTS coppa_consent_given boolean NOT NULL DEFAULT false;

ALTER TABLE public.families
  ADD COLUMN IF NOT EXISTS coppa_consent_at timestamptz;

ALTER TABLE public.families
  ADD COLUMN IF NOT EXISTS coppa_consent_ip text;
