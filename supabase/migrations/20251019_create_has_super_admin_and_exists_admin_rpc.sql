-- Create compatibility RPCs used by the frontend
-- has_super_admin: compatibility name (some clients call this)
-- exists_admin: check if any admin exists (profiles.role OR user_roles)

CREATE OR REPLACE FUNCTION public.has_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE role = 'super_admin'
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.exists_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE role = 'admin'
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  );
$$;

-- Grant execute to anon and authenticated so client can call them
GRANT EXECUTE ON FUNCTION public.has_super_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.has_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.exists_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.exists_admin() TO authenticated;
