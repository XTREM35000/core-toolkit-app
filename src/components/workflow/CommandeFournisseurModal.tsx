import React, { useState, useEffect } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { ModalHeader } from './shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

const CommandeFournisseurModal = ({ isOpen, open, onClose, onOpenChange, onSaved }: Props) => {
  const modalOpen = typeof open === 'boolean' ? open : !!isOpen;
  const setOpen = (v: boolean) => {
    if (typeof onOpenChange === 'function') onOpenChange(v);
    else if (typeof onClose === 'function' && v === false) onClose();
  };

  const [supplier, setSupplier] = useState('');
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [openCreateSupplier, setOpenCreateSupplier] = useState(false);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [expectedAt, setExpectedAt] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    if (!modalOpen) {
      setSupplier(''); setQuantity(''); setUnitPrice(''); setExpectedAt(''); setNotes(''); setError(null);
    }
  }, [modalOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!supplier || !quantity || !unitPrice) {
      setError('Fournisseur, quantité et prix unitaire sont requis');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        supplier_name: supplier,
        supplier_id: supplierId,
        quantity: Number(quantity),
        unit_price: Number(unitPrice),
        expected_at: expectedAt || null,
        notes: notes || null,
        status: 'Commandé',
        created_at: new Date().toISOString()
      } as any;

      const { error } = await (supabase as any).from('commande_fournisseurs').insert(payload);
      if (error) throw error;
      onSaved?.();
      qc.invalidateQueries({ queryKey: ['commande_fournisseurs'] });
      toast({ title: 'Commande créée', description: 'La commande fournisseur a été créée avec succès.' });
      setOpen(false);
    } catch (err: any) {
      console.error('Save commande error', err);
      setError(err?.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (!modalOpen) return null;

  return (
    <WhatsAppModal isOpen={modalOpen} onClose={() => setOpen(false)} hideHeader className="max-w-3xl">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <ModalHeader
          title="Nouvelle commande fournisseur"
          subtitle="Saisir les détails de la commande"
          headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-yellow-300" />}
          onClose={() => setOpen(false)}
        />

        <div className="p-6 bg-white">
          <Card className="p-4 border-0 shadow-lg">
            {error && (
              <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm">Fournisseur</label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <ProfileAutocomplete value={supplier} onSelect={(p) => { setSupplierId(p?.id ?? null); setSupplier(p?.full_name ?? ''); }} placeholder="Rechercher un fournisseur" onCreateSuggestion={(name) => { setOpenCreateSupplier(true); setSupplier(name); }} />
                  </div>
                  <Button variant="ghost" onClick={() => setOpenCreateSupplier(true)} className="border border-gray-200 hover:bg-gray-50">Créer</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm">Quantité</label>
                  <Input value={quantity?.toString() ?? ''} onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')} type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm">Prix unitaire</label>
                  <Input value={unitPrice?.toString() ?? ''} onChange={(e) => setUnitPrice(e.target.value ? Number(e.target.value) : '')} type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm">Date attendue</label>
                <Input type="date" value={expectedAt} onChange={(e) => setExpectedAt(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[80px] focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={() => setOpen(false)} className="border border-gray-300 hover:bg-gray-50">Annuler</Button>
                <Button type="submit" disabled={loading} className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-200/50">{loading ? 'Enregistrement...' : 'Créer la commande'}</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
      <CreateProfileModal isOpen={openCreateSupplier} onClose={() => setOpenCreateSupplier(false)} role="supplier" initialName={supplier} onCreated={(p) => { setSupplierId(p.id); setSupplier(p.full_name); }} />
    </WhatsAppModal>
  );

  // Render create modal for supplier
  // (Placed after main return to keep component structure simple)
  // Note: this will never be reached because of the return above, so we need to render create modal inside the returned JSX.

  return (
    <>
      {/* main markup already returned above */}
    </>
  );
};

export default CommandeFournisseurModal;
