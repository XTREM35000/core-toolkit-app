import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AnimatedLogo from '@/components/AnimatedLogo';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { Card } from '@/components/ui/card';

const ProfilePage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState((profile as any)?.phone ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>((profile as any)?.avatar_url ?? null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setPhone((profile as any)?.phone ?? '');
    setAvatarPreview((profile as any)?.avatar_url ?? null);
  }, [profile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      let avatar_url = (profile as any)?.avatar_url ?? null;
      if (avatarFile) {
        // try upload to supabase storage if configured, otherwise fallback to base64
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const fileName = `avatars/${profile?.id || 'anon'}_${Date.now()}`;
          const { data, error } = await supabase.storage.from('public').upload(fileName, avatarFile, { upsert: true } as any);
          if (!error && data) {
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg">
          <ModalHeader
            title="Mon profil"
            subtitle="Gérer vos informations personnelles"
            headerLogo={<AnimatedLogo size={48} mainColor="text-white" secondaryColor="text-blue-300" />}
            onClose={() => { /* noop in page */ }}
          />

          <div className="p-6 bg-white">
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Email</label>
                  <Input value={profile?.email ?? ''} disabled />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Rôle</label>
                  <Input value={(profile?.roles || []).join(', ') || 'Utilisateur'} disabled />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Nom complet</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Téléphone</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-1">Photo de profil</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {avatarPreview ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Aucune</span>}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setAvatarFile(f);
                        setAvatarPreview(f ? URL.createObjectURL(f) : (profile as any)?.avatar_url ?? null);
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">PNG/JPG max 2MB</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
