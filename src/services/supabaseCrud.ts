import { supabase } from '@/integrations/supabase/client';

export async function createRecord<T = any>(table: string, payload: Partial<T>) {
  const { data, error } = await supabase.from(table).insert(payload).select();
  if (error) throw error;
  return data;
}

export async function readRecords<T = any>(table: string, query?: (qb: any) => any) {
  let q = supabase.from(table).select('*');
  if (query) q = query(q);
  const { data, error } = await q;
  if (error) throw error;
  return data as T[];
}

export async function updateRecord<T = any>(table: string, id: string | number, payload: Partial<T>) {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select();
  if (error) throw error;
  return data;
}

export async function deleteRecord(table: string, id: string | number) {
  const { data, error } = await supabase.from(table).delete().eq('id', id).select();
  if (error) throw error;
  return data;
}
