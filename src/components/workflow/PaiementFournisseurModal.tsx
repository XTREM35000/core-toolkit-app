import React, { useState } from 'react';
import { ModalHeader } from './shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (v: boolean) => void;
  commandeId?: string | null;
  onSaved?: () => void;
}

const PaiementFournisseurModal = ({ isOpen, open, onClose, onOpenChange, commandeId, onSaved }: Props) => {
  const modalOpen = typeof open === 'boolean' ? open : !!isOpen;
  const setOpen = (v: boolean) => {
    if (typeof onOpenChange === 'function') onOpenChange(v);
    else if (typeof onClose === 'function' && v === false) onClose();
  };

  const [amount, setAmount] = useState<number | ''>('');
  const [method, setMethod] = useState('Espèces');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!amount || !commandeId) return;
    setLoading(true);
    try {
      const payload = { commande_id: commandeId, amount: Number(amount), method, date: date || new Date().toISOString(), created_at: new Date().toISOString() } as any;
      const { error } = await (supabase as any).from('paiements_fournisseurs').insert(payload);
      if (error) throw error;
      // mark commande as payé
      await (supabase as any).from('commande_fournisseurs').update({ status: 'Payé' }).eq('id', commandeId);
      onSaved?.();
      qc.invalidateQueries({ queryKey: ['commande_fournisseurs'] });
      toast({ title: 'Paiement enregistré', description: 'Le paiement fournisseur a été enregistré.' });
      setOpen(false);
    } catch (err) {
      console.error('Paiement save error', err);
    } finally {
      setLoading(false);
    }
  };

  if (!modalOpen) return null;

  return (
    <WhatsAppModal isOpen={modalOpen} onClose={() => setOpen(false)} hideHeader className="max-w-md">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <ModalHeader title="Paiement fournisseur" subtitle="Enregistrer un paiement" headerLogo={<AnimatedLogo size={36} />} onClose={() => setOpen(false)} />
        <div className="p-6">
          <Card className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm">Montant</label>
                <Input type="number" value={amount?.toString() ?? ''} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')} />
              </div>
              <div>
                <label className="block text-sm">Méthode</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full border rounded px-2 py-1">
                  <option>Espèces</option>
                  <option>Virement</option>
                  <option>Chèque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
                <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer paiement'}</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </WhatsAppModal>
  );
};

export default PaiementFournisseurModal;
