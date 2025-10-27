import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { PostgrestError } from '@supabase/supabase-js';

export async function createRecord<TableName extends keyof Database['public']['Tables']>(
  table: TableName,
  payload: Partial<Database['public']['Tables'][TableName]['Insert']>
) {
  const res: any = await (supabase as any).from(table as string).insert(payload).select();
  if (res?.error) throw res.error as PostgrestError;
  return res?.data as unknown as Database['public']['Tables'][TableName]['Row'][] | null;
}

export async function readRecords<TableName extends keyof Database['public']['Tables']>(
  table: TableName,
  query?: (qb: any) => any
) {
  let q: any = (supabase as any).from(table as string).select('*');
  if (query) q = query(q) as any;
  const res: any = await q;
  if (res?.error) throw res.error as PostgrestError;
  return res?.data as unknown as Database['public']['Tables'][TableName]['Row'][] | null;
}

export async function updateRecord<TableName extends keyof Database['public']['Tables']>(
  table: TableName,
  id: string,
  payload: Partial<Database['public']['Tables'][TableName]['Update']>
) {
  const res: any = await (supabase as any).from(table as string).update(payload).eq('id', id).select();
  if (res?.error) throw res.error as PostgrestError;
  return res?.data as Database['public']['Tables'][TableName]['Row'][] | null;
}

export async function deleteRecord<TableName extends keyof Database['public']['Tables']>(table: TableName, id: string) {
  const res: any = await (supabase as any).from(table as string).delete().eq('id', id).select();
  if (res?.error) throw res.error as PostgrestError;
  return res?.data as Database['public']['Tables'][TableName]['Row'][] | null;
}
