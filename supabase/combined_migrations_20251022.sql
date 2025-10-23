-- Combined migrations (2025-10-22)
-- This file concatenates the module tables and the recoltes/captures migrations.
-- Usage: paste into Supabase SQL editor, or save and run via supabase CLI.

-- ===== modules tables =====
CREATE TABLE IF NOT EXISTS public.poulaillers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_poulaillers_tenant ON public.poulaillers(tenant_id);

CREATE TABLE IF NOT EXISTS public.parcelles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_parcelles_tenant ON public.parcelles(tenant_id);

CREATE TABLE IF NOT EXISTS public.clapiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_clapiers_tenant ON public.clapiers(tenant_id);

CREATE TABLE IF NOT EXISTS public.ruchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ruchers_tenant ON public.ruchers(tenant_id);

CREATE TABLE IF NOT EXISTS public.etables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_etables_tenant ON public.etables(tenant_id);

CREATE TABLE IF NOT EXISTS public.zones_peche (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  geometry jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_zones_peche_tenant ON public.zones_peche(tenant_id);

CREATE TABLE IF NOT EXISTS public.cohortes_poulets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poulailler_id uuid REFERENCES public.poulaillers(id) ON DELETE CASCADE,
  name text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.troupeaux (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  etable_id uuid REFERENCES public.etables(id) ON DELETE CASCADE,
  name text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'poulaillers_set_updated_at') THEN
    CREATE TRIGGER poulaillers_set_updated_at BEFORE UPDATE ON public.poulaillers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'parcelles_set_updated_at') THEN
    CREATE TRIGGER parcelles_set_updated_at BEFORE UPDATE ON public.parcelles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'clapiers_set_updated_at') THEN
    CREATE TRIGGER clapiers_set_updated_at BEFORE UPDATE ON public.clapiers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'ruchers_set_updated_at') THEN
    CREATE TRIGGER ruchers_set_updated_at BEFORE UPDATE ON public.ruchers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'etables_set_updated_at') THEN
    CREATE TRIGGER etables_set_updated_at BEFORE UPDATE ON public.etables FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'zones_peche_set_updated_at') THEN
    CREATE TRIGGER zones_peche_set_updated_at BEFORE UPDATE ON public.zones_peche FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'cohortes_poulets_set_updated_at') THEN
    CREATE TRIGGER cohortes_poulets_set_updated_at BEFORE UPDATE ON public.cohortes_poulets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'troupeaux_set_updated_at') THEN
    CREATE TRIGGER troupeaux_set_updated_at BEFORE UPDATE ON public.troupeaux FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

-- ===== recoltes & captures =====
CREATE TABLE IF NOT EXISTS public.recoltes_miel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  rucher_id uuid REFERENCES public.ruchers(id) ON DELETE SET NULL,
  name text NOT NULL,
  quantity numeric DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_recoltes_miel_tenant ON public.recoltes_miel(tenant_id);

CREATE TABLE IF NOT EXISTS public.captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  zone_id uuid REFERENCES public.zones_peche(id) ON DELETE SET NULL,
  description text NOT NULL,
  weight numeric DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_captures_tenant ON public.captures(tenant_id);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'recoltes_miel_set_updated_at') THEN
      CREATE TRIGGER recoltes_miel_set_updated_at BEFORE UPDATE ON public.recoltes_miel FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'captures_set_updated_at') THEN
      CREATE TRIGGER captures_set_updated_at BEFORE UPDATE ON public.captures FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
  END IF;
END$$;

-- End of combined migrations
