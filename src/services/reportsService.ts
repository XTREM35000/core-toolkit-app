import { supabase } from './supabaseClient';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type FinancialReport = Tables<'financial_reports'>;
export type CreateFinancialReport = TablesInsert<'financial_reports'>;
export type UpdateFinancialReport = TablesUpdate<'financial_reports'>;

export async function listFinancialReports(params?: {
  organizationId?: string;
  period?: FinancialReport['period'];
  from?: string; // start_date >= from (YYYY-MM-DD)
  to?: string;   // end_date <= to (YYYY-MM-DD)
}) {
  let query = supabase
    .from('financial_reports')
    .select('*')
    .order('start_date', { ascending: false });

  if (params?.organizationId) query = query.eq('organization_id', params.organizationId);
  if (params?.period) query = query.eq('period', params.period);
  if (params?.from) query = query.gte('start_date', params.from);
  if (params?.to) query = query.lte('end_date', params.to);

  return await query;
}

export async function getFinancialReport(id: string) {
  return await supabase.from('financial_reports').select('*').eq('id', id).single();
}

export async function createFinancialReport(payload: CreateFinancialReport) {
  return await supabase.from('financial_reports').insert(payload).select('*').single();
}

export async function updateFinancialReport(id: string, payload: UpdateFinancialReport) {
  return await supabase.from('financial_reports').update(payload).eq('id', id).select('*').single();
}

export async function deleteFinancialReport(id: string) {
  return await supabase.from('financial_reports').delete().eq('id', id);
}


