import { supabase } from './supabaseClient';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type GarageMetric = Tables<'garage_metrics'>;
export type CreateGarageMetric = TablesInsert<'garage_metrics'>;
export type UpdateGarageMetric = TablesUpdate<'garage_metrics'>;

export async function listGarageMetrics(params?: {
  garageId?: string;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
}) {
  let query = supabase
    .from('garage_metrics')
    .select('*')
    .order('date', { ascending: true });

  if (params?.garageId) query = query.eq('garage_id', params.garageId);
  if (params?.from) query = query.gte('date', params.from);
  if (params?.to) query = query.lte('date', params.to);

  return await query;
}

export async function latestGarageMetric(garageId: string) {
  return await supabase
    .from('garage_metrics')
    .select('*')
    .eq('garage_id', garageId)
    .order('date', { ascending: false })
    .limit(1)
    .single();
}

export async function createGarageMetric(payload: CreateGarageMetric) {
  return await supabase.from('garage_metrics').insert(payload).select('*').single();
}

export async function updateGarageMetric(id: string, payload: UpdateGarageMetric) {
  return await supabase.from('garage_metrics').update(payload).eq('id', id).select('*').single();
}

export async function deleteGarageMetric(id: string) {
  return await supabase.from('garage_metrics').delete().eq('id', id);
}


