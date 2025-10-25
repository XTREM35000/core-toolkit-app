import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';

interface Tank {
  id: string;
  name: string;
  capacity: number;
  type: string;
}

interface TankFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<Tank> | null;
  onSaved?: (tank: Tank) => void;
}

const TankForm: React.FC<TankFormProps> = ({ open, onOpenChange, initial = null, onSaved }) => {
  const [name, setName] = React.useState(initial?.name ?? '');
  const [capacity, setCapacity] = React.useState<string>(initial?.capacity ? String(initial.capacity) : '');
  const [type, setType] = React.useState(initial?.type ?? 'poisson');
  const [errors, setErrors] = React.useState<{ name?: string; capacity?: string }>({});
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setCapacity(initial?.capacity ? String(initial.capacity) : '');
      setType(initial?.type ?? 'poisson');
      setErrors({});
    }
  }, [open, initial]);

  if (!open) return null;

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Le nom est requis.';
    const cap = Number(capacity);
    if (!capacity || Number.isNaN(cap) || cap <= 0) e.capacity = 'Capacité doit être un nombre positif.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const newTank: Tank = {
        id: String(Date.now()),
        name: name.trim(),
        capacity: Number(capacity),
        type: type || 'poisson',
      };

      // Simulate small delay to show saving state (mock persistence)
      await new Promise((r) => setTimeout(r, 250));

      onSaved?.(newTank);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <WhatsAppModal isOpen={open} onClose={() => onOpenChange(false)} hideHeader className="max-w-md">
      <div role="dialog" aria-modal="true" aria-label={initial ? 'Éditer un bac' : 'Créer un bac'} className="bg-white rounded-t-3xl shadow-lg p-6 w-full max-w-md mx-auto overflow-visible">
        <ModalHeader title={initial ? 'Éditer un bac' : 'Créer un bac'} subtitle="Informations du bac" onClose={() => onOpenChange(false)} />
        <div className="space-y-3">
          <label className="block">
            <div className="text-xs text-gray-600 mb-1">Nom du bac</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du bac" />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </label>

          <label className="block">
            <div className="text-xs text-gray-600 mb-1">Capacité (L)</div>
            <Input value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Capacité (L)" />
            {errors.capacity && <p className="text-red-600 text-xs mt-1">{errors.capacity}</p>}
          </label>

          <label className="block">
            <div className="text-xs text-gray-600 mb-1">Type</div>
            <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Type (poisson/escargot)" />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>Annuler</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</Button>
        </div>
      </div>
    </WhatsAppModal>
  );
};

export default TankForm;
