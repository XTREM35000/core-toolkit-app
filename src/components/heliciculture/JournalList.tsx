import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import ConfirmModal from '@/components/ui/ConfirmModal';
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try { await (supabase as any).from('journal_escargots').delete().eq('id', pendingDeleteId); } catch (e) { console.error(e); } finally { setPendingDeleteId(null); setConfirmOpen(false); load(); }
  };

  return (

    <div className="space-y-4">

      <div className="flex justify-end">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => { setSelected(null); setOpen(true); }}
        >
          + Ajouter
        </Button>
      </div>

      <Card className="border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl">
        {loading ? (
          <div className="p-4">Chargement...</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">Aucune activité enregistrée</div>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr className="text-left">
                  <th className="p-3">Date</th>
                  <th className="p-3">Activité</th>
                  <th className="p-3">Observations</th>
                  <th className="p-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <tr
                    key={i.id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                  >
                    <td className="p-3">{i.date}</td>
                    <td className="p-3">{i.activite}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">{i.observations}</td>
                    <td className="p-3 text-right flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setSelected(i); setOpen(true); }}
                      >
                        🖊️
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => { setPendingDeleteId(i.id); setConfirmOpen(true); }}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <JournalModal
        open={open}
        onOpenChange={setOpen}
        entry={selected}
        onSaved={() => { setOpen(false); load(); }}
      />

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Supprimer"
        description="Confirmer la suppression ?"
        onConfirm={confirmDelete}
      />

    </div>

  );
};

export default JournalList;
