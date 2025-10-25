import React, { useEffect, useRef, useState } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

const MesureModal = ({ open, onOpenChange, mesure, onSaved }: any) => {
  const [form, setForm] = useState<any>({ date: '', poids_moyen: 0, taux_survie: 100, cohorte_id: null });
  const [loading, setLoading] = useState(false);
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { if (mesure) setForm({ ...mesure }); else setForm({ date: '', poids_moyen: 0, taux_survie: 100, cohorte_id: null }); }, [mesure, open]);
  useEffect(() => { if (firstRef.current) setTimeout(() => firstRef.current?.focus(), 50); }, []);

  const save = async () => {
    if (!form.date) return;
    setLoading(true);
    try {
      if (mesure?.id) await (supabase as any).from('mesures_escargots').update(form).eq('id', mesure.id);
      else await (supabase as any).from('mesures_escargots').insert(form);
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
                <label className="block text-sm">Date</label>
                <Input ref={firstRef} type="date" value={form.date} onChange={(e: any) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm">Poids moyen (g)</label>
                <Input type="number" value={String(form.poids_moyen)} onChange={(e: any) => setForm({ ...form, poids_moyen: Number(e.target.value) })} />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm">Taux de survie (%)</label>
              <Input type="number" value={String(form.taux_survie)} onChange={(e: any) => setForm({ ...form, taux_survie: Number(e.target.value) })} />
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

export default MesureModal;
