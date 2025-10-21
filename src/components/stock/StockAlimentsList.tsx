import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import StockAlimentModal from './StockAlimentModal';

const StockAlimentsList = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => { setLoading(true); try { const { data } = await (supabase as any).from('stock_aliments').select('*').order('created_at', { ascending: false }) as any; setItems(data || []); } catch (e) {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => { setSelected(null); setOpen(true); }}>Ajouter aliment</Button></div>
      <div className="bg-white rounded shadow p-4">{loading ? <div>Loading...</div> : (
        <table className="min-w-full text-sm"><thead><tr><th>Nom</th><th>Quantité</th><th>Unité</th><th></th></tr></thead><tbody>
          {items.map(i => (<tr key={i.id} className="border-t"><td>{i.item_name}</td><td>{i.quantity}</td><td>{i.unit}</td><td className="text-right"><Button variant="ghost" onClick={() => { setSelected(i); setOpen(true); }}>Edit</Button></td></tr>))}
        </tbody></table>
      )}</div>
      <StockAlimentModal open={open} onOpenChange={setOpen} stock={selected} onSaved={() => { setOpen(false); load(); }} />
    </div>
  );
};

export default StockAlimentsList;
