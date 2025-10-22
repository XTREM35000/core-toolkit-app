-- Migration: alter cohortes_escargots to add bassin assignment and introduction fields

ALTER TABLE IF EXISTS public.cohortes_escargots
  ADD COLUMN IF NOT EXISTS bassin_id uuid REFERENCES public.bassins_piscicoles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS type_escargot text,
  ADD COLUMN IF NOT EXISTS date_introduction date;

-- Update updated_at timestamp on row change if you have a trigger; otherwise applications should set updated_at.
