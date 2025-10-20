import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, Eye, EyeOff, Cog } from 'lucide-react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { FormField } from './shared/FormField';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { PhoneInput } from '@/components/ui/phone-input';
import { EmailInput } from '@/components/ui/email-input';
import { Input } from '@/components/ui/input';
import AnimatedLogo from '@/components/AnimatedLogo';
import { ModalHeader } from './shared/ModalHeader';
import { PlanSelectionModal } from './PlanSelectionModal';

type AppRole = 'admin' | 'user';

interface AdminCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId?: string; // optional: will be derived from current user's profile if not provided
  onSuccess?: () => void;
}

export const AdminCreationModal = ({ isOpen, onClose, tenantId, onSuccess }: AdminCreationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const { profile } = useAuth();
  const [showPlanModal, setShowPlanModal] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    avatar: null as File | null
  });
  // Auto-générer l'email à partir du prénom/nom
  useEffect(() => {
    const first = (formData.firstName || '').trim().toLowerCase().replace(/\s+/g, '.');
    const last = (formData.lastName || '').trim().toLowerCase().replace(/\s+/g, '.');
    if (first && last && (!formData.email || /@automaster\.ci$/i.test(formData.email))) {
      setFormData(prev => ({ ...prev, email: `${first}.${last}@automaster.ci` }));
    }
  }, [formData.firstName, formData.lastName]);

  // When step becomes 2, open the plan modal shortly after — keep hooks unconditionally at top-level
  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => setShowPlanModal(true), 1200);
      return () => clearTimeout(t);
    }
  }, [step]);

  if (step === 2) {
    return (
      <>
        <WhatsAppModal 
          isOpen={isOpen} 
          onClose={onClose}
          size="md"
          className="rounded-2xl"
        >
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <CheckCircle className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold mb-2">Administrateur créé !</h2>
            <p className="text-muted-foreground text-center">
              Le compte administrateur du tenant a été créé avec succès.
            </p>
          </div>
        </WhatsAppModal>

        <PlanSelectionModal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} onSuccess={() => { setShowPlanModal(false); onSuccess?.(); }} />
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const first = (formData.firstName || '').trim();
      const last = (formData.lastName || '').trim();

      if (!formData.email || !formData.password || !first || !last) {
        setError('Tous les champs obligatoires doivent être remplis');
        return;
      }

      if (formData.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }

      // Upload avatar if present
      let avatarUrl: string | null = null;
      if (formData.avatar) {
        try {
          const fileExt = formData.avatar.name.split('.').pop();
          const fileName = `admin-${Date.now()}.${fileExt}`;
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

      // Create Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: first,
            last_name: last,
            phone: formData.phone,
            avatar_url: avatarUrl,
            full_name: `${first} ${last}`
          }
        }
      });

      if (authError) throw authError;

      const userId = authData?.user?.id;
      if (!userId) throw new Error('Impossible de récupérer l\'utilisateur créé');

  // Upsert profile (includes tenant_id).
  // The database `profiles.role` has a check constraint; mappedRole will be set below.

  // Assign tenant admin role via RPC. Do not attempt client-side insert if RPC fails (likely RLS).
  const dbRole: AppRole = 'admin';

  const mappedRole = dbRole === 'admin' ? 'tenant_admin' : dbRole;

  const profilePayload = {
        id: userId,
        email: formData.email,
        first_name: first,
        last_name: last,
        avatar_url: avatarUrl,
        phone: formData.phone,
        full_name: `${first} ${last}`,
        permissions: ['read', 'write'],
        is_active: true,
        tenant_id: tenantId ?? (profile as any)?.tenant_id ?? null,
        role: mappedRole
      } as any;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' });

      if (profileError) throw profileError;

      try {
        const res: any = await (supabase as any).rpc('assign_role_to_user', { _user_id: userId, _role: dbRole });
        const rpcErr = res?.error ?? null;
        if (rpcErr) throw rpcErr;
      } catch (e: any) {
        console.error('RPC assign_role_to_user failed:', e);
        throw new Error("Impossible d'assigner le rôle via RPC: la fonction est absente ou permissions insuffisantes. Veuillez appliquer la migration `assign_role_to_user` et vous assurer que la fonction a GRANT EXECUTE pour anon/authenticated.");
      }

      // Sync profile.role
      const { error: profileRoleError } = await supabase
        .from('profiles')
        .update({ role: dbRole })
        .eq('id', userId);
      if (profileRoleError) console.warn('Failed to update profile.role for admin:', profileRoleError);

      setStep(2);
      // onSuccess will be called after PlanSelectionModal flow completes; call onSuccess as a fallback
      setTimeout(() => { onSuccess?.(); }, 2000);
    } catch (err: any) {
      console.error('Erreur création admin tenant:', err);
      setError(err?.message || 'Une erreur est survenue lors de la création');
    } finally {
      setLoading(false);
    }
  }

  return (
    <WhatsAppModal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      className="rounded-2xl"
      allowCloseOnOutsideClick={false}
      hideHeader={true}
    >
      {/* Render a custom header inside children so wrapper header is hidden (avoids double header/scroll) */}
      <ModalHeader
        title="Créer un Admin"
        subtitle="Ajouter un administrateur à la plateforme"
        headerLogo={<AnimatedLogo size={56} mainIcon={Cog} mainColor="text-white" secondaryColor="text-green-300" />}
        onClose={onClose}
      />

      {/* Contenu */}
      <div className="p-6 bg-gradient-to-b from-white to-gray-50 dark:from-[hsl(var(--card))] dark:to-[hsl(var(--card))] rounded-b-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="rounded-lg">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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

          <AvatarUpload
            value={formData.avatar}
            onChange={(file) => setFormData({ ...formData, avatar: file })}
            label="Photo de profil"
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

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white font-semibold rounded-lg"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer l\'Administrateur'}
          </Button>
        </form>
      </div>
    </WhatsAppModal>
  );
};

export default AdminCreationModal;

export function useAuth(): { profile: any } {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        // supabase.auth.getUser() (v2) returns { data: { user } }
        // older shapes might return { user }
        const userResult: any = await (supabase.auth as any).getUser?.() ?? (supabase.auth as any).user?.() ?? { data: { user: null } };
        const user = userResult?.data?.user ?? userResult?.user ?? null;
        const userId = user?.id;

        if (!userId) {
          if (mounted) setProfile(null);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.warn('useAuth: failed to load profile', error);
          return;
        }

        if (mounted) setProfile(data);
      } catch (err) {
        console.error('useAuth error', err);
      }
    };

    fetchProfile();

    // subscribe to auth changes to keep profile in sync
    const maybeSub: any = (supabase.auth as any).onAuthStateChange?.((_, __) => {
      fetchProfile();
    });

    return () => {
      mounted = false;
      // unsubscribe from different possible shapes
      try {
        maybeSub?.data?.subscription?.unsubscribe?.();
      } catch {
        try {
          maybeSub?.unsubscribe?.();
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  return { profile };
}

