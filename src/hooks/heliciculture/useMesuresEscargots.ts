import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Mesure {
  id: string;
  cohorte_id?: string | null;
  date?: string;
  poids_moyen_g?: number;
  taux_survie?: number;
  notes?: string;
  created_at?: string;
}

const KEY = 'mock:mesures_escargots';
function readMock(): Mesure[] { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function writeMock(items: Mesure[]) { localStorage.setItem(KEY, JSON.stringify(items)); }

export async function fetchMesures(): Promise<Mesure[]> {
  try {
    const { data, error } = await (supabase as any).from('mesures_escargots').select('*').order('date', { ascending: false });
    if (error) throw error;
    return data as Mesure[];
  } catch {
    return readMock();
  }
}

export async function createMesure(payload: Partial<Mesure>): Promise<Mesure> {
  try { const { data, error } = await (supabase as any).from('mesures_escargots').insert([payload]).select().single(); if (error) throw error; return data as Mesure; } catch { const items = readMock(); const item = { id: String(Date.now()), ...payload, created_at: new Date().toISOString() } as Mesure; items.unshift(item); writeMock(items); return item; }
}

export async function updateMesure(id: string, payload: Partial<Mesure>): Promise<Mesure> { try { const { data, error } = await (supabase as any).from('mesures_escargots').update(payload).eq('id', id).select().single(); if (error) throw error; return data as Mesure; } catch { const items = readMock(); const idx = items.findIndex(i => i.id === id); if (idx >= 0) items[idx] = { ...items[idx], ...payload } as Mesure; writeMock(items); return items[idx]; } }

export async function deleteMesure(id: string): Promise<void> { try { const { error } = await (supabase as any).from('mesures_escargots').delete().eq('id', id); if (error) throw error; } catch { const items = readMock().filter(i => i.id !== id); writeMock(items); } }

export function useMesuresList() { return useQuery<Mesure[], Error>({ queryKey: ['mesures_escargots'], queryFn: fetchMesures }); }
export function useCreateMesure() { const qc = useQueryClient(); return useMutation<Mesure, Error, Partial<Mesure>>({ mutationFn: createMesure, onSuccess: () => qc.invalidateQueries({ queryKey: ['mesures_escargots'] }) }); }
export function useUpdateMesure() { const qc = useQueryClient(); return useMutation<Mesure, Error, { id: string; payload: Partial<Mesure> }>({ mutationFn: ({ id, payload }) => updateMesure(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['mesures_escargots'] }) }); }
export function useDeleteMesure() { const qc = useQueryClient(); return useMutation<void, Error, string>({ mutationFn: (id: string) => deleteMesure(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['mesures_escargots'] }) }); }
