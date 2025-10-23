-- Migration: create recoltes_miel and captures tables

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

-- Attach triggers for updated_at if function exists
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
