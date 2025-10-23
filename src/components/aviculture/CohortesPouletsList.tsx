import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CohorteModal from './CohorteModal';
import useCohortesPoulets from '@/hooks/useCohortesPoulets';

type Cohorte = { id: string; name: string };

const CohortesPouletsList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const { items, loading, error, create, update, remove } = useCohortesPoulets();

  const add = () => { setSelected(null); setOpen(true); };

  const handleSaved = async (item: any) => {
    try {
      if (item.id && items.find((i: any) => i.id === item.id)) {
        await update(item.id, { name: item.name });
      } else {
        await create({ name: item.name });
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Cohortes de poulets</h3>
        <Button onClick={add}>Ajouter une cohorte</Button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        {loading ? <div className="text-sm text-muted-foreground">Chargement...</div> : items.length === 0 ? (
          <div className="text-sm text-muted-foreground">Aucune cohorte pour le moment.</div>
        ) : (
          items.map((it: any) => (
            <div key={it.id} className="py-2 border-b last:border-b-0 flex items-center justify-between">
              <div>{it.name}</div>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={async () => { if (!confirm('Confirmer la suppression ?')) return; try { await remove(it.id); } catch (err) { console.error(err); } }}>Supprimer</Button>
                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => { setSelected(it); setOpen(true); }}>Éditer</Button>
              </div>
            </div>
          ))
        )}
        {error && <div className="text-sm text-red-600 mt-2">Erreur: {(error as any).message ?? String(error)}</div>}
      </div>

      <CohorteModal open={open} onOpenChange={(v) => { if (!v) setSelected(null); setOpen(v); }} cohorte={selected} onSaved={(item) => { handleSaved(item); setOpen(false); }} />
    </div>
  );
};

export default CohortesPouletsList;
