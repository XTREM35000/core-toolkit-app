-- Migration: create workflow tables for fournisseurs, paiements, ventes, encaissements

CREATE TABLE IF NOT EXISTS public.commande_fournisseurs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name text NOT NULL,
  supplier_id uuid,
  quantity numeric NOT NULL,
  unit_price numeric NOT NULL,
  total numeric GENERATED ALWAYS AS (quantity * unit_price) STORED,
  status text NOT NULL DEFAULT 'Commandé',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.paiements_fournisseurs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commande_id uuid REFERENCES public.commande_fournisseurs(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  method text,
  paid_at timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ventes_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text,
  client_id uuid,
  item text,
  quantity numeric NOT NULL,
  unit_price numeric NOT NULL,
  total numeric GENERATED ALWAYS AS (quantity * unit_price) STORED,
  status text NOT NULL DEFAULT 'En attente',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.encaissements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vente_id uuid REFERENCES public.ventes_clients(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  method text,
  received_at timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Optional indexes
CREATE INDEX IF NOT EXISTS idx_commande_fournisseurs_status ON public.commande_fournisseurs (status);
CREATE INDEX IF NOT EXISTS idx_ventes_clients_status ON public.ventes_clients (status);
