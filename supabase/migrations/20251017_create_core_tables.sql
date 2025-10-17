-- Migration initiale: créer tables de base pour AquaHelix Manager Pro

BEGIN;

CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  email text,
  phone text,
  tenant_id uuid REFERENCES tenants(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  address jsonb,
  plan_type text,
  status text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_organization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  organization_id uuid REFERENCES organisations(id),
  role text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS animaux (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  species text,
  cohort_id uuid,
  birth_date date,
  initial_biomass numeric,
  current_biomass numeric,
  mortality_rate numeric,
  tenant_id uuid REFERENCES tenants(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cultures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  type text,
  location jsonb,
  tenant_id uuid REFERENCES tenants(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id),
  role text,
  tenant_id uuid REFERENCES tenants(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fermes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  location jsonb,
  tenant_id uuid REFERENCES tenants(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text,
  performed_by uuid REFERENCES profiles(id),
  target_id uuid,
  data jsonb,
  performed_at timestamptz DEFAULT now(),
  tenant_id uuid REFERENCES tenants(id)
);

CREATE TABLE IF NOT EXISTS parcelles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  area numeric,
  location jsonb,
  tenant_id uuid REFERENCES tenants(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text,
  quantity numeric,
  unit text,
  location jsonb,
  tenant_id uuid REFERENCES tenants(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  plan text,
  status text,
  started_at timestamptz,
  ends_at timestamptz
);

CREATE TABLE IF NOT EXISTS user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id),
  permission text,
  granted_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

COMMIT;
