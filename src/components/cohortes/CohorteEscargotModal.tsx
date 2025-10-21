import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal.tsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const CohorteEscargotModal = ({ open, onOpenChange, cohort, onSaved }: any) => {
  const [form, setForm] = useState<any>({ nom: '', race: '', nombre: 0 });
  useEffect(() => { if (cohort) setForm(cohort); else setForm({ nom: '', race: '', nombre: 0 }); }, [cohort, open]);
  const save = async () => { try { if (cohort?.id) await (supabase as any).from('cohortes_escargots').update(form).eq('id', cohort.id); else await (supabase as any).from('cohortes_escargots').insert(form); onSaved && onSaved(); } catch (e) {} onOpenChange(false); };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={cohort ? 'Edit Cohorte Escargot' : 'Nouvelle cohorte'}>
      <div className="space-y-3">
        <div><label className="block text-sm">Nom</label><Input value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} /></div>
        <div><label className="block text-sm">Race</label><Input value={form.race} onChange={(e) => setForm({...form, race: e.target.value})} /></div>
        <div><label className="block text-sm">Nombre</label><Input type="number" value={form.nombre} onChange={(e) => setForm({...form, nombre: Number(e.target.value)})} /></div>
        <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div>
      </div>
    </Modal>
  );
};

export default CohorteEscargotModal;

