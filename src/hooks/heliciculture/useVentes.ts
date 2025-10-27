import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Vente {
  id: string;
  client_id?: string | null;
  montant?: number;
  items?: any[];
  statut?: string;
  created_at?: string;
}

const KEY = 'mock:ventes';
function readMock(): Vente[] { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function writeMock(items: Vente[]) { localStorage.setItem(KEY, JSON.stringify(items)); }

export async function fetchVentes(): Promise<Vente[]> {
  try { const { data, error } = await (supabase as any).from('ventes').select('*').order('created_at', { ascending: false }); if (error) throw error; return data as Vente[]; } catch { return readMock(); }
}

export async function createVente(payload: Partial<Vente>): Promise<Vente> { try { const { data, error } = await (supabase as any).from('ventes').insert([payload]).select().single(); if (error) throw error; return data as Vente; } catch { const items = readMock(); const item = { id: String(Date.now()), ...payload, created_at: new Date().toISOString() } as Vente; items.unshift(item); writeMock(items); return item; } }

export async function updateVente(id: string, payload: Partial<Vente>): Promise<Vente> { try { const { data, error } = await (supabase as any).from('ventes').update(payload).eq('id', id).select().single(); if (error) throw error; return data as Vente; } catch { const items = readMock(); const idx = items.findIndex(i => i.id === id); if (idx >= 0) items[idx] = { ...items[idx], ...payload } as Vente; writeMock(items); return items[idx]; } }

export async function deleteVente(id: string): Promise<void> { try { const { error } = await (supabase as any).from('ventes').delete().eq('id', id); if (error) throw error; } catch { const items = readMock().filter(i => i.id !== id); writeMock(items); } }

export function useVentesList() { return useQuery<Vente[], Error>({ queryKey: ['ventes'], queryFn: fetchVentes }); }
export function useCreateVente() { const qc = useQueryClient(); return useMutation<Vente, Error, Partial<Vente>>({ mutationFn: createVente, onSuccess: () => qc.invalidateQueries({ queryKey: ['ventes'] }) }); }
export function useUpdateVente() { const qc = useQueryClient(); return useMutation<Vente, Error, { id: string; payload: Partial<Vente> }>({ mutationFn: ({ id, payload }) => updateVente(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['ventes'] }) }); }
export function useDeleteVente() { const qc = useQueryClient(); return useMutation<void, Error, string>({ mutationFn: (id: string) => deleteVente(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['ventes'] }) }); }
