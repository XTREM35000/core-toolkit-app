import React, { useState } from 'react';
import { ModalHeader } from './shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import ProfileAutocomplete from '@/components/ui/ProfileAutocomplete';
import CreateProfileModal from '@/components/workflow/CreateProfileModal';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (v: boolean) => void;
  onSaved?: () => void;
}

const VenteClientModal = ({ isOpen, open, onClose, onOpenChange, onSaved }: Props) => {
  const modalOpen = typeof open === 'boolean' ? open : !!isOpen;
  const setOpen = (v: boolean) => {
    if (typeof onOpenChange === 'function') onOpenChange(v);
    else if (typeof onClose === 'function' && v === false) onClose();
  };

  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState<string | null>(null);
  const [openCreateClient, setOpenCreateClient] = useState(false);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!clientName || !quantity || !unitPrice) return;
    setLoading(true);
    try {
      const payload = { client_name: clientName, client_id: clientId, quantity: Number(quantity), unit_price: Number(unitPrice), notes, created_at: new Date().toISOString(), status: 'Commande' } as any;
      const { error } = await (supabase as any).from('ventes_clients').insert(payload);
      if (error) throw error;
      onSaved?.();
      qc.invalidateQueries({ queryKey: ['ventes_clients'] });
      toast({ title: 'Vente créée', description: 'La vente client a été créée avec succès.' });
      setOpen(false);
    } catch (err) {
      console.error('Vente save error', err);
    } finally {
      setLoading(false);
    }
  };

  if (!modalOpen) return null;

  return (
    <>
      <WhatsAppModal isOpen={modalOpen} onClose={() => setOpen(false)} hideHeader className="max-w-xl">
        <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
          <ModalHeader title="Nouvelle vente" subtitle="Saisir la commande client" headerLogo={<AnimatedLogo size={32} />} onClose={() => setOpen(false)} />
          <div className="p-6 bg-white">
            <Card className="p-4 border-0 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm">Client</label>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <ProfileAutocomplete value={clientName} onSelect={(p) => { setClientId(p?.id ?? null); setClientName(p?.full_name ?? ''); }} placeholder="Rechercher un client" onCreateSuggestion={(name) => { setOpenCreateClient(true); setClientName(name); }} />
                    </div>
                    <Button variant="ghost" onClick={() => setOpenCreateClient(true)} className="border border-gray-200 hover:bg-gray-50">Créer</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm">Quantité</label>
                    <Input type="number" value={quantity?.toString() ?? ''} onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm">Prix unitaire</label>
                    <Input type="number" value={unitPrice?.toString() ?? ''} onChange={(e) => setUnitPrice(e.target.value ? Number(e.target.value) : '')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm">Notes</label>
                  <textarea className="w-full border rounded px-2 py-1 min-h-[64px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
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
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200/50"
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </WhatsAppModal>

      <CreateProfileModal isOpen={openCreateClient} onClose={() => setOpenCreateClient(false)} role="client" initialName={clientName} onCreated={(p) => { setClientId(p.id); setClientName(p.full_name); }} />
    </>
  );
};

export default VenteClientModal;
