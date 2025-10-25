import React, { useEffect, useState } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { useAuth } from '@/components/workflow/AdminCreationModal';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { EmailInput } from '@/components/ui/email-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  existing?: any | null;
}

const FournisseurModal = ({ isOpen, onClose, onSaved, existing }: Props) => {
  const { profile: me } = useAuth();
  const [name, setName] = useState(existing?.full_name ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [address, setAddress] = useState(existing?.address ?? '');
  const [type, setType] = useState(existing?.type ?? '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (!isOpen) {
      setName(existing?.full_name ?? ''); setEmail(existing?.email ?? ''); setPhone(existing?.phone ?? ''); setAddress(existing?.address ?? ''); setType(existing?.type ?? ''); setAvatar(null);
    } else {
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
          const fileName = `profiles/supplier-${Date.now()}.${fileExt}`;
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

      const payload: any = { full_name: name, email: email || null, phone: phone || null, phone_normalized: phoneNormalized, address: address || null, type: type || null, role: 'supplier', tenant_id: me?.tenant_id ?? null, avatar_url: avatarUrl };

      if (existing?.id) {
        await (supabase as any).from('profiles').update(payload).eq('id', existing.id);
      } else {
        await (supabase as any).from('profiles').insert(payload);
      }

      qc.invalidateQueries({ queryKey: ['profiles', 'suppliers'] });
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error('Fournisseur save error', err);
    } finally {
      setLoading(false);
    }
  };

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    if (!existing?.id) return;
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!existing?.id) return;
    setLoading(true);
    try {
      await (supabase as any).from('profiles').delete().eq('id', existing.id);
      qc.invalidateQueries({ queryKey: ['profiles', 'suppliers'] });
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error('Delete fournisseur error', err);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <WhatsAppModal isOpen={isOpen} onClose={() => onClose?.()} hideHeader className="max-w-2xl">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
        <ModalHeader title={existing ? 'Modifier Fournisseur' : 'Nouveau Fournisseur'} subtitle="Détails du fournisseur" headerLogo={null} onClose={() => onClose?.()} />
        <div className="p-6">
          <Card className="p-4">
            <form onSubmit={handleSave} className="space-y-3">
              <AvatarUpload value={avatar} onChange={(f) => setAvatar(f)} label="Photo du fournisseur" />

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
              <div>
                <label className="block text-sm">Type</label>
                <input value={type} onChange={(e) => setType(e.target.value)} className="input w-full" />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={handleDelete} disabled={loading}>Supprimer</Button>
                <Button variant="ghost" onClick={() => onClose?.()}>Annuler</Button>
                <Button onClick={handleSave} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
              </div>
            </form>
          </Card>
        </div>
        <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} title={`Supprimer le fournisseur ${existing?.full_name ?? ''}`} description="Cette action est irréversible. Voulez-vous continuer ?" onConfirm={confirmDelete} />
      </div>
    </WhatsAppModal>
  );
};

export default FournisseurModal;
