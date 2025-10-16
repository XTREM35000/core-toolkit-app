-- PATCH SQL : Ajout des colonnes manquantes à la table profiles et adaptation du trigger

-- Ajout des colonnes pour le super admin
ALTER TABLE public.profiles
  ADD COLUMN first_name TEXT,
  ADD COLUMN last_name TEXT,
  ADD COLUMN phone TEXT,
  ADD COLUMN avatar_url TEXT,
  ADD COLUMN email_verified BOOLEAN DEFAULT false,
  ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;

-- Adaptation du trigger pour insérer les nouveaux champs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    phone,
    avatar_url,
    email_verified,
    onboarding_completed
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    false,
    false
  );
  RETURN new;
END;
$$;

-- Vérification : à exécuter dans Supabase SQL Editor ou CLI
-- ALTER TABLE public.profiles ...
-- CREATE OR REPLACE FUNCTION public.handle_new_user ...
