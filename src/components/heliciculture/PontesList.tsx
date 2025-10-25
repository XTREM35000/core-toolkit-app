import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { PonteModal } from './';

const PontesList: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const load = async () => { setLoading(true); try { const { data } = await (supabase as any).from('pontes_escargots').select('*').order('date_ponte', { ascending: false }) as any; setItems(data || []); } catch (e) { console.error(e); } finally { setLoading(false); } };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => { setSelected(null); setOpen(true); }}>➕ Nouvelle ponte</Button></div>
      <div className="bg-white rounded shadow p-4">{loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Cohorte</th>
                <th>Date</th>
                <th>Nb œufs</th>
                <th>Observation</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className="border-t">
                  <td>{i.cohorte_nom}</td>
                  <td>{i.date_ponte}</td>
                  <td>{i.nb_oeufs}</td>
                  <td>{i.observation}</td>
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
      <PonteModal open={open} onOpenChange={setOpen} ponte={selected} onSaved={() => { setOpen(false); load(); }} />
      <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Supprimer la ponte" description="Supprimer cette ponte ?" onConfirm={async () => { if (!pendingDeleteId) return; await (supabase as any).from('pontes_escargots').delete().eq('id', pendingDeleteId); setPendingDeleteId(null); setConfirmOpen(false); load(); }} />
    </div>
  );
};

export default PontesList;
