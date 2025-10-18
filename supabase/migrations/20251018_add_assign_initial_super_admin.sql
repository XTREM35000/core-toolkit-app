-- Create a SECURITY DEFINER function to safely assign the initial super_admin role
-- This function should be executed as a privileged role and will perform checks
-- to ensure there is no existing super_admin before inserting.

CREATE OR REPLACE FUNCTION public.assign_initial_super_admin(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent accidental assignment if a super_admin already exists
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'super_admin') THEN
    RAISE EXCEPTION 'A super_admin already exists';
  END IF;

  -- Ensure the target user exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_uuid) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Insert the super_admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_uuid, 'super_admin');
END;
$$;