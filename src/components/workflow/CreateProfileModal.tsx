import React, { useState, useEffect } from 'react';
import { ModalHeader } from './shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { EmailInput } from '@/components/ui/email-input';
import { PhoneInput } from '@/components/ui/phone-input';
import Input from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  role?: 'client' | 'supplier' | string;
  initialName?: string;
  tenantId?: string | null;
  existing?: any;
  onCreated?: (profile: { id: string; full_name: string; email?: string }) => void;
}
const CreateProfileModal = ({ isOpen, onClose, role = 'client', initialName = '', tenantId = null, existing, onCreated }: Props) => {
  const modalOpen = !!isOpen;
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => { if (!modalOpen) { setName(initialName); setEmail(''); setPhone(''); setAvatar(null); } }, [modalOpen, initialName]);

  // When editing an existing profile, populate fields
  useEffect(() => {
    if (modalOpen && existing) {
      setName(existing.full_name ?? '');
      setEmail(existing.email ?? '');
      setPhone(existing.phone ?? '');
      // we don't set avatar File from existing.avatar_url; keep avatar null until user uploads
      setAvatar(null);
    }
  }, [modalOpen, existing]);

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name) return;
    setLoading(true);
    try {
      if (email && !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email)) {
        throw new Error('Email invalide');
      }

      // Upload avatar if present
      let avatarUrl: string | null = null;
      if (avatar) {
        try {
          const fileExt = avatar.name.split('.').pop();
          const fileName = `profiles/${role}-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('public').upload(fileName, avatar as File, { upsert: true } as any);
          if (!uploadError) {
            const { data: publicData } = await supabase.storage.from('public').getPublicUrl(fileName) as any;
            avatarUrl = publicData?.publicUrl ?? null;
          }
        } catch (uploadErr) {
          console.warn('Avatar upload error', uploadErr);
        }
      }

      const payload: any = { full_name: name, email: email || null, phone: phone || null, role: role, tenant_id: tenantId ?? null, avatar_url: avatarUrl };
      // Support edit if existing provided
            if (existing?.id) {
              const id = existing.id;
              const { data, error } = await (supabase as any).from('profiles').update(payload).eq('id', id).select().single();
              if (error) throw error;
              toast({ title: 'Contact mis à jour', description: `${name} a été mis à jour.` });
              qc.invalidateQueries({ queryKey: ['profiles'] });
              onCreated?.(data);
              onClose?.();
            } else {
              const { data, error } = await (supabase as any).from('profiles').insert(payload).select().single();
              if (error) throw error;
              toast({ title: 'Contact créé', description: `${name} a été créé.` });
              qc.invalidateQueries({ queryKey: ['profiles'] });
              onCreated?.(data);
              onClose?.();
            }
    } catch (err) {
      console.error('CreateProfileModal error', err);
      toast({ title: 'Erreur', description: 'Impossible de créer le contact' });
    } finally {
      setLoading(false);
    }
  };

  if (!modalOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${modalOpen ? '' : 'pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose?.()} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md z-50 overflow-hidden">
        <ModalHeader title={`Créer ${role === 'supplier' ? 'Fournisseur' : 'Client'}`} subtitle="Créer rapidement un contact" headerLogo={<AnimatedLogo size={36} />} onClose={() => onClose?.()} />
        <div className="p-6">
          <Card className="p-4">
            <form onSubmit={handleCreate}>
              <div>
                <label className="block text-sm">Nom complet</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm">Email</label>
                <EmailInput value={email} onChange={(value: string) => setEmail(value)} />
              </div>
              <div>
                <label className="block text-sm">Téléphone</label>
                <PhoneInput value={phone} onChange={(value: string) => setPhone(value)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => onClose?.()}>Annuler</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Création...' : 'Créer'}</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileModal;
