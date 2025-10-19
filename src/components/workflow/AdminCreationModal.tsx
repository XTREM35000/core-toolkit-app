import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, UserPlus, X, CheckCircle } from 'lucide-react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { ThematicLogo } from '@/components/ui/ThematicLogo';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { PhoneInput } from '@/components/ui/phone-input';
import { EmailInput } from '@/components/ui/email-input';
import { useAuth } from '@/contexts/AuthContext';

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
    firstName: '',
    lastName: '',
    phone: '',
    avatar: null as File | null,
    role: 'admin' as string, // default role for created user (admin or lower)
    tenantName: '',
    plan: 'free'
  });

  type AppRole = 'super_admin' | 'admin' | 'user';

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

      // Avatar upload temporarily disabled (backend not ready)
      const avatarUrl = null;

      // Créer le compte via Supabase Auth
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
        // Mettre à jour le profil avec le scope tenant
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
        full_name: `${formData.firstName} ${formData.lastName}`,
          permissions: ['read', 'write'],
          is_active: true,
            tenant_id: (tenantId || (profile as any)?.tenant_id)
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        // Assign role for the tenant using a secure RPC
        // The RPC should validate tenant ownership and assign the requested role (admin or lower)
        // Try to assign role via RPC (SECURITY DEFINER). If RPC missing or forbidden, fallback to client insert.
        const dbRole: AppRole = formData.role === 'admin' ? 'admin' : 'user';

        try {
          // Try RPC with parameter names as declared (with underscores)
          let rpcResult: any = await (supabase as any).rpc('assign_role_to_user', { _user_id: authData.user.id, _role: dbRole });
          let rpcErr = rpcResult?.error ?? null;

          if (rpcErr) {
            // Log the error details to help debugging (status/message/details)
            console.warn('assign_role_to_user RPC (with _params) error:', rpcErr);

            // Some PostgREST deployments or naming conventions might expect params without leading underscores.
            // Try calling the RPC again with alternative param names to rule out naming mismatch.
            const altRpcResult: any = await (supabase as any).rpc('assign_role_to_user', { user_id: authData.user.id, role: dbRole });
            rpcErr = altRpcResult?.error ?? null;
            if (rpcErr) {
              console.warn('assign_role_to_user RPC (without _params) error:', rpcErr);
              // If still failing, surface the RPC error so the outer catch will handle fallback.
              throw rpcErr;
            }
          }
        } catch (e: any) {
          // Fallback to client insert (may fail due to RLS). Log full error for diagnostics.
          console.error('assign_role_to_user RPC failed, falling back to direct insert. RPC error:', e);
          const { error: insertErr } = await supabase
            .from('user_roles')
            .insert([{ user_id: authData.user.id, role: dbRole }]);
          if (insertErr) {
            console.error('Direct insert into user_roles failed:', insertErr);
            throw insertErr;
          }
        }

        // Synchronize profile.role for quick checks
        const { error: profileRoleError } = await supabase
          .from('profiles')
          .update({ role: dbRole })
          .eq('id', authData.user.id);

        if (profileRoleError) console.warn('Failed to update profile.role for admin:', profileRoleError);

        // Close this modal and signal parent to open PlanSelectionModal
        onClose();
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Erreur création admin tenant:', error);
      setError(error.message || 'Une erreur est survenue lors de la création');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <WhatsAppModal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      className="rounded-2xl"
      allowCloseOnOutsideClick={false}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white rounded-t-2xl relative">
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-green-200 text-green-900 px-3 py-1 rounded-full text-xs font-semibold z-10">
          <UserPlus className="w-4 h-4" />
          Admin
        </div>

        <div className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <ThematicLogo theme="admin" size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Créer un administrateur (Tenant)</h2>
          <p className="text-sm opacity-90 text-white/90">Créez un compte admin pour ce client (tenant)</p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 text-white/80 hover:text-foreground"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

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
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="rounded-lg"
              />
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="tenantName">Nom du tenant</Label>
            <Input
              id="tenantName"
              value={formData.tenantName}
              onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
              placeholder="Ex: Acme Corp"
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Plan</Label>
            <select
              id="plan"
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              className="w-full rounded-lg border p-2"
            >
              <option value="free">Free</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe *</Label>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-lg border p-2"
            >
              <option value="admin">Admin</option>
              <option value="collaborator">Collaborator</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

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
