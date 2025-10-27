import React, { useEffect, useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { Profile } from '@/types';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { EmailInput } from '@/components/ui/email-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { supabase } from '@/integrations/supabase/client';
import AnimatedLogo from '@/components/AnimatedLogo';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  existing?: Profile | Partial<Profile> | null;
}

const CollaboratorModal = ({ isOpen, onClose, onSaved, existing }: Props) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [name, setName] = useState(existing?.full_name ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName(existing?.full_name ?? '');
      setEmail(existing?.email ?? '');
      setPhone(existing?.phone ?? '');
      setAvatar(null);
    } else {
      setAvatar(null);
    }
  }, [isOpen, existing]);

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    try {
      if (email && !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email)) throw new Error('Email invalide');

      let avatarUrl: string | null = null;
      if (avatar) {
        try {
          const fileExt = avatar.name.split('.').pop();
          const fileName = `profiles/collab-${Date.now()}.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage.from('public').upload(fileName, avatar, { upsert: true });
          if (uploadError) throw uploadError;
          // Prefer getPublicUrl for the uploaded file
          try {
            const { data: publicData } = await supabase.storage.from('public').getPublicUrl(fileName);
            avatarUrl = publicData?.publicUrl ?? null;
          } catch {
            // fallback to base64
            const toBase64 = (f: File) => new Promise<string | null>((res) => {
              const reader = new FileReader();
              reader.onload = () => res(typeof reader.result === 'string' ? reader.result : null);
              reader.onerror = () => res(null);
              reader.readAsDataURL(f);
            });
            avatarUrl = await toBase64(avatar as File);
          }
        } catch (uploadErr) {
          console.warn('Avatar upload error', uploadErr);
          const toBase64 = (f: File) => new Promise<string | null>((res) => {
            const reader = new FileReader();
            reader.onload = () => res(typeof reader.result === 'string' ? reader.result : null);
            reader.onerror = () => res(null);
            reader.readAsDataURL(f);
          });
          avatarUrl = await toBase64(avatar as File);
        }
      }

      const phoneNormalized = phone ? phone.replace(/\D/g, '') : null;

      const payload: Database['public']['Tables']['profiles']['Insert'] = {
        full_name: name,
        email: email || null,
        phone: phone || null,
        role: 'user' as Database['public']['Enums']['app_role'] | null,
        avatar_url: avatarUrl,
        id: undefined as unknown as string, // allow DB to generate / or caller to provide; we'll use update when existing.id present
      } as any;

      if (existing?.id) {
        const updates: Database['public']['Tables']['profiles']['Update'] = {
          full_name: name,
          email: email || null,
          phone: phone || null,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').update(updates).eq('id', existing.id);
        if (error) throw error;
      } else {
        // Insert a new profile row
        const insertPayload: Database['public']['Tables']['profiles']['Insert'] = {
          full_name: name,
          email: email || '',
          phone: phone || null,
          avatar_url: avatarUrl,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: insertError } = await supabase.from('profiles').insert(insertPayload).select().single();
        if (insertError) throw insertError;
      }

      qc.invalidateQueries({ queryKey: ['collabs'] });
      toast({ title: 'Collaborateur enregistré', description: existing?.id ? 'Modifications enregistrées.' : 'Collaborateur créé avec succès.' });
      onSaved?.();
      onClose?.();
    } catch (err: any) {
      console.error('Collaborator save error', err);
      toast({ title: 'Erreur', description: err?.message || 'Impossible d\'enregistrer le collaborateur', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <WhatsAppModal isOpen={isOpen} onClose={() => onClose?.()} hideHeader className="max-w-3xl">
      <motion.div
        className="bg-white rounded-3xl shadow-xl overflow-visible"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <ModalHeader
          title={existing ? 'Modifier collaborateur' : 'Nouveau collaborateur'}
          subtitle="Détails du collaborateur"
          headerLogo={<AnimatedLogo size={36} mainColor="text-white" secondaryColor="text-blue-300" />}
          onClose={() => onClose?.()}
        />

        <div className="p-6">
          <Card className="p-6 space-y-4 shadow-inner rounded-2xl">
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="flex flex-col items-center md:items-start">
                <AvatarUpload
                  value={avatar}
                  onChange={(f) => setAvatar(f)}
                  label="Photo"
                  className="rounded-full shadow-md w-28 h-28"
                />
                <p className="mt-2 text-sm text-gray-500 text-center md:text-left">Photo du collaborateur</p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Nom</label>
                    <Input value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} placeholder="Nom complet" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <EmailInput value={email} onChange={(v) => setEmail(v)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Téléphone</label>
                    <PhoneInput value={phone} onChange={(v) => setPhone(v)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Rôle</label>
                    <Input value={(existing as any)?.role ?? 'Collaborateur'} disabled className="bg-gray-50 text-gray-600" />
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  {existing?.id && (
                    <Button
                      variant="destructive"
                      onClick={() => setConfirmOpen(true)}
                      disabled={saving}
                    >
                      Supprimer
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => onClose?.()} disabled={saving}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>

        <ConfirmModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title={`Supprimer ce collaborateur ${existing?.full_name ?? ''}`}
          description="Cette action est irréversible. Voulez-vous continuer ?"
          onConfirm={async () => {
            if (!existing?.id) return;
            setSaving(true);
            try {
              const { error } = await supabase.from('profiles').delete().eq('id', existing.id);
              if (error) throw error;
              qc.invalidateQueries({ queryKey: ['collabs'] });
              toast({ title: 'Collaborateur supprimé', description: 'La suppression a réussi.' });
              onSaved?.();
              onClose?.();
            } catch (e: any) {
              console.error(e);
              toast({ title: 'Erreur', description: e?.message || 'Impossible de supprimer le collaborateur', variant: 'destructive' });
            } finally {
              setSaving(false);
              setConfirmOpen(false);
            }
          }}
        />
      </motion.div>
    </WhatsAppModal>
  );
};

export default CollaboratorModal;
