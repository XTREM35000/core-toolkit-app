import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmailInput } from '@/components/ui/email-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const SignupTab = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    avatar: null as File | null
  });

  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

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
      // Optionally upload avatar before signup
      let avatarUrl: string | null = null;
      if (formData.avatar) {
        try {
          const fileExt = formData.avatar.name.split('.').pop();
          const fileName = `signup-${Date.now()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, formData.avatar);
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
            avatarUrl = publicUrl;
          }
        } catch (err) {
          console.warn('avatar upload failed', err);
        }
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            avatar_url: avatarUrl
          },
        },
      });

      if (error) throw error;

      // Upsert a profiles row so UI has the expected fields filled
      try {
        const userResult: any = await (supabase.auth as any).getUser?.() ?? { data: { user: null } };
        const userId = userResult?.data?.user?.id;
        if (userId) {
          const profilePayload: any = {
            id: userId,
            email: formData.email,
            first_name: formData.fullName.split(' ')[0] || formData.fullName,
            last_name: formData.fullName.split(' ').slice(1).join(' ') || '',
            avatar_url: avatarUrl,
            phone: formData.phone,
            full_name: formData.fullName,
            permissions: ['read'],
            is_active: true,
            selected_plan: 'free',
            onboarding_completed: false
          };

          const { error: profileError } = await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' });
          if (profileError) console.warn('Profile upsert after signup failed', profileError);
        }
      } catch (err) {
        console.warn('Could not upsert profile after signup', err);
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
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
      <div className="flex justify-center">
        <div className="w-full max-w-xs text-center">
          <AvatarUpload value={formData.avatar} onChange={(file) => setFormData({ ...formData, avatar: file })} label="Photo de profil" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-name">Nom complet</Label>
        <Input
          id="signup-name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
          placeholder="Jean Dupont"
        />
      </div>

      <div className="space-y-2">
        <EmailInput value={formData.email} onChange={(email) => setFormData({ ...formData, email })} label="Email" required />
      </div>

      <div className="space-y-2">
        <PhoneInput value={formData.phone} onChange={(phone) => setFormData({ ...formData, phone })} label="Téléphone" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Mot de passe</Label>
        <Input
          id="signup-password"
          type="password"
          value={formData.password}
          onChange={(e) => {
            const v = e.target.value;
            setFormData({ ...formData, password: v });
            // rudimentary strength: length + char classes
            const strength = v.length >= 12 || (/\d/.test(v) && /[A-Z]/.test(v) && /[^A-Za-z0-9]/.test(v) && v.length >= 8) ? 'strong' : (v.length >= 8 ? 'medium' : 'weak');
            setPasswordStrength(strength as any);
          }}
          required
          placeholder="Min. 8 caractères"
        />
        <div className="h-2 mt-2 w-full bg-gray-200 rounded overflow-hidden">
          <div
            className={`h-2 ${passwordStrength === 'weak' ? 'bg-red-400 w-1/3' : passwordStrength === 'medium' ? 'bg-amber-400 w-2/3' : 'bg-emerald-400 w-full'}`}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
        disabled={loading}
      >
        {loading ? 'Inscription...' : "S'inscrire"}
      </Button>
    </form>
  );
};
