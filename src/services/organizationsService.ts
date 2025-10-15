import { supabase } from './supabaseClient';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Organization = Tables<'organizations'>;
export type CreateOrganization = TablesInsert<'organizations'>;
export type UpdateOrganization = TablesUpdate<'organizations'>;

export async function listOrganizations() {
  return await supabase.from('organizations').select('*').order('created_at', { ascending: false });
}

export async function getOrganization(id: string) {
  return await supabase.from('organizations').select('*').eq('id', id).single();
}

export async function createOrganization(payload: CreateOrganization) {
  return await supabase.from('organizations').insert(payload).select('*').single();
}

export async function updateOrganization(id: string, payload: UpdateOrganization) {
  return await supabase.from('organizations').update(payload).eq('id', id).select('*').single();
}

export async function deleteOrganization(id: string) {
  return await supabase.from('organizations').delete().eq('id', id);
}


