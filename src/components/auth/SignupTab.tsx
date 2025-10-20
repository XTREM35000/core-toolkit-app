import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { PhoneInput } from '@/components/ui/phone-input';
import { EmailInput } from '@/components/ui/email-input';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SignupTabProps {
  onClose: () => void;
}

export const SignupTab = ({ onClose }: SignupTabProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);

  // Calculate password strength
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 70) return 'bg-yellow-500';
    return 'bg-emerald-600';
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength < 40) return 'Faible';
    if (strength < 70) return 'Moyen';
    return 'Fort';
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let avatarUrl = '';

      // Upload avatar if provided
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(`${fileName}`, avatar);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(uploadData.path);

        avatarUrl = publicUrl;
      }

      // Sign up user
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            avatar_url: avatarUrl,
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Upsert profile with all required fields
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: fullName,
            phone: formData.phone,
            avatar_url: avatarUrl,
            permissions: ['read', 'write'],
            is_active: true,
            selected_plan: null,
            onboarding_completed: false,
          });

        if (profileError) throw profileError;

        // Assign default user role via RPC
        const { error: roleError } = await supabase.rpc('assign_role_to_user', {
          target_user_id: authData.user.id,
          target_role: 'user',
        });

        if (roleError) console.warn('Role assignment warning:', roleError);
      }

      toast({
        title: "Bienvenue ! 🎉",
        description: "Votre compte a été créé avec succès",
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Avatar Upload */}
      <AvatarUpload
        value={avatar}
        onChange={setAvatar}
        label="Photo de profil"
      />

      {/* First Name & Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-firstname">Prénom</Label>
          <Input
            id="signup-firstname"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            placeholder="Jean"
            aria-required="true"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-lastname">Nom</Label>
          <Input
            id="signup-lastname"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            placeholder="Dupont"
            aria-required="true"
          />
        </div>
      </div>

      {/* Email */}
      <EmailInput
        value={formData.email}
        onChange={(email) => setFormData({ ...formData, email })}
        label="Email"
        required
      />

      {/* Phone */}
      <PhoneInput
        value={formData.phone}
        onChange={(phone) => setFormData({ ...formData, phone })}
        label="Téléphone"
        required
      />

      {/* Password with Strength Indicator */}
      <div className="space-y-2">
        <Label htmlFor="signup-password">Mot de passe</Label>
        <Input
          id="signup-password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          placeholder="Min. 8 caractères"
          aria-required="true"
          aria-describedby="password-strength"
        />
        {formData.password && (
          <div className="space-y-1" id="password-strength">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Force du mot de passe</span>
              <span className={`font-medium ${passwordStrength < 40 ? 'text-red-500' : passwordStrength < 70 ? 'text-yellow-500' : 'text-emerald-600'}`}>
                {getPasswordStrengthText(passwordStrength)}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white font-semibold hover:opacity-90 transition-opacity"
        disabled={loading}
      >
        {loading ? 'Inscription en cours...' : "S'inscrire"}
      </Button>
    </form>
  );
};
