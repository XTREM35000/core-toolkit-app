import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import useRecoltesMiel from '@/hooks/useRecoltesMiel';

const RecoltesMielList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const { items, loading, error, create, update, remove } = useRecoltesMiel();

  const add = async () => {
    const name = window.prompt('Nom de la récolte');
    if (!name) return;
    try { await create({ name }); } catch (err) { console.error(err); }
  };

  const handleEdit = (it: any) => { setSelected(it); setOpen(true); };
  const handleDelete = async (id: string) => { if (!confirm('Confirmer la suppression ?')) return; try { await remove(id); } catch (err) { console.error(err); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Récoltes de miel</h3>
        <Button onClick={add}>Ajouter</Button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        {loading ? <div className="text-sm text-muted-foreground">Chargement...</div> : (
          items.map((it: any) => (
            <div key={it.id} className="flex items-center justify-between border-b p-2">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-xs text-muted-foreground">Quantité: {it.quantity ?? 0}</div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => handleDelete(it.id)}>Supprimer</Button>
                <Button variant="ghost" onClick={() => handleEdit(it)}>Éditer</Button>
              </div>
            </div>
          ))
        )}
        {error && <div className="text-sm text-red-600 mt-2">Erreur: {(error as any).message ?? String(error)}</div>}
      </div>
    </div>
  );
};

export default RecoltesMielList;
