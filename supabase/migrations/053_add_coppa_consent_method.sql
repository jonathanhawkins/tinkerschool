-- =========================================================================
-- Migration 053: Add COPPA consent method tracking
-- =========================================================================
-- Tracks which COPPA consent method was used for audit trail purposes.
-- Currently supports:
--   'checkbox_email_plus' - Checkbox + confirmation email (current method)
--   'email_plus_verified' - Full Email Plus with confirmed verification link
-- Future methods may include: 'credit_card', 'phone_call', 'video_call'
-- per FTC-approved VPC methods.
-- =========================================================================

ALTER TABLE public.families
  ADD COLUMN IF NOT EXISTS coppa_consent_method text DEFAULT 'checkbox_email_plus';

-- Add a column to track whether the Email Plus confirmation was completed
-- (parent clicked the confirmation link in the email). NULL = not yet confirmed.
ALTER TABLE public.families
  ADD COLUMN IF NOT EXISTS coppa_consent_confirmed_at timestamptz;

COMMENT ON COLUMN public.families.coppa_consent_method IS
  'FTC-approved verifiable parental consent method used. See COPPA VPC requirements.';

COMMENT ON COLUMN public.families.coppa_consent_confirmed_at IS
  'Timestamp when parent completed the Email Plus confirmation step (clicked link in email). NULL if not yet confirmed.';
