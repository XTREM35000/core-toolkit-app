import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
// Inline ConditionModal added below

const ConditionsEnvironnementList = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => { setLoading(true); try { const { data } = await (supabase as any).from('conditions_environnement').select('*').order('date_mesure', { ascending: false }) as any; setItems(data || []); } catch (e) {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => { setSelected(null); setOpen(true); }}>Ajouter Mesure</Button></div>
      <div className="bg-white rounded shadow p-4">{loading ? <div>Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Temp Air</th>
                  <th>Hygrométrie</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id} className="border-t">
                    <td>{i.date_mesure}</td>
                    <td>{i.temperature_air_c}</td>
                    <td>{i.hygometrie_pct}</td>
                    <td className="text-right"><Button variant="ghost" onClick={() => { setSelected(i); setOpen(true); }}>Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}</div>
      <ConditionModal open={open} onOpenChange={setOpen} condition={selected} onSaved={() => { setOpen(false); load(); }} />
    </div>
  );
};

/**
 * Minimal inline ConditionModal stub to satisfy the import and provide basic behavior.
 * Replace or expand this with the real modal implementation as needed.
 */
const ConditionModal = ({ open, onOpenChange, condition, onSaved }: any) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black/50 absolute inset-0" onClick={() => onOpenChange(false)} />
      <div className="bg-white p-4 rounded shadow z-10 w-full max-w-md">
        <div className="font-bold mb-2">{condition ? 'Edit Condition' : 'New Condition'}</div>
        <div className="mb-4 text-sm text-slate-600">This is a lightweight modal stub — implement form fields and validation here.</div>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onSaved(); }}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default ConditionsEnvironnementList;
