-- Create a SECURITY DEFINER function to let clients check if a super_admin exists
-- This avoids the need for unauthenticated clients to SELECT from RLS-protected tables

CREATE OR REPLACE FUNCTION public.exists_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- Check profiles.role first (faster)
    SELECT 1 FROM public.profiles WHERE role = 'super_admin'
  )
  OR EXISTS (
    -- Fallback to user_roles if roles stored separately
    SELECT 1 FROM public.user_roles WHERE role = 'super_admin'
  );
$$;

-- Grant execute to anon and authenticated roles so client-side can call it
GRANT EXECUTE ON FUNCTION public.exists_super_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.exists_super_admin() TO authenticated;
