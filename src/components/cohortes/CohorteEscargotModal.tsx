import React, { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import { AvatarUpload } from '@/components/ui/avatar-upload';

const CohorteEscargotModal = ({ open, onOpenChange, cohort, onSaved }: any) => {
  const [form, setForm] = useState<any>({ nom: '', race: '', nombre: 0, avatar: null as File | null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (cohort) setForm({ ...cohort, avatar: (cohort as any).avatar ?? null });
    else setForm({ nom: '', race: '', nombre: 0, avatar: null });
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
    <div data-debug="CohorteEscargotModal" className={`fixed inset-0 z-50 flex items-center justify-center ${open ? '' : 'pointer-events-none'}`}>
      <div data-debug="CohorteEscargotModal-overlay" className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl z-50 overflow-hidden">
        <ModalHeader
          title={cohort ? 'Éditer cohorte - Escargot' : 'Créer une cohorte - Escargot'}
          subtitle="Informations de la cohorte"
          headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-blue-300" />}
          onClose={() => onOpenChange(false)}
        />

        <div className="p-6 bg-white">
          <Card className="p-4">
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            {imageError && <div className="text-sm text-red-600 mb-2">{imageError}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600">Nom</label>
                <Input ref={firstInputRef} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Race</label>
                <Input value={form.race} onChange={(e) => setForm({ ...form, race: e.target.value })} />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600">Nombre</label>
              <Input type="number" value={String(form.nombre)} onChange={(e) => setForm({ ...form, nombre: Number(e.target.value) })} />
            </div>

            <div className="mt-4">
              <AvatarUpload value={form.avatar} onChange={(file) => setForm({ ...form, avatar: file })} label="Photo de la cohorte" />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={save} disabled={loading || Boolean(imageError)}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CohorteEscargotModal;

