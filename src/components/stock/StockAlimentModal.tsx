import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal.tsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import db from '@/integrations/supabase/db';

type StockItem = { id?: string; nom?: string; quantite?: number; unite?: string };

const StockAlimentModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; item?: StockItem | null; onSaved?: () => void }> = ({ open, onOpenChange, item, onSaved }) => {
  const [form, setForm] = useState<StockItem>({ nom: '', quantite: 0, unite: 'kg' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ nom?: string; quantite?: string }>({});

  useEffect(() => { if (item) setForm(item); else setForm({ nom: '', quantite: 0, unite: 'kg' }); }, [item, open]);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.nom || form.nom.trim().length < 2) e.nom = 'Nom requis (min 2 caractères)';
    if (form.quantite == null || isNaN(Number(form.quantite)) || Number(form.quantite) < 0) e.quantite = 'Quantité doit être >= 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (item?.id) await db.updateOne('stock_aliments', item.id, form);
      else await db.insertOne('stock_aliments', form);
      onSaved && onSaved();
    } catch (err) { console.error('Save stock error', err); }
    finally { setSaving(false); onOpenChange(false); }
  };

  const handleDelete = async () => {
    if (!item?.id) return; if (!window.confirm('Supprimer cet aliment ?')) return;
    try { await db.deleteOne('stock_aliments', item.id); onSaved && onSaved(); } catch (err) { console.error('Delete stock error', err); } finally { onOpenChange(false); }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={item?.id ? 'Editer aliment' : 'Nouvel aliment'}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm">Nom</label>
          <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          {errors.nom && <div className="text-xs text-red-500 mt-1">{errors.nom}</div>}
        </div>
        <div>
          <label className="block text-sm">Quantité</label>
          <Input type="number" value={form.quantite} onChange={(e) => setForm({ ...form, quantite: Number(e.target.value) })} />
          {errors.quantite && <div className="text-xs text-red-500 mt-1">{errors.quantite}</div>}
        </div>
        <div className="flex justify-between items-center">
          <div>{item?.id && <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>}</div>
          <div className="flex gap-2"><Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button><Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Enregistrer'}</Button></div>
        </div>
      </div>
    </Modal>
  );
};

export default StockAlimentModal;
