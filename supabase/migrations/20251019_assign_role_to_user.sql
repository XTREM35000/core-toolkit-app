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
  -- Map app_role values to profiles.role values expected by profiles_role_check
  -- (profiles.role allowed values: 'super_admin', 'tenant_admin', 'user', 'developer')
  IF _role = 'super_admin' THEN
    UPDATE public.profiles
    SET role = 'super_admin'
    WHERE id = _user_id AND (role IS NULL OR role = 'user');
  ELSIF _role = 'admin' THEN
    -- Translate 'admin' into the profiles enum value for tenant administrators
    UPDATE public.profiles
    SET role = 'tenant_admin'
    WHERE id = _user_id AND (role IS NULL OR role = 'user');
  ELSE
    UPDATE public.profiles
    SET role = 'user'
    WHERE id = _user_id AND (role IS NULL OR role = 'user');
  END IF;
END;
$$;

-- Ensure RPC is callable by client roles (if your flow requires client-side calls)
GRANT EXECUTE ON FUNCTION public.assign_role_to_user(uuid, app_role) TO anon;
GRANT EXECUTE ON FUNCTION public.assign_role_to_user(uuid, app_role) TO authenticated;
