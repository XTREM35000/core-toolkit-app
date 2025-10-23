-- Seed for dashboard visuals: tenant, profile, bassin, parc, cohorte, alert, activity
-- Deterministic UUIDs used so repeated runs are safe (ON CONFLICT DO NOTHING)

INSERT INTO public.tenants (id, name, created_at)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Seed Tenant Visuel', now())
ON CONFLICT (id) DO NOTHING;


-- Profile (user)
-- Ensure a corresponding users row exists (profiles.id references users.id)
DO $$
BEGIN
	-- prefer auth.users (supabase) then public.users
	IF to_regclass('auth.users') IS NOT NULL THEN
		INSERT INTO auth.users (id, email, created_at)
		VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'seed.admin@example.com', now())
		ON CONFLICT (id) DO NOTHING;

		IF to_regclass('public.profiles') IS NOT NULL THEN
			-- insert profile with tenant_id if the column exists
			IF to_regclass('pg_attribute') IS NOT NULL AND (
				SELECT column_name FROM information_schema.columns WHERE table_name='profiles' AND column_name='tenant_id' LIMIT 1
			) IS NOT NULL THEN
				INSERT INTO public.profiles (id, full_name, email, created_at, tenant_id)
				VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Test Admin', 'seed.admin@example.com', now(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
				ON CONFLICT (id) DO NOTHING;
			ELSE
				INSERT INTO public.profiles (id, full_name, email, created_at)
				VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Test Admin', 'seed.admin@example.com', now())
				ON CONFLICT (id) DO NOTHING;
			END IF;
		END IF;

	ELSIF to_regclass('public.users') IS NOT NULL THEN
		INSERT INTO public.users (id, email, created_at)
		VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'seed.admin@example.com', now())
		ON CONFLICT (id) DO NOTHING;

		IF to_regclass('public.profiles') IS NOT NULL THEN
			INSERT INTO public.profiles (id, full_name, email, created_at)
			VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Test Admin', 'seed.admin@example.com', now())
			ON CONFLICT (id) DO NOTHING;
		END IF;

	ELSE
		RAISE NOTICE 'No users table found (auth.users or public.users) - skipping users/profiles seed';
	END IF;
END
$$;

-- Ferme (éventuelle table référencée par ferme_id)
DO $$
BEGIN
	IF to_regclass('public.fermes') IS NOT NULL THEN
		-- insert ferme with tenant_id if column exists
		IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fermes' AND column_name='tenant_id') THEN
			INSERT INTO public.fermes (id, nom, created_at, created_by, tenant_id)
			VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ferme Visuelle 1', now(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
			ON CONFLICT (id) DO NOTHING;
		ELSE
			INSERT INTO public.fermes (id, nom, created_at, created_by)
			VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ferme Visuelle 1', now(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
			ON CONFLICT (id) DO NOTHING;
		END IF;
	END IF;
END
$$;

-- Bassin piscicole
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bassins_piscicoles' AND column_name='tenant_id') THEN
		INSERT INTO public.bassins_piscicoles (id, nom, superficie_m2, statut, created_at, ferme_id, tenant_id)
		VALUES ('11111111-1111-1111-1111-111111111111', 'Bassin Visuel 1', 50.0, 'actif', now(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
		ON CONFLICT (id) DO NOTHING;
	ELSE
		INSERT INTO public.bassins_piscicoles (id, nom, superficie_m2, statut, created_at, ferme_id)
		VALUES ('11111111-1111-1111-1111-111111111111', 'Bassin Visuel 1', 50.0, 'actif', now(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
		ON CONFLICT (id) DO NOTHING;
	END IF;
END
$$;

-- Parc hélicicole
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parcs_helicicoles' AND column_name='tenant_id') THEN
		INSERT INTO public.parcs_helicicoles (id, nom, superficie_m2, statut, created_at, ferme_id, tenant_id)
		VALUES ('22222222-2222-2222-2222-222222222222', 'Parc Visuel 1', 30.0, 'actif', now(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
		ON CONFLICT (id) DO NOTHING;
	ELSE
		INSERT INTO public.parcs_helicicoles (id, nom, superficie_m2, statut, created_at, ferme_id)
		VALUES ('22222222-2222-2222-2222-222222222222', 'Parc Visuel 1', 30.0, 'actif', now(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
		ON CONFLICT (id) DO NOTHING;
	END IF;
END
$$;

-- Cohorte escargots referencing the parc
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cohortes_escargots' AND column_name='tenant_id') THEN
		INSERT INTO public.cohortes_escargots (id, parc_id, espece, stade, date_debut, nombre_initial, statut, created_at, tenant_id)
		VALUES ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Helix Aspersa', 'juvenile', now()::date, 120, 'en_elevage', now(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
		ON CONFLICT (id) DO NOTHING;
	ELSE
		INSERT INTO public.cohortes_escargots (id, parc_id, espece, stade, date_debut, nombre_initial, statut, created_at)
		VALUES ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Helix Aspersa', 'juvenile', now()::date, 120, 'en_elevage', now())
		ON CONFLICT (id) DO NOTHING;
	END IF;
END
$$;

-- Alertes (use `title`/`payload` per schema)
INSERT INTO public.alertes (id, title, level, payload, created_at)
VALUES ('44444444-4444-4444-4444-444444444444', 'Humidité basse dans Parc Visuel 1', 'warning', jsonb_build_object('source','parc','parc_id','22222222-2222-2222-2222-222222222222'), now())
ON CONFLICT (id) DO NOTHING;

-- Activity / Logs
INSERT INTO public.activities (id, action, created_by, created_at, metadata)
VALUES ('55555555-5555-5555-5555-555555555555', 'Seed visual activity', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', now(), jsonb_build_object('note', 'seeded for dashboard visuals'))
ON CONFLICT (id) DO NOTHING;
