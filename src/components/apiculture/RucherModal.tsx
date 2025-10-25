import React, { useEffect, useState } from 'react';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Rucher = { id: string; name: string; createdAt: string };

interface Props { open: boolean; onOpenChange: (open: boolean) => void; rucher?: Rucher | null; onSaved?: (item: Rucher) => void }

const RucherModal: React.FC<Props> = ({ open, onOpenChange, rucher = null, onSaved }) => {
  const [name, setName] = useState(rucher?.name ?? '');

  useEffect(() => { if (!open) setName(''); else setName(rucher?.name ?? ''); }, [open, rucher]);
  if (!open) return null;

  const handleSave = () => {
    const now = new Date().toISOString();
    const item: Rucher = rucher ? { ...rucher, name } : { id: `r-${Date.now()}`, name, createdAt: now };
    onSaved?.(item);
    onOpenChange(false);
  };
  return (
    <WhatsAppModal isOpen={open} onClose={() => onOpenChange(false)} hideHeader className="max-w-2xl">
      <div className="bg-white rounded-t-3xl shadow-md w-full max-w-2xl mx-auto overflow-visible">
        <ModalHeader title={rucher ? 'Éditer un rucher' : 'Créer un rucher'} subtitle="Infos rucher" onClose={() => onOpenChange(false)} />
        <div className="p-4">
          <div className="space-y-3">
            <label className="block">
              <div className="text-sm mb-1">Nom</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={handleSave}>{rucher ? 'Enregistrer' : 'Créer'}</Button>
            </div>
          </div>
        </div>
      </div>
    </WhatsAppModal>
  );
};

export default RucherModal;
