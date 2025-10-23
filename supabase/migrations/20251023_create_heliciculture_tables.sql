-- Migration: create heliciculture (escargotières) tables
-- Date: 2025-10-23
-- Creates: escargoteres, journal_escargots, pontes_escargots, mesures_escargots

-- Table: escargoteres (individual snail houses / enclosures)
CREATE TABLE IF NOT EXISTS public.escargoteres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  type text,
  dimensions text,
  substrat text,
  date_installation date,
  tenant_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: journal_escargots (daily logs / maintenance entries)
CREATE TABLE IF NOT EXISTS public.journal_escargots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  activite text NOT NULL,
  observations text,
  cohorte_id uuid,
  escargotiere_id uuid,
  tenant_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: pontes_escargots (egg-laying events)
CREATE TABLE IF NOT EXISTS public.pontes_escargots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohorte_id uuid,
  cohorte_nom text,
  date_ponte date,
  nb_oeufs integer,
  observation text,
  tenant_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: mesures_escargots (growth measurements)
CREATE TABLE IF NOT EXISTS public.mesures_escargots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  poids_moyen numeric,
  taux_survie numeric,
  cohorte_id uuid,
  cohorte_nom text,
  tenant_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign keys to tenants if table exists (do nothing otherwise)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tenants') THEN
    -- escargoteres.tenant_id
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'escargoteres' AND kcu.column_name = 'tenant_id'
    ) THEN
      ALTER TABLE public.escargoteres
        ADD CONSTRAINT fk_escargoteres_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;

    -- journal_escargots.tenant_id
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'journal_escargots' AND kcu.column_name = 'tenant_id'
    ) THEN
      ALTER TABLE public.journal_escargots
        ADD CONSTRAINT fk_journal_escargots_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;

    -- pontes_escargots.tenant_id
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'pontes_escargots' AND kcu.column_name = 'tenant_id'
    ) THEN
      ALTER TABLE public.pontes_escargots
        ADD CONSTRAINT fk_pontes_escargots_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;

    -- mesures_escargots.tenant_id
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'mesures_escargots' AND kcu.column_name = 'tenant_id'
    ) THEN
      ALTER TABLE public.mesures_escargots
        ADD CONSTRAINT fk_mesures_escargots_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
  END IF;
END$$;

-- Indexes for tenant filtering
CREATE INDEX IF NOT EXISTS idx_escargoteres_tenant ON public.escargoteres(tenant_id);
CREATE INDEX IF NOT EXISTS idx_journal_escargots_tenant ON public.journal_escargots(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pontes_escargots_tenant ON public.pontes_escargots(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mesures_escargots_tenant ON public.mesures_escargots(tenant_id);

-- Trigger helpers: reuse public.set_updated_at if exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'escargoteres_set_updated_at') THEN
      CREATE TRIGGER escargoteres_set_updated_at BEFORE UPDATE ON public.escargoteres FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'journal_escargots_set_updated_at') THEN
      CREATE TRIGGER journal_escargots_set_updated_at BEFORE UPDATE ON public.journal_escargots FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'pontes_escargots_set_updated_at') THEN
      CREATE TRIGGER pontes_escargots_set_updated_at BEFORE UPDATE ON public.pontes_escargots FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'mesures_escargots_set_updated_at') THEN
      CREATE TRIGGER mesures_escargots_set_updated_at BEFORE UPDATE ON public.mesures_escargots FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
  END IF;
END$$;

-- Notes:
-- 1) tenant_id is nullable to avoid blocking existing data; backfill if needed.
-- 2) After applying, update hooks to include tenant scoping (getTenantId + .eq('tenant_id', ...)).
