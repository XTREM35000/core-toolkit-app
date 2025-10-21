-- Migration: aquaculture tables (bassins, cohortes, parcs, stock_aliments)

create table if not exists public.bassins_piscicoles (
  id uuid not null default gen_random_uuid (),
  ferme_id uuid null,
  nom text not null,
  type_bassin text null,
  volume_m3 numeric null,
  profondeur_m numeric null,
  superficie_m2 numeric null,
  espece_principale text null,
  temperature_eau numeric null,
  ph_eau numeric null,
  oxygene_mg_l numeric null,
  statut text null default 'actif'::text,
  created_at timestamptz null default now(),
  updated_at timestamptz null default now(),
  created_by uuid null,
  constraint bassins_piscicoles_pkey primary key (id)
);

create index IF not exists idx_bassins_ferme_id on public.bassins_piscicoles using btree (ferme_id);
create index IF not exists idx_bassins_statut on public.bassins_piscicoles using btree (statut);

create table if not exists public.cohortes_escargots (
  id uuid not null default gen_random_uuid (),
  parc_id uuid null,
  espece text not null default 'Helix Aspersa'::text,
  stade text not null,
  date_debut date not null,
  nombre_initial integer not null,
  poids_initial_g numeric null,
  nombre_actuel integer null,
  poids_actuel_g numeric null,
  taux_mortalite numeric null default 0,
  date_recolte_prevue date null,
  statut text null default 'en_elevage'::text,
  created_at timestamptz null default now(),
  updated_at timestamptz null default now(),
  created_by uuid null,
  constraint cohortes_escargots_pkey primary key (id)
);

create table if not exists public.cohortes_poissons (
  id uuid not null default gen_random_uuid (),
  bassin_id uuid null,
  espece text not null,
  date_mise_en_charge date not null,
  nombre_initial integer not null,
  poids_initial_kg numeric not null,
  nombre_actuel integer null,
  biomasse_actuelle_kg numeric null,
  taux_mortalite numeric null default 0,
  date_recolte_prevue date null,
  statut text null default 'en_elevage'::text,
  created_at timestamptz null default now(),
  updated_at timestamptz null default now(),
  created_by uuid null,
  constraint cohortes_poissons_pkey primary key (id)
);

create index IF not exists idx_cohortes_poissons_bassin_id on public.cohortes_poissons using btree (bassin_id);
create index IF not exists idx_cohortes_poissons_statut on public.cohortes_poissons using btree (statut);

create table if not exists public.conditions_environnement (
  id uuid not null default gen_random_uuid (),
  parc_id uuid null,
  date_mesure timestamptz null default now(),
  temperature_air_c numeric null,
  hygometrie_pct numeric null,
  temperature_sol_c numeric null,
  luminosite_lux numeric null,
  ventilation_ok boolean null default true,
  mesure_par uuid null,
  notes text null,
  created_at timestamptz null default now(),
  created_by uuid null,
  constraint conditions_environnement_pkey primary key (id)
);

create table if not exists public.parcs_helicicoles (
  id uuid not null default gen_random_uuid (),
  ferme_id uuid null,
  nom text not null,
  type_parc text null,
  superficie_m2 numeric null,
  capacite_max integer null,
  temperature_air numeric null,
  hygometrie numeric null,
  espece_principale text null default 'Helix Aspersa'::text,
  statut text null default 'actif'::text,
  created_at timestamptz null default now(),
  updated_at timestamptz null default now(),
  created_by uuid null,
  constraint parcs_helicicoles_pkey primary key (id)
);

create table if not exists public.stock_aliments (
  id uuid not null default gen_random_uuid (),
  item_name text null,
  quantity integer null default 0,
  unit text null,
  created_at timestamptz null default now(),
  updated_at timestamptz null default now(),
  constraint stock_aliments_pkey primary key (id)
);
