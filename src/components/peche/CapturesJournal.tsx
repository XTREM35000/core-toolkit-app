import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import useCaptures from '@/hooks/useCaptures';
import ConfirmModal from '@/components/ui/ConfirmModal';

const CapturesJournal: React.FC = () => {
  const { items, loading, error, create, update, remove } = useCaptures();
  const add = async () => {
    const desc = window.prompt('Description de la capture');
    if (!desc) return;
    try { await create({ description: desc }); } catch (err) { console.error(err); }
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => { setPendingDeleteId(id); setConfirmOpen(true); };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try { await remove(pendingDeleteId); } catch (err) { console.error(err); }
    setPendingDeleteId(null);
    setConfirmOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Captures</h3>
        <Button onClick={add}>Ajouter</Button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        {loading ? <div className="text-sm text-muted-foreground">Chargement...</div> : (
          items.map((it: any) => (
            <div key={it.id} className="flex items-center justify-between border-b p-2">
              <div>
                <div className="font-medium">{it.description}</div>
                <div className="text-xs text-muted-foreground">Poids: {it.weight ?? 0}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(it.id)}>Supprimer</Button>
              </div>
            </div>
          ))
        )}
        {error && <div className="text-sm text-red-600 mt-2">Erreur: {(error as any).message ?? String(error)}</div>}
      </div>
      <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirmer la suppression" description="Confirmer la suppression ?" onConfirm={confirmDelete} />
    </div>
  );
};

export default CapturesJournal;
