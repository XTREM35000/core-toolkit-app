-- Seed subscription_plans with SeeS pricing plans
-- SeeS plans: 10 000 F / month, 100 000 F / year (with startup payment info recorded separately if needed)
-- Ensure there is a unique constraint/index on the `name` column so ON CONFLICT (name) works.
-- Use CREATE UNIQUE INDEX IF NOT EXISTS which is safe/idempotent for existing DBs.
CREATE UNIQUE INDEX IF NOT EXISTS subscription_plans_name_unique_idx ON public.subscription_plans (name);

INSERT INTO public.subscription_plans (id, name, type, price, duration_days, features, created_at, is_active)
VALUES
  (gen_random_uuid(), 'SeeS Monthly', 'monthly', 10000, 30, '{"description": "SeeS - monthly plan", "startup_payment": 50000, "startup_non_refundable": true}'::jsonb, now(), true),
  (gen_random_uuid(), 'SeeS Annual', 'annual', 100000, 365, '{"description": "SeeS - annual plan", "startup_payment": 50000, "startup_non_refundable": true, "note": "Requires 2x startup payments of 50,000 F"}'::jsonb, now(), true)
ON CONFLICT (name) DO UPDATE
  SET price = EXCLUDED.price,
      duration_days = EXCLUDED.duration_days,
      features = EXCLUDED.features,
      is_active = EXCLUDED.is_active;
