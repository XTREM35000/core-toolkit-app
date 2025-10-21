import { supabase } from './client';

// Simple wrapper helpers around the typed supabase client to keep call sites clean.
export async function selectAll<T = any>(table: string, orderBy?: { column: string; ascending?: boolean }) {
  let q = supabase.from(table).select('*');
  if (orderBy) q = q.order(orderBy.column, { ascending: !!orderBy.ascending });
  const res = await q;
  return res as { data: T[] | null; error: any };
}

export async function insertOne<T = any>(table: string, payload: Partial<T>) {
  const res = await supabase.from(table).insert(payload).select();
  return res as { data: T[] | null; error: any };
}

export async function updateOne<T = any>(table: string, id: string, payload: Partial<T>) {
  const res = await supabase.from(table).update(payload).eq('id', id).select();
  return res as { data: T[] | null; error: any };
}

export async function deleteOne(table: string, id: string) {
  const res = await supabase.from(table).delete().eq('id', id).select();
  return res as { data: any; error: any };
}

export default { selectAll, insertOne, updateOne, deleteOne };
