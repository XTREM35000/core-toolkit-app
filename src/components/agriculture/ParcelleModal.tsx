import React, { useEffect, useState } from 'react';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Parcelle = { id: string; name: string; createdAt: string };

interface Props { open: boolean; onOpenChange: (open: boolean) => void; parcelle?: Parcelle | null; onSaved?: (item: Parcelle) => void }

const ParcelleModal: React.FC<Props> = ({ open, onOpenChange, parcelle = null, onSaved }) => {
  const [name, setName] = useState(parcelle?.name ?? '');

  useEffect(() => { if (!open) setName(''); else setName(parcelle?.name ?? ''); }, [open, parcelle]);
  if (!open) return null;

  const handleSave = () => {
    const now = new Date().toISOString();
    const item: Parcelle = parcelle ? { ...parcelle, name } : { id: `pa-${Date.now()}`, name, createdAt: now };
    onSaved?.(item);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="bg-white rounded-xl shadow-md w-full max-w-2xl z-50 overflow-hidden">
        <ModalHeader title={parcelle ? 'Éditer une parcelle' : 'Créer une parcelle'} subtitle="Infos parcelle" onClose={() => onOpenChange(false)} />
        <div className="p-4">
          <div className="space-y-3">
            <label className="block">
              <div className="text-sm mb-1">Nom</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={handleSave}>{parcelle ? 'Enregistrer' : 'Créer'}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelleModal;
