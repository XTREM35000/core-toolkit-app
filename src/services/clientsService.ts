import { supabase } from './supabaseClient';

export interface ClientAddress { street?: string; city?: string; postal_code?: string; country?: string }
export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address: ClientAddress | null;
  organization_id?: string | null;
  created_at?: string;
}

export async function listClients(organizationId?: string) {
  let query = supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (organizationId) query = query.eq('organization_id', organizationId);
  return await query;
}

export async function createClient(payload: Omit<Client, 'id' | 'created_at'>) {
  return await supabase.from('clients').insert(payload).select().single();
}

export async function updateClient(id: string, payload: Partial<Omit<Client, 'id'>>) {
  return await supabase.from('clients').update(payload).eq('id', id).select().single();
}

export async function deleteClient(id: string) {
  return await supabase.from('clients').delete().eq('id', id);
}


