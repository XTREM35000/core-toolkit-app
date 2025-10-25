import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import PoulaillerModal from './PoulaillerModal';
import usePoulaillers from '@/hooks/usePoulaillers';
import ConfirmModal from '@/components/ui/ConfirmModal';

const PoulaillersList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const { items, loading, error, create, update, remove } = usePoulaillers();

  const handleSaved = async (item: any) => {
    try {
      if (item.id && items.find((i: any) => i.id === item.id)) {
        await update(item.id, { name: item.name });
      } else {
        await create({ name: item.name });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (it: any) => { setSelected(it); setOpen(true); };
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try { await remove(pendingDeleteId); } catch (err) { console.error(err); } finally { setPendingDeleteId(null); setConfirmOpen(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Poulaillers</h3>
        <div className="flex gap-2">
          <Button onClick={() => { setSelected(null); setOpen(true); }}>Créer un poulailler</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Chargement...</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-muted-foreground">Aucun poulailler pour le moment.</div>
        ) : (
          <div className="space-y-2">
            {items.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">Créé le {new Date(p.created_at ?? p.createdAt ?? p.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={() => handleDelete(p.id)}>Supprimer</Button>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => handleEdit(p)}>Éditer</Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <div className="text-sm text-red-600 mt-2">Erreur: {(error as any).message ?? String(error)}</div>}
      </div>

      <PoulaillerModal
        open={open}
        onOpenChange={(v) => { if (!v) { setSelected(null); } setOpen(v); }}
        poulailler={selected}
        onSaved={async (item) => { await handleSaved(item); setOpen(false); }}
      />
      <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirmer la suppression" description="Confirmer la suppression ?" onConfirm={confirmDelete} />
    </div>
  );
};

export default PoulaillersList;
