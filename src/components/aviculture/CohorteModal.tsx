import React, { useEffect, useState } from 'react';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Cohorte = { id: string; name: string };

interface Props { open: boolean; onOpenChange: (open: boolean) => void; cohorte?: Cohorte | null; onSaved?: (item: Cohorte) => void }

const CohorteModal: React.FC<Props> = ({ open, onOpenChange, cohorte = null, onSaved }) => {
  const [name, setName] = useState(cohorte?.name ?? '');

  useEffect(() => { if (!open) setName(''); else setName(cohorte?.name ?? ''); }, [open, cohorte]);
  if (!open) return null;

  const handleSave = () => {
    const now = new Date().toISOString();
    const item: Cohorte = cohorte ? { ...cohorte, name } : { id: `cp-${Date.now()}`, name };
    onSaved?.(item);
    onOpenChange(false);
  };
  return (
    <WhatsAppModal isOpen={open} onClose={() => onOpenChange(false)} hideHeader className="max-w-lg">
      <div className="bg-white rounded-t-3xl shadow-md w-full max-w-lg mx-auto overflow-visible">
        <ModalHeader title={cohorte ? 'Éditer une cohorte' : 'Créer une cohorte'} subtitle="Informations de la cohorte" onClose={() => onOpenChange(false)} />
        <div className="p-4">
          <div className="space-y-3">
            <label className="block">
              <div className="text-sm mb-1">Nom</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={handleSave}>{cohorte ? 'Enregistrer' : 'Créer'}</Button>
            </div>
          </div>
        </div>
      </div>
    </WhatsAppModal>
  );
};

export default CohorteModal;
