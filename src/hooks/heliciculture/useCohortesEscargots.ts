import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CohorteEscargot {
  id: string;
  nom?: string;
  espece?: string;
  nombre_initial?: number;
  statut?: string;
  parc_id?: string | null;
  created_at?: string;
}

const KEY = 'mock:cohortes_escargots';
function readMock(): CohorteEscargot[] { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function writeMock(items: CohorteEscargot[]) { localStorage.setItem(KEY, JSON.stringify(items)); }

export async function fetchCohortes(): Promise<CohorteEscargot[]> {
  try {
    const { data, error } = await (supabase as any).from('cohortes_escargots').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as CohorteEscargot[];
  } catch {
    return readMock();
  }
}

export async function createCohorte(payload: Partial<CohorteEscargot>): Promise<CohorteEscargot> {
  try {
    const { data, error } = await (supabase as any).from('cohortes_escargots').insert([payload]).select().single();
    if (error) throw error;
    return data as CohorteEscargot;
  } catch {
    const items = readMock();
    const item = { id: String(Date.now()), ...payload, created_at: new Date().toISOString() } as CohorteEscargot;
    items.unshift(item); writeMock(items); return item;
  }
}

export async function updateCohorte(id: string, payload: Partial<CohorteEscargot>): Promise<CohorteEscargot> {
  try {
    const { data, error } = await (supabase as any).from('cohortes_escargots').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data as CohorteEscargot;
  } catch {
    const items = readMock(); const idx = items.findIndex(i => i.id === id); if (idx >= 0) items[idx] = { ...items[idx], ...payload } as CohorteEscargot; writeMock(items); return items[idx];
  }
}

export async function deleteCohorte(id: string): Promise<void> {
  try { const { error } = await (supabase as any).from('cohortes_escargots').delete().eq('id', id); if (error) throw error; } catch { const items = readMock().filter(i => i.id !== id); writeMock(items); }
}

export function useCohortesList() { return useQuery<CohorteEscargot[], Error>({ queryKey: ['cohortes_escargots'], queryFn: fetchCohortes }); }
export function useCreateCohorte() { const qc = useQueryClient(); return useMutation<CohorteEscargot, Error, Partial<CohorteEscargot>>({ mutationFn: createCohorte, onSuccess: () => qc.invalidateQueries({ queryKey: ['cohortes_escargots'] }) }); }
export function useUpdateCohorte() { const qc = useQueryClient(); return useMutation<CohorteEscargot, Error, { id: string; payload: Partial<CohorteEscargot> }>({ mutationFn: ({ id, payload }) => updateCohorte(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['cohortes_escargots'] }) }); }
export function useDeleteCohorte() { const qc = useQueryClient(); return useMutation<void, Error, string>({ mutationFn: (id: string) => deleteCohorte(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['cohortes_escargots'] }) }); }
