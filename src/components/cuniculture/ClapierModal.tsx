import React, { useEffect, useState } from 'react';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="bg-white rounded-xl shadow-md w-full max-w-2xl z-50 overflow-hidden">
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
    </div>
  );
};

export default ClapierModal;
