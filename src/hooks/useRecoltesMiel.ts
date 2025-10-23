import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTenantId } from '@/services/tenantService';

type Recolte = { id: string; name: string; quantity?: number; created_at?: string };

export default function useRecoltesMiel() {
  const [items, setItems] = useState<Recolte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const tenantId = await getTenantId();
      const { data, error } = await (supabase as any)
        .from('recoltes_miel')
        .select('*')
        .order('created_at', { ascending: false })
        .then((q: any) => q);
      // If tenantId is available, refetch with tenant filter
      if (tenantId) {
        const { data: td, error: terr } = await (supabase as any)
          .from('recoltes_miel')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false });
        if (terr) throw terr;
        if (td) {
          // override
          const mapped = (td ?? []).map((r: any) => ({
            id: r.id,
            name: r.nom ?? r.name,
            quantity: r.quantite ?? r.quantity,
            created_at: r.created_at,
          }));
          setItems(mapped);
          setLoading(false);
          return;
        }
      }
      if (error) throw error;
      if (error) throw error;
      // Map DB columns to UI-friendly shape
      const mapped = (data ?? []).map((r: any) => ({
        id: r.id,
        name: r.nom ?? r.name,
        quantity: r.quantite ?? r.quantity,
        created_at: r.created_at,
      }));
      setItems(mapped);
    } catch (err) { setError(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const create = async (payload: Partial<Recolte>) => {
    const now = new Date().toISOString();
    const toInsert: any = {
      nom: payload.name,
      quantite: payload.quantity ?? 0,
      created_at: now,
    };
    const tenantId = await getTenantId();
    if (tenantId) toInsert.tenant_id = tenantId;
    const { data, error } = await (supabase as any).from('recoltes_miel').insert(toInsert).select();
    if (error) throw error;
    const r = data?.[0];
    const created = { id: r.id, name: r.nom, quantity: r.quantite, created_at: r.created_at };
    setItems((s) => (created ? [created, ...s] : s));
    return created;
  };

  const update = async (id: string, payload: Partial<Recolte>) => {
    const toUpdate: any = {};
    if (payload.name !== undefined) toUpdate.nom = payload.name;
    if (payload.quantity !== undefined) toUpdate.quantite = payload.quantity;
    const tenantId = await getTenantId();
    let query = (supabase as any).from('recoltes_miel').update(toUpdate).eq('id', id);
    if (tenantId) query = query.eq('tenant_id', tenantId);
    const { data, error } = await query.select();
    if (error) throw error;
    const r = data?.[0];
    const updated = { id: r.id, name: r.nom, quantity: r.quantite, created_at: r.created_at };
    setItems((s) => s.map((it) => (it.id === id ? updated : it)));
    return updated;
  };

  const remove = async (id: string) => {
    const tenantId = await getTenantId();
    let query = (supabase as any).from('recoltes_miel').delete().eq('id', id);
    if (tenantId) query = query.eq('tenant_id', tenantId);
    const { data, error } = await query.select();
    if (error) throw error;
    setItems((s) => s.filter((it) => it.id !== id));
    return data;
  };

  return { items, loading, error, fetch, create, update, remove };
}
