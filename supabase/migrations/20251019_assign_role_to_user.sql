-- SECURITY DEFINER function to assign a role to a user and sync profiles.role
CREATE OR REPLACE FUNCTION public.assign_role_to_user(_user_id uuid, _role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into user_roles if not exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Sync profiles.role if empty
  UPDATE public.profiles
  SET role = _role
  WHERE id = _user_id AND (role IS NULL OR role = 'user');
END;
$$;
