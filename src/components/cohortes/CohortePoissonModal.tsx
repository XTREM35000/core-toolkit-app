import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal.tsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const CohortePoissonModal = ({ open, onOpenChange, cohort, onSaved }: any) => {
  const [form, setForm] = useState<any>({ espece: '', nombre_initial: 0, poids_initial_kg: 0, statut: 'en_elevage' });

  useEffect(() => { if (cohort) setForm(cohort); else setForm({ espece: '', nombre_initial: 0, poids_initial_kg: 0, statut: 'en_elevage' }); }, [cohort, open]);

  const save = async () => {
    try {
      if (cohort?.id) await (supabase as any).from('cohortes_poissons').update(form).eq('id', cohort.id);
      else await (supabase as any).from('cohortes_poissons').insert(form);
      onSaved && onSaved();
    } catch (e) {}
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={cohort ? 'Edit Cohorte Poisson' : 'Create Cohorte'}>
      <div className="space-y-3">
        <div><label className="block text-sm">Espèce</label><Input value={form.espece} onChange={(e) => setForm({...form, espece: e.target.value})} /></div>
        <div><label className="block text-sm">Nombre initial</label><Input type="number" value={form.nombre_initial} onChange={(e) => setForm({...form, nombre_initial: Number(e.target.value)})} /></div>
        <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={save}>Save</Button></div>
      </div>
    </Modal>
  );
};

export default CohortePoissonModal;

