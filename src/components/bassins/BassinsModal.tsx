import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AppButton from '@/components/ui/AppButton';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash, ImageIcon } from 'lucide-react';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { FormField } from '@/components/workflow/shared/FormField';
import AnimatedLogo from '@/components/AnimatedLogo';
import db from '@/integrations/supabase/db';

interface BassinsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bassin?: any | null;
  onSaved?: () => void;
}

const BassinsModal: React.FC<BassinsModalProps> = ({ open, onOpenChange, bassin = null, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', capacity: '', type: 'poisson', description: '', avatar: null as File | null });

  useEffect(() => {
    if (bassin) {
      setForm({
        name: bassin.name ?? '',
        capacity: bassin.capacity ?? '',
        type: bassin.type ?? 'poisson',
        description: bassin.description ?? '',
        avatar: null
      });
    } else {
      setForm({ name: '', capacity: '', type: 'poisson', description: '', avatar: null });
    }
  }, [bassin, open]);

  const handleDelete = async () => {
    if (!bassin?.id) return;
    const confirmed = window.confirm('Supprimer ce bassin ? Cette action est irréversible.');
    if (!confirmed) return;
    try {
      await db.deleteOne('bassins_piscicoles', bassin.id);
      onSaved && onSaved();
      onOpenChange(false);
    } catch (e) {
      console.error('Delete bassin error', e);
      setError('Impossible de supprimer le bassin');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!form.name || !form.capacity) {
        setError('Le nom et la capacité sont requis');
        setLoading(false);
        return;
      }

      let avatarUrl = bassin?.avatar_url ?? null;
      if (form.avatar) {
        try {
          const ext = form.avatar.name.split('.').pop();
          const fileName = `bassin_${Date.now()}.${ext}`;
          const path = `bassins/${fileName}`;
          const { error: upErr } = await supabase.storage.from('bassins').upload(path, form.avatar);
          if (!upErr) {
            const { data } = await supabase.storage.from('bassins').getPublicUrl(path) as any;
            avatarUrl = data.publicUrl ?? data.path ?? null;
          }
        } catch (uploadErr) {
          console.warn('avatar upload error', uploadErr);
        }
      }

      const payload = {
        name: form.name,
        capacity: Number(form.capacity),
        type: form.type,
        description: form.description,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      } as any;

      if (bassin?.id) {
        await db.updateOne('bassins_piscicoles', bassin.id, payload);
      } else {
        await db.insertOne('bassins_piscicoles', payload);
      }

      onSaved && onSaved();
      onOpenChange(false);
    } catch (err: any) {
      console.error('Erreur sauvegarde bassin:', err);
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };
  // If modal is closed, don't render it at all to avoid invisible overlays
  if (!open) return null;

  return (
    <div data-debug="BassinsModal" className={`fixed inset-0 z-50 flex items-center justify-center ${open ? '' : 'pointer-events-none'}`}>
      <div data-debug="BassinsModal-overlay" className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl z-50 overflow-hidden">
        <ModalHeader
          title={bassin ? 'Éditer un bassin' : 'Créer un bassin'}
          subtitle="Informations du bassin"
          headerLogo={<AnimatedLogo size={48} mainColor="text-white" secondaryColor="text-blue-300" />}
          onClose={() => onOpenChange(false)}
        />

        <div className="p-6 bg-gradient-to-b from-white to-gray-50 rounded-b-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-lg">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField id="name" label="Nom du bassin" value={form.name} onChange={(name) => setForm({ ...form, name })} required />
              <FormField id="capacity" label="Capacité (L)" value={String(form.capacity)} onChange={(capacity) => setForm({ ...form, capacity })} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 block">Type</label>
                <select className="w-full border rounded px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="poisson">Poisson</option>
                  <option value="escargot">Escargot</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 block">Référence</label>
                <Input value={bassin?.ref ?? ''} disabled placeholder="Référence interne" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 block">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded px-3 py-2 min-h-[100px]" />
            </div>

            <AvatarUpload value={form.avatar} onChange={(file) => setForm({ ...form, avatar: file })} label="Photo du bassin" />

            <div className="flex items-center gap-3 justify-end">
              {bassin?.id && (
                <AppButton variant="ghost" onClick={handleDelete} className="mr-auto flex items-center gap-2 text-red-600 hover:bg-red-50">
                  <Trash className="w-4 h-4" /> Supprimer
                </AppButton>
              )}
              <AppButton variant="ghost" onClick={() => onOpenChange(false)}>Annuler</AppButton>
              <AppButton type="submit" disabled={loading}>{loading ? 'Enregistrement...' : bassin ? 'Enregistrer' : 'Créer le bassin'}</AppButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BassinsModal;
