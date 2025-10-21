import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal.tsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const ParcHelicicoleModal = ({ open, onOpenChange, parc, onSaved }: any) => {
  const [form, setForm] = useState<any>({ nom: '', location: '' });

  useEffect(() => { if (parc) setForm(parc); else setForm({ nom: '', location: '' }); }, [parc, open]);

  const save = async () => { try { if (parc?.id) await (supabase as any).from('parcs_helicicoles').update(form).eq('id', parc.id); else await (supabase as any).from('parcs_helicicoles').insert(form); onSaved && onSaved(); } catch (e) {} onOpenChange(false); };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={parc ? 'Edit Parc' : 'Nouveau parc'}>
      <div className="space-y-3">
        <div><label className="block text-sm">Nom</label><Input value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} /></div>
        <div><label className="block text-sm">Localisation</label><Input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} /></div>
        <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div>
      </div>
    </Modal>
  );
};

export default ParcHelicicoleModal;

