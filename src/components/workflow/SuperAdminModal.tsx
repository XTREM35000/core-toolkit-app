import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AppButton from '@/components/ui/AppButton';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Crown, CheckCircle, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { PhoneInput } from '@/components/ui/phone-input';
import { EmailInput } from '@/components/ui/email-input';
import { ModalHeader } from './shared/ModalHeader';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { FormField } from './shared/FormField';
import AnimatedLogo from '@/components/AnimatedLogo';

interface SuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SuperAdminModal = ({ isOpen, onClose, onSuccess }: SuperAdminModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    avatar: null as File | null
  });

  // Auto-générer l'email
  useEffect(() => {
    const first = (formData.firstName || '').trim().toLowerCase().replace(/\s+/g, '.');
    const last = (formData.lastName || '').trim().toLowerCase().replace(/\s+/g, '.');
    if (first && last && (!formData.email || /@automaster\.ci$/i.test(formData.email))) {
      setFormData(prev => ({ ...prev, email: `${first}.${last}@automaster.ci` }));
    }
  }, [formData.firstName, formData.lastName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        setError('Tous les champs obligatoires doivent être remplis');
        return;
      }

      if (formData.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }

      // Vérifier si un super admin existe d\u00e9j\u00e0 via RPC s\u00e9curis\u00e9.
      // If the RPC is not available (404 / PGRST202), fall back to direct selects.
      let hasSuperAdmin = false;

      try {
        const { data: hasSuperAdminData, error: hasError } = await (supabase as any).rpc('has_super_admin');
        if (!hasError && hasSuperAdminData !== undefined) {
          hasSuperAdmin = Array.isArray(hasSuperAdminData) ? hasSuperAdminData[0] : hasSuperAdminData;
        }
      } catch (rpcErr) {
        // RPC missing or network error — we'll fallback to selects below.
        console.warn('has_super_admin rpc unavailable, falling back to selects:', rpcErr);
      }

      // Fallback: check profiles and user_roles directly if RPC didn't report true.
      if (!hasSuperAdmin) {
        try {
          const { data: profilesWithSuper } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'super_admin')
            .limit(1) as any;
          hasSuperAdmin = (profilesWithSuper?.length ?? 0) > 0;
        } catch (err) {
          // ignore and try next fallback
        }

        if (!hasSuperAdmin) {
          try {
            const { data: superAdmin } = await supabase
              .from('user_roles' as any)
              .select('id')
              .eq('role', 'super_admin')
              .limit(1) as any;

            hasSuperAdmin = (superAdmin?.length ?? 0) > 0;
          } catch (err) {
            // ignore
          }
        }
      }

      if (hasSuperAdmin === true) {
        setError('Un super administrateur existe d\u00e9j\u00e0 dans le syst\u00e8me');
        return;
      }

      // Upload de l'avatar si présent
      let avatarUrl = null;
      if (formData.avatar) {
        try {
          const fileExt = formData.avatar.name.split('.').pop();
          const fileName = `super-admin-${Date.now()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, formData.avatar);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);
            avatarUrl = publicUrl;
          }
        } catch (uploadError) {
          console.warn('Erreur upload avatar:', uploadError);
        }
      }

      // Créer le compte
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            avatar_url: avatarUrl,
            full_name: `${formData.firstName} ${formData.lastName}`
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Upsert the profile with all expected columns so the profiles table has the correct fields.
        // Use upsert to handle the case where the profile row does not exist yet.
        const profilePayload = {
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          avatar_url: avatarUrl,
          phone: formData.phone,
          full_name: `${formData.firstName} ${formData.lastName}`,
          permissions: ['*'],
          is_active: true,
          // Provide sane defaults so UI checks and DB rows have expected values
          selected_plan: 'free',
          onboarding_completed: true
        } as any;

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profilePayload, { onConflict: 'id' });

        if (profileError) throw profileError;

        // Demander au serveur (RPC) d'assigner le rôle super_admin de façon sécurisée
        // L'appel RPC exécute la logique avec des droits suffisants (SECURITY DEFINER)
        const { data: rpcData, error: rpcError } = await (supabase as any)
          .rpc('assign_initial_super_admin', { user_uuid: authData.user.id });

        if (rpcError) throw rpcError;

        // Also synchronize profile.role for quick checks
        const { error: profileRoleError } = await supabase
          .from('profiles')
          .update({ role: 'super_admin' })
          .eq('id', authData.user.id);

        if (profileRoleError) console.warn('Failed to update profile.role for super_admin:', profileRoleError);

        // Persist last created admin email for faster testing / OTP prefills
        try {
          localStorage.setItem('last_admin_email', formData.email || '');
        } catch {
          /* ignore in non-browser env */
        }

        setStep(2);
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Erreur création super admin:', error);
      setError(error.message || 'Une erreur est survenue lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const modalOpen = !!isOpen;
  const setOpen = (v: boolean) => { if (!v) onClose?.(); };

  if (step === 2) {
    if (!modalOpen) return null;
    return (
      <WhatsAppModal isOpen={modalOpen} onClose={() => setOpen(false)} size="md" hideHeader>
        <div data-debug="SuperAdminModal-success" className="w-full">
          <div className="p-8 flex flex-col items-center justify-center">
            <CheckCircle className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold mb-2">Super Admin créé !</h2>
            <p className="text-muted-foreground text-center">Votre compte a été créé avec succès. Redirection en cours...</p>
            <div className="mt-4">
              <Button onClick={() => setOpen(false)}>OK</Button>
            </div>
          </div>
        </div>
      </WhatsAppModal>
    );
  }

  if (!modalOpen) return null;

  return (
    <WhatsAppModal isOpen={modalOpen} onClose={() => setOpen(false)} size="xl" hideHeader>
      <div className="w-full">
        <ModalHeader
          title="Configuration Super Admin"
          subtitle="Initialisation de la plateforme"
          headerLogo={<AnimatedLogo size={56} mainIcon={UserCheck} mainColor="text-white" secondaryColor="text-yellow-300" waterDrop />}
          badge={
            <div className="flex items-center gap-2 bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
              <Crown className="w-4 h-4" />
              Super Admin
            </div>
          }
          onClose={() => setOpen(false)}
        />

        {/* Contenu */}
        <div className="p-6 bg-gradient-to-b from-white to-gray-50 dark:from-[hsl(var(--card))] dark:to-[hsl(var(--card))] rounded-b-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-lg">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <AvatarUpload
              value={formData.avatar}
              onChange={(file) => setFormData({ ...formData, avatar: file })}
              label="Photo de profil"
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                id="firstName"
                label="Prénom"
                value={formData.firstName}
                onChange={(firstName) => setFormData({ ...formData, firstName })}
                required
              />
              <FormField
                id="lastName"
                label="Nom"
                value={formData.lastName}
                onChange={(lastName) => setFormData({ ...formData, lastName })}
                required
              />
            </div>

            <EmailInput
              value={formData.email}
              onChange={(email) => setFormData({ ...formData, email })}
              label="Email"
              required
            />

            <PhoneInput
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone })}
              label="Téléphone"
            />

            <FormField
              id="password"
              label="Mot de passe"
              value={formData.password}
              onChange={(password) => setFormData({ ...formData, password })}
              required
            >
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="rounded-lg pr-10"
                  placeholder="Min. 8 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <AppButton
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer le Super Admin'}
            </AppButton>
          </form>
        </div>
      </div>
    </WhatsAppModal>
  );
};

export default SuperAdminModal;
