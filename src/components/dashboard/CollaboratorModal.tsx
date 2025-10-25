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

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  existing?: Profile | Partial<Profile> | null;
}

const CollaboratorModal = ({ isOpen, onClose, onSaved, existing }: Props) => {
  const qc = useQueryClient();
  const [name, setName] = useState(existing?.full_name ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [phone, setPhone] = useState((existing as any)?.phone ?? '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName(existing?.full_name ?? ''); setEmail(existing?.email ?? ''); setPhone((existing as any)?.phone ?? ''); setAvatar(null);
    } else {
      setAvatar(null);
    }
  }, [isOpen, existing]);

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      if (email && !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email)) throw new Error('Email invalide');

      let avatarUrl: string | null = null;
      if (avatar) {
        try {
          const fileExt = avatar.name.split('.').pop();
          const fileName = `profiles/collab-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('public').upload(fileName, avatar as File, { upsert: true } as any);
          if (!uploadError) {
            const { data: publicData } = await supabase.storage.from('public').getPublicUrl(fileName) as any;
            avatarUrl = publicData?.publicUrl ?? null;
          }
        } catch (uploadErr) {
          console.warn('Avatar upload error', uploadErr);
        }
      }

      const phoneNormalized = phone ? phone.replace(/\D/g, '') : null;

      const payload: any = { full_name: name, email: email || null, phone: phone || null, phone_normalized: phoneNormalized, role: 'collaborator', avatar_url: avatarUrl };

      if (existing?.id) {
        await (supabase as any).from('profiles').update(payload).eq('id', existing.id);
      } else {
        await (supabase as any).from('profiles').insert(payload);
      }

      qc.invalidateQueries({ queryKey: ['collabs'] });
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error('Collaborator save error', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <WhatsAppModal isOpen={isOpen} onClose={() => onClose?.()} hideHeader className="max-w-xl">
      <div className="bg-white rounded-t-3xl shadow-md w-full mx-auto overflow-visible">
        <ModalHeader title={existing ? 'Modifier collaborateur' : 'Nouveau collaborateur'} subtitle="Détails du collaborateur" headerLogo={<AnimatedLogo size={36} mainColor="text-white" secondaryColor="text-blue-300" />} onClose={() => onClose?.()} />
        <div className="p-4">
          <Card className="p-3">
            <form onSubmit={handleSave} className="flex gap-4 items-start">
              <div className="w-24 flex-shrink-0">
                <AvatarUpload value={avatar} onChange={(f) => setAvatar(f)} label="Photo" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm">Nom</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="input w-full" />
                  </div>
                  <div>
                    <EmailInput value={email} onChange={(v) => setEmail(v)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <PhoneInput value={phone} onChange={(v) => setPhone(v)} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Rôle</label>
                    <input value={(existing as any)?.role ?? 'Collaborateur'} disabled className="input w-full bg-gray-50 text-gray-600" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {existing?.id && <Button variant="destructive" onClick={() => setConfirmOpen(true)} disabled={loading}>Supprimer</Button>}
                  <Button variant="ghost" onClick={() => onClose?.()}>Annuler</Button>
                  <Button onClick={handleSave} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
        <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} title={`Supprimer ce collaborateur ${existing?.full_name ?? ''}`} description="Cette action est irréversible. Voulez-vous continuer ?" onConfirm={async () => {
          if (!existing?.id) return;
          setLoading(true);
          try {
            await (supabase as any).from('profiles').delete().eq('id', existing.id);
            qc.invalidateQueries({ queryKey: ['collabs'] });
            onSaved?.();
            onClose?.();
          } catch (e) { console.error(e); } finally { setLoading(false); setConfirmOpen(false); }
        }} />
      </div>
    </WhatsAppModal>
  );
};

export default CollaboratorModal;
