import { supabase } from './supabaseClient';

export interface Garage {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  manager: string | null;
  capacity: number | null;
  status: 'active' | 'inactive';
  organization_id?: string | null;
  created_at?: string;
}

export async function listGarages(organizationId?: string) {
  let query = supabase.from('garages').select('*').order('created_at', { ascending: false });
  if (organizationId) query = query.eq('organization_id', organizationId);
  return await query;
}

export async function createGarage(payload: Omit<Garage, 'id' | 'created_at'>) {
  return await supabase.from('garages').insert(payload).select().single();
}

export async function updateGarage(id: string, payload: Partial<Omit<Garage, 'id'>>) {
  return await supabase.from('garages').update(payload).eq('id', id).select().single();
}

export async function deleteGarage(id: string) {
  return await supabase.from('garages').delete().eq('id', id);
}


