-- Add missing columns and RLS policies used by PlanSelectionModal
-- 1) Add user_id, plan_id and period fields to subscriptions to support client upserts
-- 2) Add selected_plan to profiles so frontend can save the chosen plan type
-- 3) Add INSERT policy for subscription_plans to allow authenticated clients to seed default plans
-- 4) Tighten subscriptions RLS to allow users to view/manage their own subscriptions by user_id

-- 1) subscriptions alterations
ALTER TABLE IF EXISTS public.subscriptions
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE;

-- Ensure there is a status column with appropriate type and default
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='subscriptions' AND column_name='status') THEN
    ALTER TABLE public.subscriptions
      ADD COLUMN status public.subscription_status DEFAULT 'active';
  END IF;
END$$;

-- Create a unique index for user_id + plan_id to support upsert on (user_id, plan_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'subscriptions' AND indexname = 'subscriptions_user_plan_idx'
  ) THEN
    CREATE UNIQUE INDEX subscriptions_user_plan_idx ON public.subscriptions (user_id, plan_id);
  END IF;
END$$;

-- 2) profiles alterations
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS selected_plan TEXT;

-- 3) subscription_plans RLS: allow authenticated users to INSERT seed plans from the client
ALTER TABLE IF EXISTS public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert plans (used by client to seed defaults).
-- This intentionally allows only authenticated users to add plans. If you prefer
-- to seed plans from server-side, remove this policy and seed via migrations.
DROP POLICY IF EXISTS "Authenticated users can insert plans" ON public.subscription_plans;
CREATE POLICY "Authenticated users can insert plans"
  ON public.subscription_plans
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow super_admins to manage all plans (update/delete)
DROP POLICY IF EXISTS "Super admins can manage plans" ON public.subscription_plans;
CREATE POLICY "Super admins can manage plans"
  ON public.subscription_plans
  FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- 4) subscriptions RLS: expand existing policies (if any) to allow users to manage their own subscriptions via user_id
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to view subscriptions where they are the owner (user_id)
DROP POLICY IF EXISTS "Users can view their tenant subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their subscriptions by user_id"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid() OR tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

-- Allow users to insert/update their own subscriptions (used by client upsert)
DROP POLICY IF EXISTS "Users can manage their subscriptions" ON public.subscriptions;
CREATE POLICY "Users can manage their subscriptions"
  ON public.subscriptions FOR INSERT, UPDATE
  WITH CHECK (user_id = auth.uid());

-- Keep existing super_admins full access
DROP POLICY IF EXISTS "Super admins can manage all subscriptions" ON public.subscriptions;
CREATE POLICY "Super admins can manage all subscriptions"
  ON public.subscriptions FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- End of migration
