import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal.tsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import db from '@/integrations/supabase/db';

const BassinsModal = ({ open, onOpenChange, bassin, onSaved }: any) => {
  const [form, setForm] = useState<{ nom: string; type_bassin: string; volume_m3: number; statut: string }>({ nom: '', type_bassin: '', volume_m3: 0, statut: 'actif' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ nom?: string; volume_m3?: string }>({});

  useEffect(() => {
    if (bassin) setForm(bassin);
    else setForm({ nom: '', type_bassin: '', volume_m3: 0, statut: 'actif' });
  }, [bassin, open]);

  const save = async () => {
    // Client-side validation
    const newErrors: { nom?: string; volume_m3?: string } = {};
    if (!form.nom || form.nom.trim().length < 2) newErrors.nom = 'Le nom est requis (min 2 caractères)';
    if (isNaN(form.volume_m3) || form.volume_m3 <= 0) newErrors.volume_m3 = 'Le volume doit être un nombre positif';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    try {
      if (bassin && bassin.id) {
        await db.updateOne('bassins_piscicoles', bassin.id, form);
      } else {
        await db.insertOne('bassins_piscicoles', form);
      }
      onSaved && onSaved();
    } catch (e) {
      console.error('Save bassin error', e);
    } finally {
      setSaving(false);
      onOpenChange(false);
    }
  };

  const handleDelete = async () => {
    if (!bassin?.id) return;
    const confirmed = window.confirm('Supprimer ce bassin ? Cette action est irréversible.');
    if (!confirmed) return;
    try {
      await db.deleteOne('bassins_piscicoles', bassin.id);
      onSaved && onSaved();
    } catch (e) {
      console.error('Delete bassin error', e);
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={bassin ? 'Edit Bassin' : 'Create Bassin'}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm">Nom</label>
          <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          {errors.nom && <div className="text-xs text-red-500 mt-1">{errors.nom}</div>}
        </div>
        <div>
          <label className="block text-sm">Type</label>
          <Input value={form.type_bassin} onChange={(e) => setForm({ ...form, type_bassin: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm">Volume m3</label>
          <Input type="number" value={form.volume_m3} onChange={(e) => setForm({ ...form, volume_m3: Number(e.target.value) })} />
        </div>
        <div className="flex justify-between gap-2 items-center">
          <div>
            {bassin && bassin.id && (
              <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Enregistrer'}</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BassinsModal;
