import React, { useEffect, useState } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ProfileAutocomplete from '@/components/ui/ProfileAutocomplete';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  existing?: any;
}

const CommandeModal: React.FC<Props> = ({ isOpen, onClose, onSaved, existing }) => {
  const modalOpen = !!isOpen;
  const [supplier, setSupplier] = useState('');
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [expectedAt, setExpectedAt] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    if (existing) {
      setSupplier(existing.supplier_name ?? '');
      setSupplierId(existing.supplier_id ?? null);
      setQuantity(existing.quantity ?? '');
      setUnitPrice(existing.unit_price ?? '');
      setExpectedAt(existing.expected_at ?? '');
      setNotes(existing.notes ?? '');
    } else {
      setSupplier(''); setSupplierId(null); setQuantity(''); setUnitPrice(''); setExpectedAt(''); setNotes('');
    }
  }, [existing, modalOpen]);

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!supplier || !quantity || !unitPrice) { setError('Fournisseur, quantité et prix requis'); return; }
    setLoading(true);
    try {
      const payload: any = {
        supplier_name: supplier,
        supplier_id: supplierId,
        quantity: Number(quantity),
        unit_price: Number(unitPrice),
        expected_at: expectedAt || null,
        notes: notes || null,
        status: existing?.status ?? 'Commandé',
        created_at: new Date().toISOString()
      };

      if (existing?.id) {
        await (supabase as any).from('commande_fournisseurs').update(payload).eq('id', existing.id);
        toast({ title: 'Commande mise à jour' });
      } else {
        await (supabase as any).from('commande_fournisseurs').insert(payload);
        toast({ title: 'Commande créée' });
      }

      qc.invalidateQueries({ queryKey: ['commande_fournisseurs'] });
      onSaved && onSaved();
      onClose && onClose();
    } catch (err: any) {
      console.error('Commande save error', err);
      setError(err?.message || 'Erreur lors de la sauvegarde');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!existing?.id) return;
    setLoading(true);
    try {
      await (supabase as any).from('commande_fournisseurs').delete().eq('id', existing.id);
      qc.invalidateQueries({ queryKey: ['commande_fournisseurs'] });
      toast({ title: 'Commande supprimée' });
      onSaved && onSaved();
      onClose && onClose();
    } catch (err: any) {
      console.error('Delete commande error', err);
      setError(err?.message || 'Erreur lors de la suppression');
    } finally { setLoading(false); setConfirmOpen(false); }
  };

  if (!modalOpen) return null;

  return (
    <WhatsAppModal isOpen={modalOpen} onClose={() => onClose && onClose()} hideHeader className="max-w-3xl">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <ModalHeader title={existing ? 'Éditer commande' : 'Nouvelle commande'} subtitle="Détails de la commande" headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-yellow-300" />} onClose={() => onClose && onClose()} />
        <div className="p-6 bg-white">
          <Card className="p-4 border-0 shadow-lg">
            {error && <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">{error}</div>}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fournisseur</label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <ProfileAutocomplete value={supplier} onSelect={(p) => { setSupplierId(p?.id ?? null); setSupplier(p?.full_name ?? ''); }} placeholder="Rechercher un fournisseur" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                  <Input type="number" value={quantity?.toString() ?? ''} onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire</label>
                  <Input type="number" value={unitPrice?.toString() ?? ''} onChange={(e) => setUnitPrice(e.target.value ? Number(e.target.value) : '')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date attendue</label>
                <Input type="date" value={expectedAt} onChange={(e) => setExpectedAt(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[80px] focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
              </div>

              <div className="flex items-center justify-end gap-3">
                {existing?.id && (
                  <Button variant="ghost" className="mr-auto text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200" onClick={() => setConfirmOpen(true)} disabled={loading}>Supprimer</Button>
                )}

                <Button variant="ghost" onClick={() => onClose && onClose()} className="border border-gray-300 hover:bg-gray-50">Annuler</Button>
                <Button type="submit" disabled={loading} className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-200/50">{loading ? 'Enregistrement...' : existing ? 'Enregistrer' : 'Créer'}</Button>
              </div>
            </form>
          </Card>
        </div>

        <ConfirmModal open={confirmOpen} title={`Supprimer la commande de ${existing?.supplier_name ?? 'cet enregistrement'}`} description="Cette action est irréversible" confirmLabel="Supprimer" cancelLabel="Annuler" onConfirm={handleDelete} onClose={() => setConfirmOpen(false)} />
      </div>
    </WhatsAppModal>
  );
};

export default CommandeModal;
