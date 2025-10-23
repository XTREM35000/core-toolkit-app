import { supabase } from '@/integrations/supabase/client';

let cachedTenantId: string | null | undefined = undefined;

export async function getTenantId(): Promise<string | null> {
  if (cachedTenantId !== undefined) return cachedTenantId ?? null;
  try {
    const resp = await (supabase as any).auth.getUser();
    const user = resp?.data?.user ?? null;
    if (!user) { cachedTenantId = null; return null; }
    const { data: profile, error } = await (supabase as any).from('profiles').select('tenant_id').eq('id', user.id).single();
    if (error) { cachedTenantId = null; return null; }
    cachedTenantId = profile?.tenant_id ?? null;
    return cachedTenantId;
  } catch (err) {
    cachedTenantId = null;
    return null;
  }
}
