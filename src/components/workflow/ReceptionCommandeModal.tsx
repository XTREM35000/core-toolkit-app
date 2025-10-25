import React, { useState, useEffect } from 'react';
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

const ReceptionCommandeModal = ({ isOpen, open, onClose, onOpenChange, commandeId, onSaved }: Props) => {
  const modalOpen = typeof open === 'boolean' ? open : !!isOpen;
  const setOpen = (v: boolean) => {
    if (typeof onOpenChange === 'function') onOpenChange(v);
    else if (typeof onClose === 'function' && v === false) onClose();
  };

  const [deliveredQty, setDeliveredQty] = useState<number | ''>('');
  const [qualityNotes, setQualityNotes] = useState('');
  const [status, setStatus] = useState('En attente');
  const [loading, setLoading] = useState(false);
  const [commande, setCommande] = useState<any | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    if (!modalOpen) {
      setDeliveredQty(''); setQualityNotes(''); setStatus('En attente'); setCommande(null);
      return;
    }

    if (commandeId) {
      (async () => {
        const { data } = await (supabase as any).from('commande_fournisseurs').select('*').eq('id', commandeId).single();
        setCommande(data);
      })();
    }
  }, [modalOpen, commandeId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      if (!commandeId) throw new Error('Commande introuvable');
      const delivered = Number(deliveredQty || 0);
      // Update commande with delivered qty and quality
      const { error } = await (supabase as any).from('commande_fournisseurs').update({ delivered_quantity: delivered, quality_notes: qualityNotes, status: 'Réceptionné' }).eq('id', commandeId);
      if (error) throw error;
      onSaved?.();
      qc.invalidateQueries({ queryKey: ['commande_fournisseurs'] });
      toast({ title: 'Réception enregistrée', description: 'La réception a été enregistrée et la commande marquée Réceptionné.' });
      setOpen(false);
    } catch (err: any) {
      console.error('Reception save error', err);
    } finally {
      setLoading(false);
    }
  };

  if (!modalOpen) return null;

  return (
    <WhatsAppModal isOpen={modalOpen} onClose={() => setOpen(false)} hideHeader className="max-w-md">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <ModalHeader title="Réception commande" subtitle="Valider la livraison" headerLogo={<AnimatedLogo size={36} />} onClose={() => setOpen(false)} />
        <div className="p-6">
          <Card className="p-4">
            <div className="mb-3">
              <div className="text-sm text-muted-foreground">Commande</div>
              <div className="font-medium">{commande?.supplier_name || '—'}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm">Quantité livrée</label>
                <Input type="number" value={deliveredQty?.toString() ?? ''} onChange={(e) => setDeliveredQty(e.target.value ? Number(e.target.value) : '')} />
              </div>
              <div>
                <label className="block text-sm">Contrôle qualité</label>
                <textarea className="w-full border rounded px-2 py-1" value={qualityNotes} onChange={(e) => setQualityNotes(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
                <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Enregistrement...' : 'Valider réception'}</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </WhatsAppModal>
  );
};

export default ReceptionCommandeModal;
