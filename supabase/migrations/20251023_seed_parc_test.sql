-- Test seed: insert a single parcs_helicicoles row for local testing
INSERT INTO public.parcs_helicicoles (id, nom, superficie_m2, statut, created_at)
VALUES ('11111111-1111-1111-1111-111111111111', 'Parc test automatique', 100.0, 'actif', now())
ON CONFLICT (id) DO NOTHING;
