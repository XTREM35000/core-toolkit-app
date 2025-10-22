import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

type Parc = any;
type ParcHelicicoleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parc: Parc | null;
  onSaved?: () => void;
};

/**
 * Minimal inline stub for ParcHelicicoleModal to avoid missing-module errors.
 * Replace this with the real implementation or move it to its own file.
 */
const ParcHelicicoleModal = ({ open, onOpenChange, parc, onSaved }: ParcHelicicoleModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-full max-w-md">
        <h3 className="text-lg font-medium">{parc ? 'Modifier Parc' : 'Créer Parc'}</h3>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{parc ? `Édition de ${parc.nom}` : 'Remplissez les informations du parc.'}</p>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={() => { onOpenChange(false); onSaved && onSaved(); }}>Enregistrer</Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
        </div>
      </div>
    </div>
  );
};

const ParcsHelicicolesList = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => { setLoading(true); try { const { data } = await (supabase as any).from('parcs_helicicoles').select('*').order('created_at', { ascending: false }) as any; setItems(data || []); } catch (e) {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => { setSelected(null); setOpen(true); }}>Créer Parc</Button></div>
      <div className="bg-white rounded shadow p-4">{loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Superficie</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className="border-t">
                  <td>{i.nom}</td>
                  <td>{i.superficie_m2}</td>
                  <td>{i.statut}</td>
                  <td className="text-right"><Button variant="ghost" onClick={() => { setSelected(i); setOpen(true); }}>Edit</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}</div>
      <ParcHelicicoleModal open={open} onOpenChange={setOpen} parc={selected} onSaved={() => { setOpen(false); load(); }} />
    </div>
  );
};

export default ParcsHelicicolesList;
