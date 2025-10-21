import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import ParcHelicicoleModal from './ParcHelicicoleModal';

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
        <table className="min-w-full text-sm"><thead><tr><th>Nom</th><th>Superficie</th><th>Statut</th><th></th></tr></thead><tbody>
          {items.map(i => (<tr key={i.id} className="border-t"><td>{i.nom}</td><td>{i.superficie_m2}</td><td>{i.statut}</td><td className="text-right"><Button variant="ghost" onClick={() => { setSelected(i); setOpen(true); }}>Edit</Button></td></tr>))}
        </tbody></table>
      )}</div>
      <ParcHelicicoleModal open={open} onOpenChange={setOpen} parc={selected} onSaved={() => { setOpen(false); load(); }} />
    </div>
  );
};

export default ParcsHelicicolesList;
