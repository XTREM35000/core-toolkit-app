import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, Crown, X, CheckCircle } from 'lucide-react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { ThematicLogo } from '@/components/ui/ThematicLogo';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { PhoneInput } from '@/components/ui/phone-input';
import { EmailInput } from '@/components/ui/email-input';

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

      // Vérifier si un super admin existe déjà via user_roles
      const { data: existingRoles, error: checkError } = await supabase
        .from('user_roles' as any)
        .select('user_id')
        .eq('role', 'super_admin')
        .limit(1) as any;

      if (checkError) throw checkError;

      if (existingRoles && existingRoles.length > 0) {
        setError('Un super administrateur existe déjà dans le système');
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
        // Mettre à jour le profil
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: `${formData.firstName} ${formData.lastName}`,
            permissions: ['*'],
            is_active: true
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        // Ajouter le rôle super_admin dans user_roles
        const { error: roleError } = await supabase
          .from('user_roles' as any)
          .insert([{
            user_id: authData.user.id,
            role: 'super_admin'
          }]) as any;

        if (roleError) throw roleError;

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
          <h2 className="text-2xl font-bold mb-2">Super Admin créé !</h2>
          <p className="text-muted-foreground text-center">
            Votre compte a été créé avec succès. Redirection en cours...
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
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold z-10">
          <Crown className="w-4 h-4" />
          Super Admin
        </div>

        <div className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <ThematicLogo theme="superAdmin" size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Configuration Super Admin</h2>
          <p className="text-sm opacity-90 text-white/90">Initialisation de la plateforme</p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 text-white/80 hover:text-white hover:bg-white/20"
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

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white font-semibold rounded-lg"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer le Super Admin'}
          </Button>
        </form>
      </div>
    </WhatsAppModal>
  );
};
