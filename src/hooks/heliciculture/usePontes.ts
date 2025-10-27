import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Ponte {
  id: string;
  cohorte_id?: string | null;
  date?: string;
  nombre_oeufs?: number;
  notes?: string;
  created_at?: string;
}

const KEY = 'mock:pontes';
function readMock(): Ponte[] { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function writeMock(items: Ponte[]) { localStorage.setItem(KEY, JSON.stringify(items)); }

export async function fetchPontes(): Promise<Ponte[]> {
  try {
    const { data, error } = await (supabase as any).from('pontes_escargots').select('*').order('date', { ascending: false });
    if (error) throw error;
    return data as Ponte[];
  } catch {
    return readMock();
  }
}

export async function createPonte(payload: Partial<Ponte>): Promise<Ponte> {
  try {
    const { data, error } = await (supabase as any).from('pontes_escargots').insert([payload]).select().single();
    if (error) throw error;
    return data as Ponte;
  } catch {
    const items = readMock(); const item = { id: String(Date.now()), ...payload, created_at: new Date().toISOString() } as Ponte; items.unshift(item); writeMock(items); return item;
  }
}

export async function updatePonte(id: string, payload: Partial<Ponte>): Promise<Ponte> {
  try { const { data, error } = await (supabase as any).from('pontes_escargots').update(payload).eq('id', id).select().single(); if (error) throw error; return data as Ponte; } catch { const items = readMock(); const idx = items.findIndex(i => i.id === id); if (idx >= 0) items[idx] = { ...items[idx], ...payload } as Ponte; writeMock(items); return items[idx]; }
}

export async function deletePonte(id: string): Promise<void> { try { const { error } = await (supabase as any).from('pontes_escargots').delete().eq('id', id); if (error) throw error; } catch { const items = readMock().filter(i => i.id !== id); writeMock(items); } }

export function usePontesList() { return useQuery<Ponte[], Error>({ queryKey: ['pontes_escargots'], queryFn: fetchPontes }); }
export function useCreatePonte() { const qc = useQueryClient(); return useMutation<Ponte, Error, Partial<Ponte>>({ mutationFn: createPonte, onSuccess: () => qc.invalidateQueries({ queryKey: ['pontes_escargots'] }) }); }
export function useUpdatePonte() { const qc = useQueryClient(); return useMutation<Ponte, Error, { id: string; payload: Partial<Ponte> }>({ mutationFn: ({ id, payload }) => updatePonte(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['pontes_escargots'] }) }); }
export function useDeletePonte() { const qc = useQueryClient(); return useMutation<void, Error, string>({ mutationFn: (id: string) => deletePonte(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['pontes_escargots'] }) }); }
