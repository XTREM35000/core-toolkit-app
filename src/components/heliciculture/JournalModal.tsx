import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

const JournalModal = ({ open, onOpenChange, entry, onSaved }: any) => {
  const [form, setForm] = useState<any>({ date: '', activite: '', observations: '', cohorte_id: null });
  const [loading, setLoading] = useState(false);
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { if (entry) setForm({ ...entry }); else setForm({ date: '', activite: '', observations: '', cohorte_id: null }); }, [entry, open]);
  useEffect(() => { if (firstRef.current) setTimeout(() => firstRef.current?.focus(), 50); }, []);

  const save = async () => {
    if (!form.date || !form.activite) return;
    setLoading(true);
    try {
      if (entry?.id) await (supabase as any).from('journal_escargots').update(form).eq('id', entry.id);
      else await (supabase as any).from('journal_escargots').insert(form);
      onSaved && onSaved();
      onOpenChange(false);
    } catch(e){ console.error(e); } finally { setLoading(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-50 overflow-hidden">
        <div className="p-6">
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Date</label>
                <Input ref={firstRef} type="date" value={form.date} onChange={(e:any) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm">Activité</label>
                <Input value={form.activite} onChange={(e:any) => setForm({ ...form, activite: e.target.value })} />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm">Observations</label>
              <Input value={form.observations} onChange={(e:any) => setForm({ ...form, observations: e.target.value })} />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={save} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalModal;
