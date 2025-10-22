import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

const roleOptions = ['admin', 'user'] as const; // deliberately exclude super_admin

const CollaboratorsAdd: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<typeof roleOptions[number]>('user');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isAdmin && !isSuperAdmin) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-white rounded shadow max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold">Accès refusé</h2>
          <p className="mt-2">Cette page est réservée aux administrateurs.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleCreate = async () => {
    setSaving(true);
    try {
      let avatar_url: string | null = null;
      if (avatarFile) {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const fileName = `avatars/temp_${Date.now()}`;
          const { data, error } = await supabase.storage.from('public').upload(fileName, avatarFile, { upsert: true } as any);
          if (!error && data) {
            avatar_url = `${(supabase as any).storageUrl ?? ''}/object/public/${data.path}`;
          }
        } catch (e) {
          // fallback base64
          const toBase64 = (f: File) => new Promise<string | null>((res) => {
            const r = new FileReader();
            r.onload = () => res(typeof r.result === 'string' ? r.result : null);
            r.onerror = () => res(null);
            r.readAsDataURL(f);
          });
          avatar_url = await toBase64(avatarFile as File);
        }
      }

      // Create user via supabase invite flow
      const { data, error } = await (await import('@/integrations/supabase/client')).supabase.auth.admin.createUser({
        email,
        password: Math.random().toString(36).slice(2, 10),
        userMetadata: { full_name: `${firstName} ${lastName}` }
      } as any as object);

      if ((error as any) || !data) {
        throw error || new Error('Erreur création utilisateur');
      }

      const userId = data.user?.id;
      if (!userId) {
        throw new Error('Utilisateur créé sans identifiant');
      }

      // assign role in user_roles table if available
      try {
        await (await import('@/integrations/supabase/client'))
          .supabase
          .from('user_roles')
          .insert([{ user_id: userId, role: role as 'admin' | 'user' | 'super_admin' } as any]);
        if (avatar_url) {
          await (await import('@/integrations/supabase/client'))
            .supabase
            .from('profiles')
            .update({ avatar_url })
            .eq('id', userId);
        }
      } catch (e) {
        // ignore role assignment failure for now
      }

      toast({ title: 'Collaborateur ajouté', description: `${email} a été invité.` });
      navigate('/collaborators');
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message || 'Impossible de créer le collaborateur', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg">
          <ModalHeader
            title="Ajouter un collaborateur"
            subtitle="Inviter un nouveau membre à l'équipe"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-blue-300" />}
            onClose={() => { /* noop on page */ }}
          />

          <div className="p-6 bg-white">
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Prénom</label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Nom</label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Email</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Rôle</label>
                  <select value={role} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as typeof roleOptions[number])} className="w-full border rounded px-3 py-2">
                    {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Photo (optionnelle)</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {avatarPreview ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Aucune</span>}
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setAvatarFile(f);
                      setAvatarPreview(f ? URL.createObjectURL(f) : null);
                    }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={() => navigate('/collaborators')} variant="ghost">Annuler</Button>
                <Button onClick={handleCreate} className="ml-2" disabled={saving}>{saving ? 'Création...' : 'Créer'}</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CollaboratorsAdd;
