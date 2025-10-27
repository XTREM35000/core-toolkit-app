import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Escargotiere {
  id: string;
  nom: string;
  parc_id?: string | null;
  capacite?: number | null;
  created_at?: string;
}

const MOCK_KEY = 'mock:escargotieres';

function readMock(): Escargotiere[] {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeMock(items: Escargotiere[]) { localStorage.setItem(MOCK_KEY, JSON.stringify(items)); }

export async function fetchEscargotiereAll(): Promise<Escargotiere[]> {
  try {
    const { data, error } = await (supabase as any).from('escargotieres').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Escargotiere[];
  } catch (e) {
    // fallback to local mock
    return readMock();
  }
}

export async function createEscargotiere(payload: Partial<Escargotiere>): Promise<Escargotiere> {
  try {
    const { data, error } = await (supabase as any).from('escargotieres').insert([payload]).select().single();
    if (error) throw error;
    return data as Escargotiere;
  } catch (e) {
    const items = readMock();
    const item: Escargotiere = { id: String(Date.now()), nom: payload.nom || 'Nouvelle escargotière', parc_id: payload.parc_id || null, capacite: payload.capacite || null, created_at: new Date().toISOString() };
    items.unshift(item);
    writeMock(items);
    return item;
  }
}

export async function updateEscargotiere(id: string, payload: Partial<Escargotiere>): Promise<Escargotiere> {
  try {
    const { data, error } = await (supabase as any).from('escargotieres').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data as Escargotiere;
  } catch (e) {
    const items = readMock();
    const idx = items.findIndex(i => i.id === id);
    if (idx >= 0) items[idx] = { ...items[idx], ...payload } as Escargotiere;
    writeMock(items);
    return items[idx];
  }
}

export async function deleteEscargotiere(id: string): Promise<void> {
  try {
    const { error } = await (supabase as any).from('escargotieres').delete().eq('id', id);
    if (error) throw error;
  } catch (e) {
    const items = readMock().filter(i => i.id !== id);
    writeMock(items);
  }
}

export function useEscargotiereList() {
  return useQuery<Escargotiere[], Error>({ queryKey: ['escargotieres'], queryFn: fetchEscargotiereAll });
}

export function useCreateEscargotiere() {
  const qc = useQueryClient();
  return useMutation<Escargotiere, Error, Partial<Escargotiere>>({ mutationFn: createEscargotiere, onSuccess: () => qc.invalidateQueries({ queryKey: ['escargotieres'] }) });
}

export function useUpdateEscargotiere() {
  const qc = useQueryClient();
  return useMutation<Escargotiere, Error, { id: string; payload: Partial<Escargotiere> }>({ mutationFn: ({ id, payload }) => updateEscargotiere(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['escargotieres'] }) });
}

export function useDeleteEscargotiere() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({ mutationFn: (id) => deleteEscargotiere(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['escargotieres'] }) });
}
