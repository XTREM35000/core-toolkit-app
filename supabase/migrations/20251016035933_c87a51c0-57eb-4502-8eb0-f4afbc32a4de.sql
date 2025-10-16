-- Create user_roles table (separate from profiles for security)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin'
    )
  );

-- Update has_role function to use user_roles table
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Add default 'user' role for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  
  -- Add default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;