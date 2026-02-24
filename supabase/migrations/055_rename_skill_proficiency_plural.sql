-- Migration: Rename skill_proficiency → skill_proficiencies
-- Reason: TypeScript types and most code references use the plural form.
-- The original migration (002) created the table as singular, causing silent
-- query failures where the Supabase client couldn't find the table.

-- 1. Rename the table
ALTER TABLE public.skill_proficiency RENAME TO skill_proficiencies;

-- 2. Rename indexes
ALTER INDEX idx_skill_proficiency_profile_id RENAME TO idx_skill_proficiencies_profile_id;
ALTER INDEX idx_skill_proficiency_skill_id RENAME TO idx_skill_proficiencies_skill_id;

-- 3. Rename RLS policies (drop + recreate since ALTER POLICY only changes USING/WITH CHECK)
-- Policy: select own
ALTER POLICY "skill_proficiency_select_own" ON public.skill_proficiencies
  RENAME TO "skill_proficiencies_select_own";

-- Policy: select family parent
ALTER POLICY "skill_proficiency_select_family_parent" ON public.skill_proficiencies
  RENAME TO "skill_proficiencies_select_family_parent";

-- Policy: insert own
ALTER POLICY "skill_proficiency_insert_own" ON public.skill_proficiencies
  RENAME TO "skill_proficiencies_insert_own";

-- Policy: update own
ALTER POLICY "skill_proficiency_update_own" ON public.skill_proficiencies
  RENAME TO "skill_proficiencies_update_own";

-- 4. Rename the updated_at trigger
ALTER TRIGGER trg_skill_proficiency_updated_at ON public.skill_proficiencies
  RENAME TO trg_skill_proficiencies_updated_at;
