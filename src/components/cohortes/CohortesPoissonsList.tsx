import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import CohortePoissonModal from './CohortePoissonModal';

const CohortesPoissonsList = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await (supabase as any).from('cohortes_poissons').select('*').order('created_at', { ascending: false }) as any;
      setItems(data || []);
    } catch (e) {
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setSelected(null); setOpen(true); }}>Créer Cohorte</Button>
      </div>
      <div className="bg-white rounded shadow p-4">
        {loading ? <div>Loading...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
            <thead><tr><th>Espèce</th><th>Nombre initial</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className="border-t"><td>{i.espece}</td><td>{i.nombre_initial}</td><td>{i.statut}</td><td className="text-right"><Button variant="ghost" onClick={() => { setSelected(i); setOpen(true); }}>Edit</Button></td></tr>
              ))}
            </tbody>
          </table>
              </div>
        )}
      </div>
      <CohortePoissonModal open={open} onOpenChange={setOpen} cohort={selected} onSaved={() => { setOpen(false); load(); }} />
    </div>
  );
};

export default CohortesPoissonsList;
