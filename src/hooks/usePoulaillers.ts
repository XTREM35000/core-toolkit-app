import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTenantId } from '@/services/tenantService';

type Poulailler = { id: string; name: string; created_at?: string; tenant_id?: string };

export default function usePoulaillers() {
  const [items, setItems] = useState<Poulailler[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const tenantId = await getTenantId();
      let qb: any = (supabase as any).from('poulaillers').select('*').order('created_at', { ascending: false });
      if (tenantId) qb = qb.eq('tenant_id', tenantId);
      const { data, error } = await qb;
      if (error) throw error;
      setItems(data ?? []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const create = async (payload: Partial<Poulailler>) => {
    const now = new Date().toISOString();
    const tenantId = await getTenantId();
    const toInsert = { ...payload, created_at: now } as any;
    if (tenantId) toInsert.tenant_id = tenantId;
    const { data, error } = await (supabase as any).from('poulaillers').insert(toInsert).select();
    if (error) throw error;
    const created = data?.[0];
    setItems((s) => (created ? [created, ...s] : s));
    return created;
  };

  const update = async (id: string, payload: Partial<Poulailler>) => {
    const { data, error } = await (supabase as any).from('poulaillers').update(payload).eq('id', id).select();
    if (error) throw error;
    const updated = data?.[0];
    setItems((s) => s.map((it) => (it.id === id ? updated : it)));
    return updated;
  };

  const remove = async (id: string) => {
    const { data, error } = await (supabase as any).from('poulaillers').delete().eq('id', id).select();
    if (error) throw error;
    setItems((s) => s.filter((it) => it.id !== id));
    return data;
  };

  return { items, loading, error, fetch, create, update, remove };
}

