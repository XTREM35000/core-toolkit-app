export type AppRole = 'super_admin' | 'admin' | 'user';

export type SubscriptionStatus = 'active' | 'inactive' | 'trial' | 'cancelled';

export type ThemeName = 'whatsapp' | 'apple';

import type { Json } from '@/integrations/supabase/types';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  role?: string | null;
  roles?: AppRole[]; // Roles from user_roles table (secure)
  // permissions come from the database as a Json value; keep it typed instead of `any`
  permissions: Json | null;
  tenant_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  plan: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  tenant_id: string;
  plan: string;
  status: SubscriptionStatus;
  price?: number;
  billing_period: string;
  started_at: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InitStatus {
  step: 'checking' | 'checked';
  hasSuperAdmin: boolean;
  hasAdmin: boolean;
  showDevModal: boolean;
  showSuperAdminModal: boolean;
  showAdminModal: boolean;
  showAuthModal: boolean;
}
