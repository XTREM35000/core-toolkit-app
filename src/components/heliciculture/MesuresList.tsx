import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { MesureModal } from './';

const MesuresList: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const load = async () => { setLoading(true); try { const { data } = await (supabase as any).from('mesures_escargots').select('*').order('date', { ascending: false }) as any; setItems(data || []); } catch (e) { console.error(e); } finally { setLoading(false); } };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => { setSelected(null); setOpen(true); }}>Nouvelle mesure</Button></div>
      <div className="bg-white rounded shadow p-4">{loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Poids moyen (g)</th>
                <th>Taux survie (%)</th>
                <th>Cohorte</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className="border-t">
                  <td>{i.date}</td>
                  <td>{i.poids_moyen}</td>
                  <td>{i.taux_survie}</td>
                  <td>{i.cohorte_nom}</td>
                  <td className="text-right flex justify-end gap-2">
                    <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => { setPendingDeleteId(i.id); setConfirmOpen(true); }}>Supprimer</Button>
                    <Button variant="ghost" onClick={() => { setSelected(i); setOpen(true); }}>Éditer</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}</div>
      <MesureModal open={open} onOpenChange={setOpen} mesure={selected} onSaved={() => { setOpen(false); load(); }} />
      <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Supprimer la mesure" description="Supprimer cette mesure ?" onConfirm={async () => { if (!pendingDeleteId) return; await (supabase as any).from('mesures_escargots').delete().eq('id', pendingDeleteId); setPendingDeleteId(null); setConfirmOpen(false); load(); }} />
    </div>
  );
};

export default MesuresList;
