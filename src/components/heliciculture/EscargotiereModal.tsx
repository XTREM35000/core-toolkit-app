import React, { useEffect, useRef, useState } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogoPoisson from '@/components/AnimatedLogoPoisson';
import { getTenantId } from '@/services/tenantService';
import { Card } from '@/components/ui/card';
import ConfirmModal from '@/components/ui/ConfirmModal';

const EscargotiereModal = ({ open, onOpenChange, parc, onSaved }: any) => {
  const [form, setForm] = useState<any>({ nom: '', type: 'Reproduction', dimensions: 0, substrat: '', date_installation: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (parc) setForm({ nom: parc.nom ?? '', type: parc.type ?? 'Reproduction', dimensions: parc.dimensions ?? '', substrat: parc.substrat ?? '', date_installation: parc.date_installation ?? '' });
    else setForm({ nom: '', type: 'Reproduction', dimensions: '', substrat: '', date_installation: '' });
  }, [parc, open]);

  useEffect(() => { if (firstRef.current) setTimeout(() => firstRef.current?.focus(), 50); }, []);

  const save = async () => {
    if (!form.nom) { setError('Le nom est requis'); return; }
    setLoading(true);
    try {
      const tenantId = await getTenantId();
      const payload: any = { ...form, dimensions: Number(form.dimensions) || 0, updated_at: new Date().toISOString() };
      if (tenantId) payload.tenant_id = tenantId;
      if (parc?.id) {
        await (supabase as any).from('escargoteres').update(payload).eq('id', parc.id);
      } else {
        if (!payload.created_at) payload.created_at = new Date().toISOString();
        await (supabase as any).from('escargoteres').insert(payload);
      }
      onSaved && onSaved();
      onOpenChange(false);
    } catch (e: any) {
      console.error('Save escargotiere', e);
      setError(e?.message || 'Erreur');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!parc?.id) return;
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!parc?.id) return;
    try { await (supabase as any).from('escargoteres').delete().eq('id', parc.id); onSaved && onSaved(); onOpenChange(false); } catch (e) { console.error(e); }
  };

  if (!open) return null;

  return (
    <WhatsAppModal isOpen={open} onClose={() => onOpenChange(false)} hideHeader className="max-w-2xl">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <ModalHeader
          title={parc ? 'Éditer Escargotière' : 'Nouvelle Escargotière'}
          subtitle="Détails de l'escargotière"
          headerGradient="from-purple-500 to-purple-600"
          headerLogo={<AnimatedLogoPoisson size={36} />}
          onClose={() => onOpenChange(false)}
        />

        <div className="p-6 bg-white">
          <Card className="p-4 border-0 shadow-lg">
            {error && (
              <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <Input
                  ref={firstRef}
                  value={form.nom}
                  onChange={(e: any) => setForm({ ...form, nom: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="Reproduction">Reproduction</option>
                  <option value="Elevage">Élevage</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
              <Input
                value={form.dimensions}
                onChange={(e: any) => setForm({ ...form, dimensions: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Substrat</label>
              <Input
                value={form.substrat}
                onChange={(e: any) => setForm({ ...form, substrat: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date d'installation</label>
              <Input
                type="date"
                value={form.date_installation}
                onChange={(e: any) => setForm({ ...form, date_installation: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              {parc?.id && (
                <Button
                  variant="ghost"
                  className="mr-auto text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200"
                  onClick={() => setConfirmOpen(true)}
                >
                  Supprimer
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="border border-gray-300 hover:bg-gray-50"
              >
                Annuler
              </Button>
              <Button
                onClick={save}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-200/50"
              >
                {loading ? 'Enregistrement...' : parc ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={`Supprimer l'escargotière de ${parc?.nom || "cet utilisateur"}`}
        description="Voulez-vous vraiment supprimer cette escargotière ? Cette action est irréversible."
        onConfirm={confirmDelete}
      />
    </WhatsAppModal>
  );
};

export default EscargotiereModal;
