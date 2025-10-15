import { supabase } from './supabaseClient';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Intervention = Tables<'interventions'>;
export type CreateIntervention = TablesInsert<'interventions'>;
export type UpdateIntervention = TablesUpdate<'interventions'>;

export async function listInterventions(filters?: { status?: Intervention['status'] }) {
  let query = supabase
    .from('interventions')
    .select(`
      *,
      vehicles:vehicle_id (
        brand, model, license_plate,
        clients:client_id ( first_name, last_name )
      ),
      profiles:mechanic_id ( first_name, last_name )
    `)
    .order('created_at', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);

  return await query;
}

export async function getIntervention(id: string) {
  return await supabase
    .from('interventions')
    .select(`
      *,
      vehicles:vehicle_id (
        brand, model, license_plate,
        clients:client_id ( first_name, last_name )
      ),
      profiles:mechanic_id ( first_name, last_name )
    `)
    .eq('id', id)
    .single();
}

export async function createIntervention(payload: CreateIntervention) {
  return await supabase.from('interventions').insert(payload).select('*').single();
}

export async function updateIntervention(id: string, payload: UpdateIntervention) {
  return await supabase.from('interventions').update(payload).eq('id', id).select('*').single();
}

export async function deleteIntervention(id: string) {
  return await supabase.from('interventions').delete().eq('id', id);
}

