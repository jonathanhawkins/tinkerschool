-- =============================================================================
-- Migration 007: Add pin_hash column to profiles
-- =============================================================================
-- Stores bcrypt-hashed PINs for kid login. The column is nullable because
-- parent profiles don't use PINs and existing kid profiles may not have one.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN pin_hash text;

COMMENT ON COLUMN public.profiles.pin_hash IS
  'Bcrypt hash of the 4-digit kid login PIN. NULL for parent profiles.';
