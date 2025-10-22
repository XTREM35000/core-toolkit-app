import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/workflow/AdminCreationModal';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { EmailInput } from '@/components/ui/email-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  existing?: any | null;
}

const ClientModal = ({ isOpen, onClose, onSaved, existing }: Props) => {
  const { profile: me } = useAuth();
  const [name, setName] = useState(existing?.full_name ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [address, setAddress] = useState(existing?.address ?? '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (!isOpen) {
      setName(existing?.full_name ?? ''); setEmail(existing?.email ?? ''); setPhone(existing?.phone ?? ''); setAddress(existing?.address ?? ''); setAvatar(null);
    } else {
      // when opening for edit, populate avatar state if existing avatar_url is present
      setAvatar(null);
    }
  }, [isOpen, existing]);

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      if (email && !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email)) throw new Error('Email invalide');

      // upload avatar if present
      let avatarUrl: string | null = null;
      if (avatar) {
        try {
          const fileExt = avatar.name.split('.').pop();
          const fileName = `profiles/client-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('public').upload(fileName, avatar as File, { upsert: true } as any);
          if (!uploadError) {
            const { data: publicData } = await supabase.storage.from('public').getPublicUrl(fileName) as any;
            avatarUrl = publicData?.publicUrl ?? null;
          }
        } catch (uploadErr) {
          console.warn('Avatar upload error', uploadErr);
        }
      }

      // simple phone normalization: digits only
      const phoneNormalized = phone ? phone.replace(/\D/g, '') : null;

      const payload: any = { full_name: name, email: email || null, phone: phone || null, phone_normalized: phoneNormalized, address: address || null, role: 'client', tenant_id: me?.tenant_id ?? null, avatar_url: avatarUrl };

      if (existing?.id) {
        await (supabase as any).from('profiles').update(payload).eq('id', existing.id);
      } else {
        await (supabase as any).from('profiles').insert(payload);
      }

      qc.invalidateQueries({ queryKey: ['profiles','clients'] });
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error('Client save error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existing?.id) return;
    if (!confirm('Supprimer ce client ? Cette action est irréversible.')) return;
    setLoading(true);
    try {
      await (supabase as any).from('profiles').delete().eq('id', existing.id);
      qc.invalidateQueries({ queryKey: ['profiles','clients'] });
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error('Delete client error', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose?.()} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-50 overflow-hidden">
        <ModalHeader title={existing ? 'Modifier Client' : 'Nouveau Client'} subtitle="Détails du client" headerLogo={null} onClose={() => onClose?.()} />
        <div className="p-6">
          <Card className="p-4">
            <form onSubmit={handleSave} className="space-y-3">
              <AvatarUpload value={avatar} onChange={(f) => setAvatar(f)} label="Photo du client" />

              <div>
                <label className="block text-sm">Nom</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input w-full" />
              </div>

              <EmailInput value={email} onChange={(v) => setEmail(v)} />
              <PhoneInput value={phone} onChange={(v) => setPhone(v)} />

              <div>
                <label className="block text-sm">Adresse</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="input w-full" />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="destructive" onClick={handleDelete} disabled={loading}>Supprimer</Button>
                <Button variant="ghost" onClick={() => onClose?.()}>Annuler</Button>
                <Button onClick={handleSave} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;
