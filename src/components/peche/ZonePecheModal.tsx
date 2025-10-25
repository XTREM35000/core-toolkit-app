import React, { useEffect, useState } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Zone = { id: string; name: string; createdAt: string };

interface Props { open: boolean; onOpenChange: (open: boolean) => void; zone?: Zone | null; onSaved?: (item: Zone) => void }

const ZonePecheModal: React.FC<Props> = ({ open, onOpenChange, zone = null, onSaved }) => {
  const [name, setName] = useState(zone?.name ?? '');

  useEffect(() => { if (!open) setName(''); else setName(zone?.name ?? ''); }, [open, zone]);
  if (!open) return null;

  const handleSave = () => {
    const now = new Date().toISOString();
    const item: Zone = zone ? { ...zone, name } : { id: `z-${Date.now()}`, name, createdAt: now };
    onSaved?.(item);
    onOpenChange(false);
  };
  return (
    <WhatsAppModal isOpen={open} onClose={() => onOpenChange(false)} hideHeader className="max-w-2xl">
      <div className="bg-white rounded-t-2xl shadow-2xl w-full mx-auto overflow-hidden">
        <ModalHeader title={zone ? 'Éditer une zone' : 'Créer une zone'} subtitle="Infos zone" onClose={() => onOpenChange(false)} />
        <div className="p-4">
          <div className="space-y-3">
            <label className="block">
              <div className="text-sm mb-1">Nom</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={handleSave}>{zone ? 'Enregistrer' : 'Créer'}</Button>
            </div>
          </div>
        </div>
      </div>
    </WhatsAppModal>
  );
};

export default ZonePecheModal;
