-- Migration: add tenant_id to recoltes_miel and captures_peche
-- Date: 2025-10-22
-- This migration adds a tenant_id UUID column (nullable) with a foreign key to public.tenants(id)
-- and creates indexes. Existing rows are left with NULL tenant_id; optionally backfill after applying.

ALTER TABLE IF EXISTS public.recoltes_miel
  ADD COLUMN IF NOT EXISTS tenant_id uuid;

ALTER TABLE IF EXISTS public.captures_peche
  ADD COLUMN IF NOT EXISTS tenant_id uuid;

-- Add foreign key constraints (add only if tenants table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tenants') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'recoltes_miel' AND kcu.column_name = 'tenant_id'
    ) THEN
      ALTER TABLE public.recoltes_miel
        ADD CONSTRAINT fk_recoltes_miel_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'captures_peche' AND kcu.column_name = 'tenant_id'
    ) THEN
      ALTER TABLE public.captures_peche
        ADD CONSTRAINT fk_captures_peche_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
  END IF;
END$$;

-- Create indexes for tenant filtering
CREATE INDEX IF NOT EXISTS idx_recoltes_miel_tenant ON public.recoltes_miel(tenant_id);
CREATE INDEX IF NOT EXISTS idx_captures_peche_tenant ON public.captures_peche(tenant_id);

-- Notes:
-- 1) This migration makes tenant_id nullable to avoid blocking existing data. If you want to backfill tenant_id
--    for existing rows, add an UPDATE statement here (for example using business logic or default tenant id).
-- 2) After applying this migration, update your hooks to include tenant scoping (getTenantId and .eq('tenant_id', ...)).
-- 3) Consider adding RLS policies afterwards to enforce tenant isolation.
