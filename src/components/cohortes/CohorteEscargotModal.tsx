import React, { useEffect, useState, useRef } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useQuery } from '@tanstack/react-query';

const CohorteEscargotModal = ({ open, onOpenChange, cohort, onSaved }: any) => {
  const [form, setForm] = useState<any>({ nom: '', race: '', nombre: 0, avatar: null as File | null, bassin_id: null, type_escargot: 'Petit-gris', date_introduction: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (cohort) setForm({ ...cohort, avatar: (cohort as any).avatar ?? null, bassin_id: cohort.bassin_id ?? null, type_escargot: cohort.type_escargot ?? 'Petit-gris', date_introduction: cohort.date_introduction ?? '' });
    else setForm({ nom: '', race: '', nombre: 0, avatar: null, bassin_id: null, type_escargot: 'Petit-gris', date_introduction: '' });
  }, [cohort, open]);

  useEffect(() => {
    const f = form.avatar as File | null;
    if (!f) { setImageError(null); return; }
    const maxSize = 5 * 1024 * 1024;
    if (!f.type.startsWith('image/')) { setImageError('Le fichier doit être une image (png/jpg).'); return; }
    if (f.size > maxSize) { setImageError('L\'image dépasse 5MB.'); return; }
    setImageError(null);
  }, [form.avatar]);

  useEffect(() => {
    if (firstInputRef.current) setTimeout(() => firstInputRef.current?.focus(), 50);
  }, []);

  // load available bassins for assignment
  const { data: bassins } = useQuery({
    queryKey: ['bassins_list'],
    queryFn: async () => {
      const { data } = await supabase.from('bassins_piscicoles').select('id,name').order('name');
      return data || [];
    }
  });

  // Hooks used in save must be called at the top level of the component.
  const qc = useQueryClient();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteConfirmed = async () => {
    if (!cohort?.id) return;
    setLoading(true);
    try {
      await (supabase as any).from('cohortes_escargots').delete().eq('id', cohort.id);
      qc.invalidateQueries({ queryKey: ['cohortes_escargots'] });
      toast({ title: 'Cohorte supprimée', description: 'La cohorte a bien été supprimée.' });
      onSaved && onSaved();
      onOpenChange(false);
    } catch (e: any) {
      console.error('Delete cohort escargot error', e);
      setError(e?.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const save = async () => {
    setError(null);
    if (!form.nom || Number(form.nombre) <= 0) {
      setError('Le nom et le nombre (>0) sont requis');
      return;
    }
    setLoading(true);
    try {
      let avatarUrl = cohort?.avatar_url ?? null;
      if (form.avatar) {
        try {
          const ext = (form.avatar as File).name.split('.').pop();
          const fileName = `cohortes/escargot_${Date.now()}.${ext}`;
          const { error: upErr } = await supabase.storage.from('cohortes').upload(fileName, form.avatar as File);
          if (!upErr) {
            const { data } = await supabase.storage.from('cohortes').getPublicUrl(fileName) as any;
            avatarUrl = data.publicUrl ?? data.path ?? null;
          }
        } catch (uploadErr) {
          console.warn('avatar upload error', uploadErr);
          const toBase64 = (f: File) => new Promise<string | null>((res) => {
            const r = new FileReader();
            r.onload = () => res(typeof r.result === 'string' ? r.result : null);
            r.onerror = () => res(null);
            r.readAsDataURL(f);
          });
          avatarUrl = await toBase64(form.avatar as File);
        }
      }

      const payload = { ...form } as any;
      delete payload.avatar;
      if (avatarUrl) payload.avatar_url = avatarUrl;


      if (cohort?.id) await (supabase as any).from('cohortes_escargots').update(payload).eq('id', cohort.id);
      else await (supabase as any).from('cohortes_escargots').insert(payload);

      // invalidate queries and show toast
      qc.invalidateQueries({ queryKey: ['cohortes_escargots'] });
      toast({ title: 'Cohorte enregistrée', description: 'La cohorte a bien été enregistrée.' });

      onSaved && onSaved();
      onOpenChange(false);
    } catch (e: any) {
      console.error('Save cohort escargot error', e);
      setError(e?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  // if not open, don't render the modal at all
  if (!open) return null;

  return (
    <WhatsAppModal isOpen={open} onClose={() => onOpenChange(false)} hideHeader className="max-w-3xl">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <ModalHeader
          title={cohort ? 'Éditer cohorte - Escargot' : 'Créer une cohorte - Escargot'}
          subtitle="Informations de la cohorte"
          headerGradient="from-purple-500 to-purple-600"
          headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-purple-300" />}
          onClose={() => onOpenChange(false)}
        />

        <div className="p-6 bg-white">
          <Card className="p-4 border-0 shadow-lg">
            {error && (
              <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            {imageError && (
              <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                {imageError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <Input
                  ref={firstInputRef}
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Race</label>
                <Input
                  value={form.race}
                  onChange={(e) => setForm({ ...form, race: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <Input
                type="number"
                value={String(form.nombre)}
                onChange={(e) => setForm({ ...form, nombre: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'escargot</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={form.type_escargot}
                  onChange={(e) => setForm({ ...form, type_escargot: e.target.value })}
                >
                  <option value="Petit-gris">Petit-gris</option>
                  <option value="Gros-gris">Gros-gris</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bassin / Parc</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={form.bassin_id ?? ''}
                  onChange={(e) => setForm({ ...form, bassin_id: e.target.value || null })}
                >
                  <option value="">--Choisir--</option>
                  {Array.isArray(bassins) && bassins.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'introduction</label>
                <Input
                  type="date"
                  value={form.date_introduction ?? ''}
                  onChange={(e) => setForm({ ...form, date_introduction: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <AvatarUpload
                value={form.avatar}
                onChange={(file) => setForm({ ...form, avatar: file })}
                label="Photo de la cohorte"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              {cohort?.id && (
                <Button
                  variant="ghost"
                  className="mr-auto text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200"
                  onClick={() => setConfirmOpen(true)}
                  disabled={loading}
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
                disabled={loading || Boolean(imageError)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-200/50"
              >
                {loading ? 'Enregistrement...' : cohort ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </Card>
        </div>

        <ConfirmModal
          open={confirmOpen}
          title={`Supprimer la cohorte de ${cohort?.nom || "cet utilisateur"}`}
          description="Cette action est irréversible. Voulez-vous vraiment supprimer cette cohorte ?"
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          onConfirm={handleDeleteConfirmed}
          onClose={() => setConfirmOpen(false)}
        />
      </div>
    </WhatsAppModal>
  );
};

export default CohorteEscargotModal;

