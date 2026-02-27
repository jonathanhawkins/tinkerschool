-- =============================================================================
-- TinkerSchool -- Shift All Bands Up by 1 (Kindergarten becomes its own band)
-- =============================================================================
-- Previously:
--   Band 0 = Pre-K (Seedling)
--   Band 1 = K-1 (Explorer)
--   Band 2 = 2-3 (Builder)
--   Band 3 = 3-4 (Inventor)
--   Band 4 = 4-5 (Hacker)
--   Band 5 = 5-6 (Creator)
--
-- After this migration:
--   Band 0 = Pre-K (Seedling)         -- unchanged
--   Band 1 = Kindergarten (Explorer)  -- NEW (will be seeded in later migrations)
--   Band 2 = 1st Grade (Builder)      -- was band 1
--   Band 3 = 2-3 (Inventor)           -- was band 2
--   Band 4 = 3-4 (Hacker)             -- was band 3
--   Band 5 = 4-5 (Creator)            -- was band 4
--   Band 6 = 5-6 (Innovator)          -- was band 5
--
-- IMPORTANT: We shift from highest to lowest to avoid unique constraint
-- conflicts on (band, order_num).
--
-- Affected tables:
--   - modules.band
--   - profiles.current_band
--
-- Depends on: 065_add_user_events.sql
-- =============================================================================


-- =========================================================================
-- 1. Shift modules.band from highest to lowest
-- =========================================================================
-- The modules table has a UNIQUE (band, order_num) constraint.
-- We must drop it first, shift, then re-create it.

ALTER TABLE public.modules DROP CONSTRAINT IF EXISTS modules_band_order_num_key;

UPDATE public.modules SET band = 6 WHERE band = 5;
UPDATE public.modules SET band = 5 WHERE band = 4;
UPDATE public.modules SET band = 4 WHERE band = 3;
UPDATE public.modules SET band = 3 WHERE band = 2;
UPDATE public.modules SET band = 2 WHERE band = 1;
-- Band 0 (Pre-K) stays unchanged.
-- Band 1 is now empty -- will be populated with Kindergarten content.

ALTER TABLE public.modules ADD CONSTRAINT modules_band_order_num_key UNIQUE (band, order_num);


-- =========================================================================
-- 2. Shift profiles.current_band for existing users
-- =========================================================================
-- Same pattern: highest to lowest to avoid any potential issues.

UPDATE public.profiles SET current_band = 6 WHERE current_band = 5;
UPDATE public.profiles SET current_band = 5 WHERE current_band = 4;
UPDATE public.profiles SET current_band = 4 WHERE current_band = 3;
UPDATE public.profiles SET current_band = 3 WHERE current_band = 2;
UPDATE public.profiles SET current_band = 2 WHERE current_band = 1;
-- Band 0 profiles (Pre-K) stay unchanged.
