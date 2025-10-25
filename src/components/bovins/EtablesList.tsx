import React, { useState } from 'react';
import EtableModal from './EtableModal';
import { Button } from '@/components/ui/button';
import useEtables from '@/hooks/useEtables';

const EtablesList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const { items, loading, error, create, update, remove } = useEtables();

  const handleSaved = async (item: any) => {
    try {
      if (item.id && items.find((i: any) => i.id === item.id)) await update(item.id, { name: item.name });
      else await create({ name: item.name });
    } catch (err) { console.error(err); }
  };

  const handleEdit = (it: any) => { setSelected(it); setOpen(true); };
  const handleDelete = async (id: string) => { if (!confirm('Confirmer la suppression ?')) return; try { await remove(id); } catch (err) { console.error(err); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Étables</h3>
        <div className="flex gap-2">
          <Button onClick={() => { setSelected(null); setOpen(true); }}>Créer une étable</Button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        {loading ? <div className="text-sm text-muted-foreground">Chargement...</div> : items.length === 0 ? (
          <div className="text-sm text-muted-foreground">Aucune étable.</div>
        ) : (
          <div className="space-y-2">
            {items.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">Créé le {new Date(p.created_at ?? p.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(p.id)}>Supprimer</Button>
                  <Button variant="ghost" onClick={() => handleEdit(p)}>Éditer</Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <div className="text-sm text-red-600 mt-2">Erreur: {(error as any).message ?? String(error)}</div>}
      </div>
      <EtableModal open={open} onOpenChange={(v) => { if (!v) setSelected(null); setOpen(v); }} etable={selected} onSaved={async (item) => { await handleSaved(item); setOpen(false); }} />
    </div>
  );
};

export default EtablesList;
