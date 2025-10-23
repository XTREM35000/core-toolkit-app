-- Seed data for Héliciculture (test/demo)
-- Generated: 2025-10-23
-- This script creates a random tenant UUID and inserts sample rows into the
-- heliciculture tables (escargoteres, journal_escargots, pontes_escargots, mesures_escargots).
-- Run this in your Supabase DB (psql or supabase migrations). Adjust tenant_uuid
-- if you want to use a specific tenant.

DO $$
DECLARE
  tenant_uuid UUID := gen_random_uuid();
BEGIN
  RAISE NOTICE 'Seeding heliciculture test data. Tenant ID: %', tenant_uuid;

  -- Ensure the tenant exists so foreign key constraints against tenants pass.
  -- If your project uses a different tenants table schema, adjust the columns accordingly.
  INSERT INTO public.tenants (id, name, created_at)
  VALUES (tenant_uuid, 'Seed tenant for heliciculture tests', now())
  ON CONFLICT (id) DO NOTHING;

  -- ===========================================
  -- 🏠 TABLE: escargoteres
  -- ===========================================
  INSERT INTO public.escargoteres (nom, type, dimensions, substrat, date_installation, tenant_id, created_at)
  VALUES
    ('Escargotière Jardin Arrière', 'Reproduction', '2m x 1m x 0.5m', 'Tourbe de coco + terre végétale', '2025-10-01'::date, tenant_uuid, now()),
    ('Escargotière Ombrière Nord', 'Croissance', '3m x 1.5m x 0.6m', 'Terreau humide + feuilles papayer', '2025-10-05'::date, tenant_uuid, now()),
    ('Escargotière Test Intérieur', 'Observation', '1m x 1m x 0.4m', 'Tourbe + sable fin', '2025-10-08'::date, tenant_uuid, now());

  -- ===========================================
  -- 📓 TABLE: journal_escargots
  -- ===========================================
  INSERT INTO public.journal_escargots (date, activite, observations, cohorte_id, escargotiere_id, tenant_id, created_at)
  VALUES
    ('2025-10-10'::date, 'Nettoyage du bac et changement de substrat', 'Humidité stable, aucun décès observé', NULL, NULL, tenant_uuid, now()),
    ('2025-10-15'::date, 'Nourrissage (feuilles papayer + mangue)', 'Bonne activité des escargots', NULL, NULL, tenant_uuid, now()),
    ('2025-10-20'::date, 'Arrosage et ajout de coquilles pilées', 'Prévention carences calcium', NULL, NULL, tenant_uuid, now());

  -- ===========================================
  -- 🥚 TABLE: pontes_escargots
  -- ===========================================
  INSERT INTO public.pontes_escargots (cohorte_id, cohorte_nom, date_ponte, nb_oeufs, observation, tenant_id, created_at)
  VALUES
    (NULL, 'Cohorte Novembre 2025', '2025-12-10'::date, 240, 'Première ponte réussie après pluie', tenant_uuid, now()),
    (NULL, 'Cohorte Novembre 2025', '2026-01-18'::date, 320, 'Ponte abondante, substrat bien humide', tenant_uuid, now()),
    (NULL, 'Cohorte Décembre 2025', '2026-02-22'::date, 180, 'Oeufs plus petits, conditions un peu sèches', tenant_uuid, now());

  -- ===========================================
  -- 📏 TABLE: mesures_escargots
  -- ===========================================
  INSERT INTO public.mesures_escargots (date, poids_moyen, taux_survie, cohorte_id, cohorte_nom, tenant_id, created_at)
  VALUES
    ('2026-01-15'::date, 40.5, 96.2, NULL, 'Cohorte Novembre 2025', tenant_uuid, now()),
    ('2026-03-01'::date, 72.8, 92.5, NULL, 'Cohorte Novembre 2025', tenant_uuid, now()),
    ('2026-04-10'::date, 110.0, 90.0, NULL, 'Cohorte Décembre 2025', tenant_uuid, now());

  RAISE NOTICE 'Heliciculture seed complete.';
END$$;
