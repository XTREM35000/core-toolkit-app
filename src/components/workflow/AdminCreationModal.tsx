import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle } from 'lucide-react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { ModalHeader } from './shared/ModalHeader';
import { FormField } from './shared/FormField';

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

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // support both separated names and a single fullName field (the form uses fullName)
    firstName: '',
    lastName: '',
    fullName: '',
    confirmPassword: '',
    phone: '',
    avatar: null as File | null,
    role: 'admin' as string, // default role for created user (admin or lower)
    tenantName: '',
    plan: 'free'
  });
  // Auto-générer l'email
  useEffect(() => {
    // prefer explicit firstName/lastName, otherwise derive from fullName
    const rawFirst = formData.firstName || (formData.fullName ? formData.fullName.trim().split(/\s+/)[0] : '');
    const rawLast = formData.lastName || (formData.fullName ? formData.fullName.trim().split(/\s+/).slice(1).join(' ') : '');
    const first = (rawFirst || '').trim().toLowerCase().replace(/\s+/g, '.');
    const last = (rawLast || '').trim().toLowerCase().replace(/\s+/g, '.');
    if (first && last && (!formData.email || /@automaster\.ci$/i.test(formData.email))) {
      setFormData(prev => ({ ...prev, email: `${first}.${last}@automaster.ci` }));
    }
  }, [formData.firstName, formData.lastName, formData.fullName, formData.email]);

  if (step === 2) {
    return (
      <WhatsAppModal 
        isOpen={isOpen} 
        onClose={onClose}
        size="md"
        className="rounded-2xl"
      >
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <CheckCircle className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2">Admin créé !</h2>
          <p className="text-muted-foreground text-center">
            Le compte administrateur du tenant a été créé avec succès.
          </p>
        </div>
      </WhatsAppModal>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const first = formData.firstName || (formData.fullName ? formData.fullName.trim().split(/\s+/)[0] : '');
        const last = formData.lastName || (formData.fullName ? formData.fullName.trim().split(/\s+/).slice(1).join(' ') : '');

        if (!formData.email || !formData.password || !first || !last) {
          setError('Tous les champs obligatoires doivent être remplis');
          return;
        }

        if (formData.password.length < 8) {
          setError('Le mot de passe doit contenir au moins 8 caractères');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return;
        }

        // Avatar upload temporarily disabled (backend not ready)
        const avatarUrl = null;

        // Create the account via Supabase Auth
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
        if (!userId) {
          throw new Error('Impossible de récupérer l\'utilisateur créé');
        }

        // Update profile with tenant scope
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: `${first} ${last}`,
            permissions: ['read', 'write'],
            is_active: true,
            tenant_id: (tenantId || (profile as any)?.tenant_id) ?? null
          })
          .eq('id', userId);

        if (profileError) throw profileError;

        // Assign role for the tenant using a secure RPC, fallback to direct insert
        const dbRole: AppRole = formData.role === 'admin' ? 'admin' : 'user';

        try {
          // Try RPC with underscored params first
          let rpcResult: any = await (supabase as any).rpc('assign_role_to_user', { _user_id: userId, _role: dbRole });
          let rpcErr = rpcResult?.error ?? null;

          if (rpcErr) {
            console.warn('assign_role_to_user RPC (with _params) error:', rpcErr);
            const altRpcResult: any = await (supabase as any).rpc('assign_role_to_user', { user_id: userId, role: dbRole });
            rpcErr = altRpcResult?.error ?? null;
            if (rpcErr) {
              console.warn('assign_role_to_user RPC (without _params) error:', rpcErr);
              throw rpcErr;
            }
          }
        } catch (e: any) {
          console.error('assign_role_to_user RPC failed, falling back to direct insert. RPC error:', e);
          const { error: insertErr } = await supabase
            .from('user_roles')
            .insert([{ user_id: userId, role: dbRole }]);
          if (insertErr) {
            console.error('Direct insert into user_roles failed:', insertErr);
            throw insertErr;
          }
        }

        // Keep profile.role in sync for quick checks
        const { error: profileRoleError } = await supabase
          .from('profiles')
          .update({ role: dbRole })
          .eq('id', userId);

        if (profileRoleError) console.warn('Failed to update profile.role for admin:', profileRoleError);

        // show success step
        setStep(2);
        onSuccess?.();
      } catch (err: unknown) {
        console.error('Erreur création admin tenant:', err);
        const message = typeof err === 'string' ? err : (err instanceof Error ? err.message : JSON.stringify(err));
        setError(message || 'Une erreur est survenue lors de la création');
      } finally {
        setLoading(false);
      }
    })();
  }

  return (
    <WhatsAppModal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      className="rounded-2xl"
      allowCloseOnOutsideClick={false}
    >
      <ModalHeader
        title="Créer un Admin"
        subtitle="Ajouter un administrateur à la plateforme"
        icon={Shield}
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

          <FormField
            id="fullName"
            label="Nom complet"
            value={formData.fullName}
            onChange={(fullName) => setFormData({ ...formData, fullName })}
            required
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(email) => setFormData({ ...formData, email })}
            required
          />

          <FormField
            id="password"
            label="Mot de passe"
            type="password"
            value={formData.password}
            onChange={(password) => setFormData({ ...formData, password })}
            required
            placeholder="Min. 8 caractères"
          />

          <FormField
            id="confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            value={formData.confirmPassword}
            onChange={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
            required
          />

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

