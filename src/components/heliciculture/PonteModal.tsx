import React, { useEffect, useRef, useState } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

const PonteModal = ({ open, onOpenChange, ponte, onSaved }: any) => {
  const [form, setForm] = useState<any>({ cohorte_id: null, date_ponte: '', nb_oeufs: 0, observation: '' });
  const [loading, setLoading] = useState(false);
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { if (ponte) setForm({ ...ponte }); else setForm({ cohorte_id: null, date_ponte: '', nb_oeufs: 0, observation: '' }); }, [ponte, open]);
  useEffect(() => { if (firstRef.current) setTimeout(() => firstRef.current?.focus(), 50); }, []);

  const save = async () => {
    if (!form.cohorte_id || !form.date_ponte) return;
    setLoading(true);
    try {
      if (ponte?.id) await (supabase as any).from('pontes_escargots').update(form).eq('id', ponte.id);
      else await (supabase as any).from('pontes_escargots').insert(form);
      onSaved && onSaved();
      onOpenChange(false);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  if (!open) return null;
  return (
    <WhatsAppModal isOpen={open} onClose={() => onOpenChange(false)} hideHeader className="max-w-2xl">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <div className="p-6">
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Date de ponte</label>
                <Input ref={firstRef} type="date" value={form.date_ponte} onChange={(e: any) => setForm({ ...form, date_ponte: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm">Nombre d'œufs</label>
                <Input type="number" value={String(form.nb_oeufs)} onChange={(e: any) => setForm({ ...form, nb_oeufs: Number(e.target.value) })} />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm">Observation</label>
              <Input value={form.observation} onChange={(e: any) => setForm({ ...form, observation: e.target.value })} />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={save} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
            </div>
          </Card>
        </div>
      </div>
    </WhatsAppModal>
  );
};

export default PonteModal;
