import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { motion } from 'framer-motion';
import type { Database } from '@/integrations/supabase/types';

const ProfilePage: React.FC = () => {
  const { profile, refreshProfile, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setPhone(profile?.phone ?? '');
    setAvatarFile(null);
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      let avatar_url = profile?.avatar_url ?? null;
      if (avatarFile) {
        try {
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `profiles/profile-${profile?.id || 'anon'}_${Date.now()}.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage.from('public').upload(fileName, avatarFile, { upsert: true });
          if (uploadError) throw uploadError;
          if (uploadData) {
            // Try to resolve a public URL for the uploaded file
            try {
              const { data: publicData } = await supabase.storage.from('public').getPublicUrl(uploadData.path as string);
              avatar_url = publicData?.publicUrl ?? null;
            } catch {
              // Fallback to Base64 if public URL cannot be determined
              const toBase64 = (f: File) => new Promise<string | null>((res) => {
                const reader = new FileReader();
                reader.onload = () => res(typeof reader.result === 'string' ? reader.result : null);
                reader.onerror = () => res(null);
                reader.readAsDataURL(f);
              });
              avatar_url = await toBase64(avatarFile as File);
            }
          }
        } catch (uploadErr) {
          // If storage upload fails for any reason, fallback to base64 encoding so the profile can still be saved
          const toBase64 = (f: File) => new Promise<string | null>((res) => {
            const reader = new FileReader();
            reader.onload = () => res(typeof reader.result === 'string' ? reader.result : null);
            reader.onerror = () => res(null);
            reader.readAsDataURL(f);
          });
          avatar_url = await toBase64(avatarFile as File);
        }
      }

      // Ensure we have a user id to update (use profile from context or fallback to auth user)
      let userId = profile?.id;
      if (!userId) {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        userId = userData?.user?.id;
      }

      if (!userId) throw new Error('Utilisateur non authentifié — impossible d\'associer le profil.');

      // Use upsert so we create the profile row if it does not exist yet
      const updates: Database['public']['Tables']['profiles']['Insert'] = {
        id: userId!,
        full_name: fullName,
        phone: phone || null,
        avatar_url: avatar_url ?? null,
        updated_at: new Date().toISOString(),
        email: profile?.email ?? '',
      };

      const { data: upserted, error } = await supabase
        .from('profiles')
        .upsert(updates)
        .select();

      if (error) throw error;

      toast({ title: 'Profil mis à jour', description: 'Vos informations ont été enregistrées.' });
      await refreshProfile();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Impossible de mettre à jour le profil');
      toast({ title: 'Erreur', description: message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        className="max-w-3xl mx-auto mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-white shadow-lg rounded-3xl border border-gray-100">
          <ModalHeader
            title="Mon Profil"
            subtitle="Gérer vos informations personnelles"
            headerLogo={<AnimatedLogo size={48} mainColor="text-blue-500" secondaryColor="text-blue-300" />}
            onClose={() => { }}
          />

          <motion.form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="flex flex-col items-center md:items-start"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <AvatarUpload value={avatarFile} onChange={setAvatarFile} label="Avatar" className="rounded-full shadow-lg" />
              <p className="mt-2 text-sm text-gray-500">Cliquez pour changer votre avatar</p>
            </motion.div>

            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Nom complet</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nom complet" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <Input value={profile?.email ?? ''} disabled className="bg-gray-50 text-gray-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Téléphone</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Rôle</label>
                  <Input value={(profile?.roles || []).join(', ') || 'Utilisateur'} disabled className="bg-gray-50 text-gray-600" />
                </div>
              </div>

              <div className="mt-4 flex flex-col items-end gap-2">
                {!profile && (
                  <p className="text-sm text-red-600">Profil non chargé ou utilisateur non authentifié — enregistrement désactivé.</p>
                )}
                <Button
                  type="submit"
                  disabled={saving || authLoading || !profile}
                  className="bg-blue-500 hover:bg-blue-600 shadow-md transition-all"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </div>
          </motion.form>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default ProfilePage;
