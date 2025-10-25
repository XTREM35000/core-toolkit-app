import React, { useEffect, useState, useRef } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

const StockAlimentModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: any | null;
  onSaved?: () => void;
}> = ({ open, onOpenChange, stock, onSaved }) => {
  const [itemName, setItemName] = useState(stock?.item_name || '');
  const [quantity, setQuantity] = useState<number>(stock?.quantity || 0);
  const [unit, setUnit] = useState(stock?.unit || '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ itemName?: string; quantity?: string }>({});
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setItemName(stock?.item_name || '');
    setQuantity(stock?.quantity || 0);
    setUnit(stock?.unit || '');
  }, [stock, open]);

  const validate = () => {
    const e: any = {};
    if (!itemName || itemName.trim().length < 2) e.itemName = 'Nom requis (min 2 caractères)';
    if (quantity == null || isNaN(Number(quantity)) || Number(quantity) < 0) e.quantity = 'Quantité doit être >= 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
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
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
      onOpenChange(false);
    }
  };

  const handleDelete = async () => {
    if (!stock?.id) return;
    if (!window.confirm('Supprimer cet aliment ?')) return;
    try {
      await (supabase as any).from('stock_aliments').delete().eq('id', stock.id);
      onSaved && onSaved();
    } catch (e) { console.error(e); } finally { onOpenChange(false); }
  };

  // don't render when closed
  if (!open) return null;

  return (
    <WhatsAppModal isOpen={open} onClose={() => onOpenChange(false)} hideHeader className="max-w-md">
      <div data-debug="StockAlimentModal" className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <ModalHeader
          title={stock ? 'Editer aliment' : 'Ajouter aliment'}
          subtitle="Détails de l'aliment"
          headerGradient="from-purple-500 to-purple-600"
          headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-purple-300" />}
          onClose={() => onOpenChange(false)}
        />

        <div className="p-6 bg-white">
          <Card className="p-4">
            <div className="space-y-2">
              <div>
                <label className="block text-sm">Nom</label>
                <input ref={firstRef} className="w-full border rounded px-2 py-1" value={itemName} onChange={e => setItemName(e.target.value)} />
                {errors.itemName && <div className="text-xs text-red-500 mt-1">{errors.itemName}</div>}
              </div>
              <div>
                <label className="block text-sm">Quantité</label>
                <input type="number" className="w-full border rounded px-2 py-1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
                {errors.quantity && <div className="text-xs text-red-500 mt-1">{errors.quantity}</div>}
              </div>
              <div>
                <label className="block text-sm">Unité</label>
                <input className="w-full border rounded px-2 py-1" value={unit} onChange={e => setUnit(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              {stock?.id && <Button variant="ghost" className="mr-auto text-red-600 hover:bg-red-50" onClick={handleDelete}>Supprimer</Button>}
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={save} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
            </div>
          </Card>
        </div>
      </div>
    </WhatsAppModal>
  );
};

const StockAlimentsList = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => { setLoading(true); try { const { data } = await (supabase as any).from('stock_aliments').select('*').order('created_at', { ascending: false }) as any; setItems(data || []); } catch (e) { } finally { setLoading(false); } };
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
