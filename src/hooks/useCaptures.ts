import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTenantId } from '@/services/tenantService';

type Capture = { id: string; description: string; weight?: number; created_at?: string };

export default function useCaptures() {
  const [items, setItems] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const tenantId = await getTenantId();
      if (tenantId) {
        const { data, error } = await (supabase as any)
          .from('captures_peche')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        const mapped = (data ?? []).map((c: any) => ({
          id: c.id,
          description: c.nom ?? c.description,
          weight: c.quantite ?? c.weight,
          created_at: c.created_at,
        }));
        setItems(mapped);
        setLoading(false);
        return;
      }
      const { data, error } = await (supabase as any).from('captures_peche').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      const mapped = (data ?? []).map((c: any) => ({
        id: c.id,
        description: c.nom ?? c.description,
        weight: c.quantite ?? c.weight,
        created_at: c.created_at,
      }));
      setItems(mapped);
    } catch (err) { setError(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const create = async (payload: Partial<Capture>) => {
    const now = new Date().toISOString();
    const toInsert: any = {
      nom: payload.description,
      quantite: payload.weight ?? 0,
      created_at: now,
    };
    const tenantId = await getTenantId();
    if (tenantId) toInsert.tenant_id = tenantId;
    const { data, error } = await (supabase as any).from('captures_peche').insert(toInsert).select();
    if (error) throw error;
    const c = data?.[0];
    const created = { id: c.id, description: c.nom, weight: c.quantite, created_at: c.created_at };
    setItems((s) => (created ? [created, ...s] : s));
    return created;
  };

  const update = async (id: string, payload: Partial<Capture>) => {
    const toUpdate: any = {};
    if (payload.description !== undefined) toUpdate.nom = payload.description;
    if (payload.weight !== undefined) toUpdate.quantite = payload.weight;
    const tenantId = await getTenantId();
    let query = (supabase as any).from('captures_peche').update(toUpdate).eq('id', id);
    if (tenantId) query = query.eq('tenant_id', tenantId);
    const { data, error } = await query.select();
    if (error) throw error;
    const c = data?.[0];
    const updated = { id: c.id, description: c.nom, weight: c.quantite, created_at: c.created_at };
    setItems((s) => s.map((it) => (it.id === id ? updated : it)));
    return updated;
  };

  const remove = async (id: string) => {
    const tenantId = await getTenantId();
    let query = (supabase as any).from('captures_peche').delete().eq('id', id);
    if (tenantId) query = query.eq('tenant_id', tenantId);
    const { data, error } = await query.select();
    if (error) throw error;
    setItems((s) => s.filter((it) => it.id !== id));
    return data;
  };

  return { items, loading, error, fetch, create, update, remove };
}
