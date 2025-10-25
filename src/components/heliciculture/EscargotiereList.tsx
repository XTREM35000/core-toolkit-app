import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { EscargotiereModal } from './';
import ConfirmModal from '@/components/ui/ConfirmModal';

const EscargotiereList: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await (supabase as any).from('escargoteres').select('*').order('created_at', { ascending: false }) as any;
      setItems(data || []);
    } catch (e) {
      console.error('load escargoteres', e);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => { setSelected(null); setOpen(true); }}>➕ escargotière</Button></div>
      <div className="bg-white rounded shadow p-4">
        {loading ? <div>Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Dimensions</th>
                  <th>Substrat</th>
                  <th>Date d'installation</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id} className="border-t">
                    <td>{i.nom}</td>
                    <td>{i.type}</td>
                    <td>{i.dimensions}</td>
                    <td>{i.substrat}</td>
                    <td>{i.date_installation}</td>
                    <td className="text-right flex justify-end gap-2">
                      <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => { setPendingDelete(i); setConfirmOpen(true); }}>Supprimer</Button>
                      <Button variant="ghost" onClick={() => { setSelected(i); setOpen(true); }}>Éditer</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <EscargotiereModal open={open} onOpenChange={setOpen} parc={selected} onSaved={() => { setOpen(false); load(); }} />

      <ConfirmModal
        open={confirmOpen}
        title={`Supprimer l'escargotière de ${pendingDelete?.nom || "cet utilisateur"}`}
        description={pendingDelete ? `Supprimer l'escargotière « ${pendingDelete.nom || pendingDelete.id} » ?` : "Supprimer cet élément ?"}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onClose={() => { setConfirmOpen(false); setPendingDelete(null); }}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await (supabase as any).from('escargoteres').delete().eq('id', pendingDelete.id);
            await load();
          } catch (e) { console.error(e); }
          setPendingDelete(null);
        }}
      />
    </div>
  );
};

export default EscargotiereList;
