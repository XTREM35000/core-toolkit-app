import { useState } from 'react';
import { createRecord, readRecords, updateRecord, deleteRecord } from '@/services/supabaseCrud';
import type { Database } from '@/integrations/supabase/types';

export function useSupabaseCRUD<TableName extends keyof Database['public']['Tables']>(table: TableName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const create = async (payload: Partial<Database['public']['Tables'][TableName]['Insert']>) => {
    setLoading(true); setError(null);
    try {
      const res = await createRecord(table, payload);
      return res as Database['public']['Tables'][TableName]['Row'][] | null;
    } catch (err) {
      setError(err);
      throw err;
    } finally { setLoading(false); }
  };

  const read = async (query?: (qb: unknown) => unknown) => {
    setLoading(true); setError(null);
    try {
      const res = await readRecords(table, query as any);
      return res as Database['public']['Tables'][TableName]['Row'][] | null;
    } catch (err) {
      setError(err);
      throw err;
    } finally { setLoading(false); }
  };

  const update = async (id: string | number, payload: Partial<Database['public']['Tables'][TableName]['Update']>) => {
    setLoading(true); setError(null);
    try {
      const res = await updateRecord(table, String(id), payload);
      return res as Database['public']['Tables'][TableName]['Row'][] | null;
    } catch (err) { setError(err); throw err; } finally { setLoading(false); }
  };

  const remove = async (id: string | number) => {
    setLoading(true); setError(null);
    try {
      const res = await deleteRecord(table, String(id));
      return res as Database['public']['Tables'][TableName]['Row'][] | null;
    } catch (err) { setError(err); throw err; } finally { setLoading(false); }
  };

  return { create, read, update, remove, loading, error };
}
