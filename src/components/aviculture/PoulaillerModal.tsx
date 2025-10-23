import React, { useEffect, useState } from 'react';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Poulailler = { id: string; name: string; createdAt: string };

interface Props { open: boolean; onOpenChange: (open: boolean) => void; poulailler?: Poulailler | null; onSaved?: (item: Poulailler) => void }

const PoulaillerModal: React.FC<Props> = ({ open, onOpenChange, poulailler = null, onSaved }) => {
  const [name, setName] = useState(poulailler?.name ?? '');

  useEffect(() => { if (!open) setName(''); else setName(poulailler?.name ?? ''); }, [open, poulailler]);
  if (!open) return null;

  const handleSave = () => {
    const now = new Date().toISOString();
    const item: Poulailler = poulailler
      ? { ...poulailler, name }
      : { id: `p-${Date.now()}`, name, createdAt: now };
    onSaved?.(item);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="bg-white rounded-xl shadow-md w-full max-w-2xl z-50 overflow-hidden">
        <ModalHeader title={poulailler ? 'Éditer un poulailler' : 'Créer un poulailler'} subtitle="Informations du poulailler" onClose={() => onOpenChange(false)} />
        <div className="p-4">
          <div className="space-y-3">
            <label className="block">
              <div className="text-sm mb-1">Nom</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={handleSave}>{poulailler ? 'Enregistrer' : 'Créer'}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoulaillerModal;
