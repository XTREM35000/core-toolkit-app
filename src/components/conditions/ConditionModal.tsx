import React, { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

const ConditionModal = ({ open, onOpenChange, condition, onSaved }: any) => {
  const [form, setForm] = useState<any>({ temperature: 0, ph: 7, oxygen: 0 });
  const firstRef = useRef<HTMLInputElement | null>(null);

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

  // don't render when closed
  if (!open) return null;

  return (
    <div data-debug="ConditionModal" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-50 overflow-hidden">
        <ModalHeader
          title={condition ? 'Edit Condition' : 'Nouvelle mesure'}
          subtitle="Mesures environnementales"
          headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-blue-300" />}
          onClose={() => onOpenChange(false)}
        />

        <div className="p-6 bg-white">
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm">Température (°C)</label>
                <Input ref={firstRef} type="number" value={form.temperature} onChange={(e) => setForm({...form, temperature: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm">pH</label>
                <Input type="number" step="0.1" value={form.ph} onChange={(e) => setForm({...form, ph: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm">Oxygène (mg/L)</label>
                <Input type="number" value={form.oxygen} onChange={(e) => setForm({...form, oxygen: Number(e.target.value)})} />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={save}>Enregistrer</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConditionModal;

