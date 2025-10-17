import { supabase } from '@/integrations/supabase/client';

export async function createRecord<T = any>(table: string, payload: Partial<T>) {
  const { data, error } = await (supabase as any).from(table).insert(payload).select();
  if (error) throw error;
  return data;
}

export async function readRecords<T = any>(table: string, query?: (qb: any) => any) {
  let q = (supabase as any).from(table).select('*');
  if (query) q = query(q);
  const { data, error} = await q;
  if (error) throw error;
  return data as T[];
}

export async function updateRecord<T = any>(table: string, id: string, payload: Partial<T>) {
  const { data, error } = await (supabase as any)
    .from(table)
    .update(payload)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteRecord(table: string, id: string) {
  const { data, error } = await (supabase as any)
    .from(table)
    .delete()
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}
