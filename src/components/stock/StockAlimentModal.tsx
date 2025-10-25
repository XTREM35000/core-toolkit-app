import React, { useEffect, useState, useRef } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import db from '@/integrations/supabase/db';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

type StockItem = { id?: string; item_name?: string; quantity?: number; unit?: string };

const StockAlimentModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; stock?: StockItem | null; onSaved?: () => void }> = ({ open, onOpenChange, stock, onSaved }) => {
  const [form, setForm] = useState<StockItem>({ item_name: '', quantity: 0, unit: 'kg' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ item_name?: string; quantity?: string }>({});
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { if (stock) setForm(stock); else setForm({ item_name: '', quantity: 0, unit: 'kg' }); }, [stock, open]);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.item_name || form.item_name.trim().length < 2) e.item_name = 'Nom requis (min 2 caractères)';
    if (form.quantity == null || isNaN(Number(form.quantity)) || Number(form.quantity) < 0) e.quantity = 'Quantité doit être >= 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (stock?.id) await db.updateOne('stock_aliments', stock.id, { item_name: form.item_name, quantity: form.quantity, unit: form.unit });
      else await db.insertOne('stock_aliments', { item_name: form.item_name, quantity: form.quantity, unit: form.unit });
      onSaved && onSaved();
    } catch (err) { console.error('Save stock error', err); }
    finally { setSaving(false); onOpenChange(false); }
  };

  const handleDelete = async () => {
    if (!stock?.id) return; if (!window.confirm('Supprimer cet aliment ?')) return;
    try { await db.deleteOne('stock_aliments', stock.id); onSaved && onSaved(); } catch (err) { console.error('Delete stock error', err); } finally { onOpenChange(false); }
  };

  // don't render when closed (after hooks)
  if (!open) return null;

  return (
    <WhatsAppModal isOpen={open} onClose={() => onOpenChange(false)} hideHeader className="max-w-2xl">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <ModalHeader
          title={stock?.id ? 'Editer aliment' : 'Ajouter un aliment'}
          subtitle="Détails de l'aliment"
          headerGradient="from-purple-500 to-purple-600"
          headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-purple-300" />}
          onClose={() => onOpenChange(false)}
        />

        <div className="p-6 bg-white">
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Nom</label>
                <Input ref={firstRef} value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} />
                {errors.item_name && <div className="text-xs text-red-500 mt-1">{errors.item_name}</div>}
              </div>
              <div>
                <label className="block text-sm">Quantité</label>
                <Input type="number" value={String(form.quantity)} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
                {errors.quantity && <div className="text-xs text-red-500 mt-1">{errors.quantity}</div>}
              </div>
            </div>

            <div className="mt-4 flex justify-end items-center gap-3">
              {stock?.id && <Button variant="ghost" className="mr-auto text-red-600 hover:bg-red-50" onClick={handleDelete}>Supprimer</Button>}
              <div className="flex gap-2"><Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button><Button onClick={save} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button></div>
            </div>
          </Card>
        </div>
      </div>
    </WhatsAppModal>
  );
};

export default StockAlimentModal;
