-- Migration: add avatar_url and phone_normalized to profiles

ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS phone_normalized text;

-- Consider adding an index on phone_normalized for lookup performance:
-- CREATE INDEX IF NOT EXISTS idx_profiles_phone_normalized ON public.profiles(phone_normalized);
