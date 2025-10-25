import React, { useEffect, useState } from 'react';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Clapier = { id: string; name: string; createdAt: string };

interface Props { open: boolean; onOpenChange: (open: boolean) => void; clapier?: Clapier | null; onSaved?: (item: Clapier) => void }

const ClapierModal: React.FC<Props> = ({ open, onOpenChange, clapier = null, onSaved }) => {
  const [name, setName] = useState(clapier?.name ?? '');

  useEffect(() => { if (!open) setName(''); else setName(clapier?.name ?? ''); }, [open, clapier]);
  if (!open) return null;

  const handleSave = () => {
    const now = new Date().toISOString();
    const item: Clapier = clapier ? { ...clapier, name } : { id: `c-${Date.now()}`, name, createdAt: now };
    onSaved?.(item);
    onOpenChange(false);
  };

  return (
    <WhatsAppModal isOpen={open} onClose={() => onOpenChange(false)} hideHeader className="max-w-2xl">
      <div className="bg-white rounded-t-3xl shadow-md w-full mx-auto overflow-visible">
        <ModalHeader title={clapier ? 'Éditer un clapier' : 'Créer un clapier'} subtitle="Infos clapier" onClose={() => onOpenChange(false)} />
        <div className="p-4">
          <div className="space-y-3">
            <label className="block">
              <div className="text-sm mb-1">Nom</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={handleSave}>{clapier ? 'Enregistrer' : 'Créer'}</Button>
            </div>
          </div>
        </div>
      </div>
    </WhatsAppModal>
  );
};

export default ClapierModal;
