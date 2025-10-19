-- Create subscription_plans table used by PlanSelectionModal
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  duration_days INTEGER DEFAULT 7,
  features JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read plans"
  ON public.subscription_plans FOR SELECT
  USING (true);
