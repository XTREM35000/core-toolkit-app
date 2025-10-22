import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import { AvatarUpload } from '@/components/ui/avatar-upload';

const ProfilePage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState((profile as any)?.phone ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setPhone((profile as any)?.phone ?? '');
    setAvatarFile(null);
  }, [profile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      let avatar_url = (profile as any)?.avatar_url ?? null;
      if (avatarFile) {
        // try upload to supabase storage if configured, otherwise fallback to base64
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `profiles/profile-${profile?.id || 'anon'}_${Date.now()}.${fileExt}`;
          const { data, error } = await supabase.storage.from('public').upload(fileName, avatarFile, { upsert: true } as any);
          if (!error && data) {
            // build public url similar to other places in repo
            avatar_url = `${(supabase as any).storageUrl ?? ''}/object/public/${data.path}`;
          }
        } catch (e) {
          // fallback to base64
          const toBase64 = (f: File) => new Promise<string | null>((res) => {
            const r = new FileReader();
            r.onload = () => res(typeof r.result === 'string' ? r.result : null);
            r.onerror = () => res(null);
            r.readAsDataURL(f);
          });
          avatar_url = await toBase64(avatarFile as File);
        }
      }

      // Update profile via supabase
      const { data, error } = await (await import('@/integrations/supabase/client')).supabase
        .from('profiles')
        .update({ full_name: fullName, phone, avatar_url })
        .eq('id', profile?.id);

      if (error) throw error;

      toast({ title: 'Profil mis à jour', description: 'Vos informations ont été enregistrées.' });
      await refreshProfile();
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message || 'Impossible de mettre à jour le profil', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-sm">
          <ModalHeader
            title="Mon profil"
            subtitle="Gérer vos informations personnelles"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-blue-300" />}
            onClose={() => { /* noop in page */ }}
          />

          <div className="p-4 bg-white">
            <Card className="p-3">
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="flex gap-4 items-start">
                <div className="w-28 flex-shrink-0">
                  <AvatarUpload value={avatarFile} onChange={(f) => setAvatarFile(f)} label="Avatar" />
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600">Nom</label>
                      <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Email</label>
                      <Input value={profile?.email ?? ''} disabled />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div>
                      <label className="block text-sm text-gray-600">Téléphone</label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Rôle</label>
                      <Input value={(profile?.roles || []).join(', ') || 'Utilisateur'} disabled className="bg-gray-50 text-gray-600" />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button type="submit" disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
