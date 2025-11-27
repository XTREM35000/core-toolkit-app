import React, { useEffect, useState, useRef } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProfileAutocomplete from '@/components/ui/ProfileAutocomplete';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { AvatarUpload } from '@/components/ui/avatar-upload';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  existing?: any;
}

const VenteModal: React.FC<Props> = ({ isOpen, onClose, onSaved, existing }) => {
  const modalOpen = !!isOpen;
  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstRef = useRef<HTMLInputElement | null>(null);

  const qc = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (existing) {
      setClientName(existing.client_name ?? '');
      setClientId(existing.client_id ?? null);
      setQuantity(existing.quantity ?? '');
      setUnitPrice(existing.unit_price ?? '');
      setNotes(existing.notes ?? '');
    } else {
      setClientName('');
      setClientId(null);
      setQuantity('');
      setUnitPrice('');
      setNotes('');
    }
  }, [existing, modalOpen]);

  useEffect(() => { if (firstRef.current) setTimeout(() => firstRef.current?.focus(), 50); }, []);

  const handleSave = async () => {
    setError(null);
    if (!clientName || !quantity || !unitPrice) {
      setError('Client, quantité et prix unitaire sont requis');
      return;
    }
    setLoading(true);
    try {
      const payload: any = {
        client_name: clientName,
        client_id: clientId,
        quantity: Number(quantity),
        unit_price: Number(unitPrice),
        notes: notes || null,
        created_at: new Date().toISOString(),
        status: existing ? existing.status : 'Commande'
      };

      if (avatar) {
        try {
          const ext = avatar.name.split('.').pop();
          const fileName = `ventes/${Date.now()}.${ext}`;
          const { error: upErr } = await supabase.storage.from('public').upload(fileName, avatar as File);
          if (!upErr) {
            const { data } = await supabase.storage.from('public').getPublicUrl(fileName) as any;
            payload.avatar_url = data?.publicUrl ?? null;
          }
        } catch (e) {
          console.warn('avatar upload fallback', e);
        }
      }

      if (existing?.id) {
        await (supabase as any).from('ventes_clients').update(payload).eq('id', existing.id);
        toast({ title: 'Vente mise à jour' });
      } else {
        await (supabase as any).from('ventes_clients').insert(payload);
        toast({ title: 'Vente créée' });
      }

      qc.invalidateQueries({ queryKey: ['ventes_clients'] });
      onSaved && onSaved();
      onClose && onClose();
    } catch (e: any) {
      console.error('Vente save error', e);
      setError(e?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existing?.id) return;
    setLoading(true);
    try {
      await (supabase as any).from('ventes_clients').delete().eq('id', existing.id);
      qc.invalidateQueries({ queryKey: ['ventes_clients'] });
      toast({ title: 'Vente supprimée' });
      onSaved && onSaved();
      onClose && onClose();
    } catch (e: any) {
      console.error('Vente delete error', e);
      setError(e?.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  if (!modalOpen) return null;

  return (
    <WhatsAppModal isOpen={modalOpen} onClose={() => onClose && onClose()} hideHeader className="max-w-3xl">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <ModalHeader
          title={existing ? 'Éditer la vente' : 'Nouvelle vente'}
          subtitle="Saisir les détails de la vente"
          headerGradient="from-emerald-500 to-emerald-600"
          headerLogo={<AnimatedLogo size={36} mainColor="text-white" secondaryColor="text-emerald-300" />}
          onClose={() => onClose && onClose()}
        />

        <div className="p-6 bg-white">
          <Card className="p-4 border-0 shadow-lg">
            {error && <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                <ProfileAutocomplete
                  value={clientName}
                  onSelect={(p) => { setClientId(p?.id ?? null); setClientName(p?.full_name ?? ''); }}
                  placeholder="Rechercher un client"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                <Input value={quantity?.toString() ?? ''} onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')} type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire</label>
                <Input value={unitPrice?.toString() ?? ''} onChange={(e) => setUnitPrice(e.target.value ? Number(e.target.value) : '')} type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[80px] focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo / reçu (optionnel)</label>
              <AvatarUpload value={avatar} onChange={(f) => setAvatar(f)} label="Upload" />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              {existing?.id && (
                <Button variant="ghost" className="mr-auto text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200" onClick={() => setConfirmOpen(true)} disabled={loading}>Supprimer</Button>
              )}

              <Button variant="ghost" onClick={() => onClose && onClose()} className="border border-gray-300 hover:bg-gray-50">Annuler</Button>
              <Button onClick={handleSave} disabled={loading} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200/50">{loading ? 'Enregistrement...' : existing ? 'Enregistrer' : 'Créer'}</Button>
            </div>
          </Card>
        </div>

        <ConfirmModal open={confirmOpen} title={`Supprimer la vente de ${existing?.client_name ?? 'cet enregistrement'}`} description="Cette action est irréversible" confirmLabel="Supprimer" cancelLabel="Annuler" onConfirm={handleDelete} onClose={() => setConfirmOpen(false)} />
      </div>
    </WhatsAppModal>
  );
};

export default VenteModal;
