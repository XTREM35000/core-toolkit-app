import { supabase } from './client';
import type { Database } from './types';
import type { PostgrestError } from '@supabase/supabase-js';

// Typed wrapper around the Supabase client. Use TableName to ensure correct row types.
export async function selectAll<TableName extends keyof Database['public']['Tables']>(
  table: TableName,
  orderBy?: { column: keyof Database['public']['Tables'][TableName]['Row']; ascending?: boolean }
) {
  // Use a lightly-typed query builder internally to avoid inferring column-name
  // constraints across every table; we still return a properly-typed result.
  const q: any = (supabase as any).from(table as string).select('*');
  if (orderBy) q.order(String(orderBy.column), { ascending: !!orderBy.ascending });
  const res = await q;
  return res as { data: Database['public']['Tables'][TableName]['Row'][] | null; error: PostgrestError | null };
}

export async function insertOne<TableName extends keyof Database['public']['Tables']>(
  table: TableName,
  payload: Database['public']['Tables'][TableName]['Insert']
) {
  const res: any = await (supabase as any).from(table as string).insert(payload).select();
  return res as { data: Database['public']['Tables'][TableName]['Row'][] | null; error: PostgrestError | null };
}

export async function updateOne<TableName extends keyof Database['public']['Tables']>(
  table: TableName,
  id: string,
  payload: Partial<Database['public']['Tables'][TableName]['Update']>
) {
  // Cast the builder to any so we can call .eq('id', ...) without the compiler
  // requiring that every table have an "id" column.
  const res: any = await (supabase as any).from(table as string).update(payload).eq('id', id).select();
  return res as { data: Database['public']['Tables'][TableName]['Row'][] | null; error: PostgrestError | null };
}

export async function deleteOne<TableName extends keyof Database['public']['Tables']>(table: TableName, id: string) {
  const res: any = await (supabase as any).from(table as string).delete().eq('id', id).select();
  return res as { data: Database['public']['Tables'][TableName]['Row'][] | null; error: PostgrestError | null };
}

export default { selectAll, insertOne, updateOne, deleteOne };
