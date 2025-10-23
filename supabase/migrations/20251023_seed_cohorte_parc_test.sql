-- Test seed: insert a single cohortes_escargots row referencing the test parc
INSERT INTO public.cohortes_escargots (id, parc_id, espece, stade, date_debut, nombre_initial, created_at)
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Helix Aspersa', 'juvenile', now()::date, 50, now())
ON CONFLICT (id) DO NOTHING;
