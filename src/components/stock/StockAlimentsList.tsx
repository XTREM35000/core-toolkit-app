import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
const StockAlimentModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: any | null;
  onSaved?: () => void;
}> = ({ open, onOpenChange, stock, onSaved }) => {
  const [itemName, setItemName] = useState(stock?.item_name || '');
  const [quantity, setQuantity] = useState<number>(stock?.quantity || 0);
  const [unit, setUnit] = useState(stock?.unit || '');

  useEffect(() => {
    setItemName(stock?.item_name || '');
    setQuantity(stock?.quantity || 0);
    setUnit(stock?.unit || '');
  }, [stock]);

  if (!open) return null;

  const save = async () => {
    const payload = {
      item_name: itemName,
      quantity,
      unit,
    };
    try {
      if (stock?.id) {
        await (supabase as any).from('stock_aliments').update(payload).eq('id', stock.id);
      } else {
        await (supabase as any).from('stock_aliments').insert(payload);
      }
      onSaved && onSaved();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-4 w-full max-w-md">
        <h3 className="text-lg font-medium mb-2">{stock ? 'Edit aliment' : 'Ajouter aliment'}</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm">Nom</label>
            <input className="w-full border rounded px-2 py-1" value={itemName} onChange={e => setItemName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Quantité</label>
            <input type="number" className="w-full border rounded px-2 py-1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm">Unité</label>
            <input className="w-full border rounded px-2 py-1" value={unit} onChange={e => setUnit(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </div>
      </div>
    </div>
  );
};

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
          <div className="overflow-x-auto">
            <table className="w-full text-sm"><thead><tr><th>Nom</th><th>Quantité</th><th>Unité</th><th></th></tr></thead><tbody>
          {items.map(i => (<tr key={i.id} className="border-t"><td>{i.item_name}</td><td>{i.quantity}</td><td>{i.unit}</td><td className="text-right"><Button variant="ghost" onClick={() => { setSelected(i); setOpen(true); }}>Edit</Button></td></tr>))}
        </tbody></table>
            </div>
      )}</div>
      <StockAlimentModal open={open} onOpenChange={setOpen} stock={selected} onSaved={() => { setOpen(false); load(); }} />
    </div>
  );
};

export default StockAlimentsList;
