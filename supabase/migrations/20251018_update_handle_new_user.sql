-- Replace the trigger function to ensure profiles.role is set on user creation
-- This migration intentionally only replaces the function body and does NOT recreate types or tables.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create the profile if it does not exist already (signup path should create it; be idempotent)
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Ensure a default role is set on profile for quick checks, but do not overwrite an explicit role
  UPDATE public.profiles
  SET role = 'user'
  WHERE id = new.id
    AND (role IS NULL);

  RETURN new;
END;
$$;
