
import { useState, FormEvent } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
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
  venteId?: string | null;
  onSaved?: () => void;
}

const EncaissementModal = ({ isOpen, open, onClose, onOpenChange, venteId, onSaved }: Props) => {
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

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!amount || !venteId) return;
    setLoading(true);
    try {
      const payload = { vente_id: venteId, amount: Number(amount), method, date: date || new Date().toISOString(), created_at: new Date().toISOString() } as any;
      const { error } = await (supabase as any).from('encaissements').insert(payload);
      if (error) throw error;
      // mark vente as payé/encaisse
      await (supabase as any).from('ventes_clients').update({ status: 'Payé' }).eq('id', venteId);
      onSaved?.();
      qc.invalidateQueries({ queryKey: ['encaissements'] });
      qc.invalidateQueries({ queryKey: ['ventes_clients'] });
      toast({ title: 'Encaissement enregistré', description: 'Paiement client enregistré et vente marquée payée.' });
      setOpen(false);
    } catch (err) {
      console.error('Encaissement save error', err);
    } finally {
      setLoading(false);
    }
  };

  if (!modalOpen) return null;

  return (
    <WhatsAppModal isOpen={modalOpen} onClose={() => setOpen(false)} hideHeader className="max-w-md">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <ModalHeader title="Encaissement" subtitle="Enregistrer un paiement client" headerLogo={<AnimatedLogo size={36} mainColor="text-white" secondaryColor="text-indigo-300" />} onClose={() => setOpen(false)} />

        <div className="p-6 bg-white">
          <Card className="p-4 border-0 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                <Input type="number" value={amount?.toString() ?? ''} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Méthode</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>Espèces</option>
                  <option>Virement</option>
                  <option>Chèque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="border border-gray-300 hover:bg-gray-50"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200/50"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer paiement'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </WhatsAppModal>
  );
};

export default EncaissementModal;
