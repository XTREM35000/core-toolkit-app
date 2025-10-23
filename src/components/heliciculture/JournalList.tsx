import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { JournalModal } from './';

const JournalList: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const { data } = await (supabase as any).from('journal_escargots').select('*').order('date', { ascending: false }) as any; setItems(data || []); } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => { setSelected(null); setOpen(true); }}>Nouvel enregistrement</Button></div>
      <div className="bg-white rounded shadow p-4">
        {loading ? <div>Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Activité</th>
                  <th>Observations</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id} className="border-t">
                    <td>{i.date}</td>
                    <td>{i.activite}</td>
                    <td>{i.observations}</td>
                    <td className="text-right flex justify-end gap-2">
                      <Button variant="destructive" onClick={async () => { if (!window.confirm('Supprimer cet enregistrement ?')) return; await (supabase as any).from('journal_escargots').delete().eq('id', i.id); load(); }}>Supprimer</Button>
                      <Button variant="ghost" onClick={() => { setSelected(i); setOpen(true); }}>Éditer</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <JournalModal open={open} onOpenChange={setOpen} entry={selected} onSaved={() => { setOpen(false); load(); }} />
    </div>
  );
};

export default JournalList;
