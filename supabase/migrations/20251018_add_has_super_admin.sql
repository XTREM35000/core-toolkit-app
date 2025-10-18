-- Create a SECURITY DEFINER function that returns whether a super_admin exists
-- This can be called by the client without worrying about RLS blocking the check.

CREATE OR REPLACE FUNCTION public.has_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'super_admin');
$$;
