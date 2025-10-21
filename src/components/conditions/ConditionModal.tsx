import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal.tsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const ConditionModal = ({ open, onOpenChange, condition, onSaved }: any) => {
  const [form, setForm] = useState<any>({ temperature: 0, ph: 7, oxygen: 0 });

  useEffect(() => {
    if (condition) setForm(condition);
    else setForm({ temperature: 0, ph: 7, oxygen: 0 });
  }, [condition, open]);

  const save = async () => {
    try {
      if (condition?.id) await (supabase as any).from('conditions_environnement').update(form).eq('id', condition.id);
      else await (supabase as any).from('conditions_environnement').insert(form);
      onSaved && onSaved();
    } catch (e) {}
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={condition ? 'Edit Condition' : 'Nouvelle condition'}>
      <div className="space-y-3">
        <div><label className="block text-sm">Température (°C)</label><Input type="number" value={form.temperature} onChange={(e) => setForm({...form, temperature: Number(e.target.value)})} /></div>
        <div><label className="block text-sm">pH</label><Input type="number" step="0.1" value={form.ph} onChange={(e) => setForm({...form, ph: Number(e.target.value)})} /></div>
        <div><label className="block text-sm">Oxygène (mg/L)</label><Input type="number" value={form.oxygen} onChange={(e) => setForm({...form, oxygen: Number(e.target.value)})} /></div>
        <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div>
      </div>
    </Modal>
  );
};

export default ConditionModal;

