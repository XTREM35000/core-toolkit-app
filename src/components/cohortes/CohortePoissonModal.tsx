import React, { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import { AvatarUpload } from '@/components/ui/avatar-upload';

const CohortePoissonModal = ({ open, onOpenChange, cohort, onSaved }: any) => {
  const [form, setForm] = useState<any>({ espece: '', nombre_initial: 0, poids_initial_kg: 0, statut: 'en_elevage', avatar: null as File | null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (cohort) {
      setForm({ ...cohort, avatar: (cohort as any).avatar ?? null });
    } else {
      setForm({ espece: '', nombre_initial: 0, poids_initial_kg: 0, statut: 'en_elevage', avatar: null });
    }
  }, [cohort, open]);

  useEffect(() => {
    const f = form.avatar as File | null;
    if (!f) {
      setImageError(null);
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!f.type.startsWith('image/')) {
      setImageError('Le fichier doit être une image (png/jpg).');
      return;
    }
    if (f.size > maxSize) {
      setImageError('L\'image dépasse 5MB.');
      return;
    }
    setImageError(null);
  }, [form.avatar]);

  useEffect(() => {
    if (firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, []);

  const save = async () => {
    setError(null);
    if (!form.espece || Number(form.nombre_initial) <= 0) {
      setError('L\'espèce et le nombre initial sont requis et le nombre doit être supérieur à 0');
      return;
    }

    setLoading(true);
    try {
      let avatarUrl = cohort?.avatar_url ?? null;
      if (form.avatar) {
        try {
          const ext = (form.avatar as File).name.split('.').pop();
          const fileName = `cohortes/poisson_${Date.now()}.${ext}`;
          const { error: upErr } = await supabase.storage.from('cohortes').upload(fileName, form.avatar as File);
          if (!upErr) {
            const { data } = await supabase.storage.from('cohortes').getPublicUrl(fileName) as any;
            avatarUrl = data.publicUrl ?? data.path ?? null;
          }
        } catch (uploadErr) {
          console.warn('avatar upload error', uploadErr);
          // fallback to base64
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

      if (cohort?.id) await (supabase as any).from('cohortes_poissons').update(payload).eq('id', cohort.id);
      else await (supabase as any).from('cohortes_poissons').insert(payload);

      onSaved && onSaved();
      onOpenChange(false);
    } catch (e: any) {
      console.error('Save cohort poisson error', e);
      setError(e?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  // if not open, don't render the modal at all (avoids invisible overlay blocking the page)
  if (!open) return null;

  return (
    <div data-debug="CohortePoissonModal" className={`fixed inset-0 z-50 flex items-center justify-center ${open ? '' : 'pointer-events-none'}`}>
      <div data-debug="CohortePoissonModal-overlay" className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl z-50 overflow-hidden">
        <ModalHeader
          title={cohort ? 'Éditer cohorte - Poisson' : 'Créer une cohorte - Poisson'}
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
                <label className="block text-sm text-gray-600">Espèce</label>
                <Input ref={firstInputRef} value={form.espece} onChange={(e) => setForm({ ...form, espece: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Nombre initial</label>
                <Input type="number" value={String(form.nombre_initial)} onChange={(e) => setForm({ ...form, nombre_initial: Number(e.target.value) })} />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600">Poids initial (kg)</label>
              <Input type="number" value={String(form.poids_initial_kg)} onChange={(e) => setForm({ ...form, poids_initial_kg: Number(e.target.value) })} />
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

export default CohortePoissonModal;

