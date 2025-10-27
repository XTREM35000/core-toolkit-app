import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmModal from '@/components/ui/ConfirmModal';

const ParcHelicicoleModal = ({ open, onOpenChange, parc, onSaved }: any) => {
  const [form, setForm] = useState<any>({ nom: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { if (parc) setForm(parc); else setForm({ nom: '', location: '' }); }, [parc, open]);
  useEffect(() => { if (firstRef.current) setTimeout(() => firstRef.current?.focus(), 50); }, []);

  const handleSave = async () => {
    setError(null);
    if (!form.nom) { setError('Le nom est requis'); return; }
    setLoading(true);
    try {
      if (parc?.id) await (supabase as any).from('parcs_helicicoles').update(form).eq('id', parc.id);
      else await (supabase as any).from('parcs_helicicoles').insert(form);
      onSaved && onSaved();
      onOpenChange(false);
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la sauvegarde');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!parc?.id) return;
    try {
      await (supabase as any).from('parcs_helicicoles').delete().eq('id', parc.id);
      onSaved && onSaved();
      onOpenChange(false);
    } catch (e) {
      console.error('Delete parc error', e);
    }
  };

  return (
    <WhatsAppModal isOpen={open} onClose={() => onOpenChange(false)} hideHeader className="max-w-xl">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <ModalHeader
          title={parc ? 'Éditer Parc' : 'Nouveau Parc'}
          subtitle={parc ? 'Modifier les informations du parc' : 'Créer un nouveau parc hélicicole'}
          onClose={() => onOpenChange(false)}
        />
        <div className="p-6">
          <Card className="p-4">
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Nom</label>
                <Input ref={firstRef} value={form.nom} onChange={(e: any) => setForm({ ...form, nom: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm">Localisation</label>
                <Input value={form.location} onChange={(e: any) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              {parc?.id && <Button variant="ghost" className="mr-auto text-red-600 hover:bg-red-50" onClick={() => setConfirmOpen(true)}>Supprimer</Button>}
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={handleSave} disabled={loading}>{loading ? 'Enregistrement...' : parc ? 'Enregistrer' : 'Créer'}</Button>
            </div>
          </Card>

          <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Supprimer le parc" description="Voulez-vous vraiment supprimer ce parc ? Cette action est irréversible." onConfirm={handleDelete} />
        </div>
      </div>
    </WhatsAppModal>
  );
};

export default ParcHelicicoleModal;

