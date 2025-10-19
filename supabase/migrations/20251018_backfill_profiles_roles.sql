-- Backfill profiles.role from user_roles for existing users.
-- This is safe to run multiple times; it only sets profiles.role where it is NULL.

BEGIN;

UPDATE public.profiles p
SET role = ur.role
FROM (
  SELECT user_id, role
  FROM public.user_roles
  ORDER BY created_at ASC NULLS LAST
) ur
WHERE p.id = ur.user_id
  AND p.role IS NULL;

COMMIT;
