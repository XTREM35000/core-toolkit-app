import { useState } from 'react';
import { createRecord, readRecords, updateRecord, deleteRecord } from '@/services/supabaseCrud';

export function useSupabaseCRUD<T = any>(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const create = async (payload: Partial<T>) => {
    setLoading(true); setError(null);
    try {
      const res = await createRecord<T>(table, payload);
      return res;
    } catch (err) {
      setError(err); throw err;
    } finally { setLoading(false); }
  };

  const read = async (query?: (qb:any)=>any) => {
    setLoading(true); setError(null);
    try {
      const res = await readRecords<T>(table, query);
      return res;
    } catch (err) {
      setError(err); throw err;
    } finally { setLoading(false); }
  };

  const update = async (id: string|number, payload: Partial<T>) => {
    setLoading(true); setError(null);
    try {
      const res = await updateRecord<T>(table, id, payload);
      return res;
    } catch (err) { setError(err); throw err; } finally { setLoading(false); }
  };

  const remove = async (id: string|number) => {
    setLoading(true); setError(null);
    try {
      const res = await deleteRecord(table, id);
      return res;
    } catch (err) { setError(err); throw err; } finally { setLoading(false); }
  };

  return { create, read, update, remove, loading, error };
}
