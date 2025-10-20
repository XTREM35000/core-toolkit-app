//src\components\workflow\TenantAdminModal.tsx
// 
import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Key,
  Mail,
  User,
  CheckCircle,
  X,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  Upload,
  Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedLogo from '@/components/AnimatedLogo';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { PhoneInput } from '@/components/ui/phone-input';
import { EmailInput } from '@/components/ui/email-input';
import { FormModal } from '@/components/ui/FormModal';

interface TenantAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (tenantProfile?: any) => void;
  selectedPlan?: any;
}

export const TenantAdminModal = ({ isOpen, onClose, onSuccess, selectedPlan }: TenantAdminModalProps) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    avatar: null as File | null
  });

  // Auto-générer l'email par défaut: prenom.nom@automaster.ci
  useEffect(() => {
    const first = (formData.firstName || '').trim().toLowerCase().replace(/\s+/g, '.');
    const last = (formData.lastName || '').trim().toLowerCase().replace(/\s+/g, '.');
    if (first && last) {
      const autoEmail = `${first}.${last}@automaster.ci`;
      // Ne pas écraser si l'utilisateur a déjà modifié manuellement vers autre domaine
      if (!formData.email || /@automaster\.ci$/i.test(formData.email)) {
        setFormData(prev => ({ ...prev, email: autoEmail }));
      }
    }
  }, [formData.firstName, formData.lastName]);

  // Pré-remplir email/téléphone depuis le profil courant si disponibles
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        email: prev.email || profile.email || '',
        phone: prev.phone || (profile as any).phone || ''
      }));
    }
  }, [profile]);

  // Gestion du drag vertical
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 50) {
      return;
    }
    // Augmenter les limites de drag vertical pour compenser les messages d'erreur
    const maxDragY = 300; // Réduit de 600 à 300 pour cohérence
    const clampedY = Math.max(-maxDragY, Math.min(maxDragY, info.offset.y));
    setDragY(clampedY);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);

    if (Math.abs(info.offset.x) > 100) {
      setDragY(0);
      return;
    }

    if (info.offset.y > 250 && info.velocity.y > 500) { // Réduit de 600 à 250 pour cohérence
      onClose();
    } else {
      setDragY(0);
    }
  };

  // Gestion de la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Ajuster la position du modal quand une erreur apparaît
  useEffect(() => {
    if (error) {
      // Déplacer légèrement le modal vers le haut pour compenser l'erreur
      setDragY(-50);
    } else {
      // Remettre en position normale quand l'erreur disparaît
      setDragY(0);
    }
  }, [error]);

  // Calcul de la force du mot de passe
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 2) return 'Faible';
    if (strength <= 3) return 'Moyen';
    return 'Fort';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.firstName.trim()) {
        setError('Le prénom est requis');
        return;
      }

      if (!formData.lastName.trim()) {
        setError('Le nom est requis');
        return;
      }

      if (!formData.email.trim()) {
        setError('L\'email est requis');
        return;
      }

      // Validation mot de passe (on sécurise le compte propriétaire)
      if (!formData.password.trim()) {
        setError('Le mot de passe est requis');
        return;
      }
      if (formData.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }
      const strength = calculatePasswordStrength(formData.password);
      if (strength < 3) {
        setError('Le mot de passe doit être plus fort (majuscules, minuscules, chiffres)');
        return;
      }

      // Upload de l'avatar si présent
      let avatarUrl = null;
      if (formData.avatar) {
        try {
          const fileExt = formData.avatar.name.split('.').pop();
          const fileName = `tenant-admin-${Date.now()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, formData.avatar);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);
            avatarUrl = publicUrl;
          } else {
            console.warn('Erreur upload avatar, utilisation sans avatar:', uploadError);
            // Continuer sans avatar plutôt que d'échouer
          }
        } catch (uploadError) {
          console.warn('Erreur upload avatar, utilisation sans avatar:', uploadError);
          // Continuer sans avatar plutôt que d'échouer
        }
      }

      // 1) Créer le compte auth pour le Tenant Admin
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            avatar_url: avatarUrl,
            role: 'tenant_admin' as any,
            selected_plan: selectedPlan?.type
          }
        }
      });

      if (authError) throw authError;

      // 2) Upsert profil avec l'ID renvoyé par l'auth
      if (authData.user?.id) {
        const { data: updatedProfile, error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            avatar_url: avatarUrl,
            role: 'tenant_admin',
            selected_plan: selectedPlan?.type,
            updated_at: new Date().toISOString()
          } as any, {
            onConflict: 'id'
          })
          .select('*')
          .single();

        if (profileError) throw profileError;

        setStep(2);
        // Passer immédiatement les données sans timer pour éviter la boucle
        onSuccess?.(updatedProfile);
        onClose();
      } else {
        throw new Error('Création du compte échouée (aucun utilisateur retourné)');
      }
    } catch (error: any) {
      console.error('Erreur création tenant admin:', error);
      setError(error.message || 'Une erreur est survenue lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      draggable
      className="min-h-[700px] rounded-2xl"
    >
      {/* Handle de drag */}
      <div className="flex justify-center pt-3 pb-2 bg-white">
        <div className="w-12 h-1.5 rounded-full bg-[#128C7E]/30" />
      </div>

      {/* Header avec charte graphique WhatsApp */}
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white">
        {/* Indicateur Tenant Admin */}
  <div className="absolute top-3 right-3 flex items-center gap-2 bg-emerald-500 text-emerald-900 px-3 py-1 rounded-full text-xs font-semibold z-10">
          <Crown className="w-4 h-4" />
          Tenant Admin
        </div>

        <div className="p-4 text-center">
          <div className="flex justify-center mb-3">
            <AnimatedLogo
              size={48}
              mainIcon={Shield}
              secondaryIcon={Crown}
              mainColor="text-white"
              secondaryColor="text-yellow-300"
              waterDrop={false}
              className="bg-white/20 rounded-full p-2"
            />
          </div>
          <h2 className="text-xl font-bold mb-1 text-white">
            Création Tenant Admin
          </h2>
          <p className="text-xs opacity-90 text-white/90">
            {selectedPlan ? `Plan ${selectedPlan.name}` : 'Configuration du compte administrateur'}
          </p>
        </div>

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white/80 hover:text-white hover:bg-white/20 focus:ring-white/50"
          aria-label="Fermer la modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Contenu compact */}
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-[hsl(var(--card))] dark:to-[hsl(var(--card))]">
        <div className="p-4">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Avatar avec composant réutilisable */}
              <AvatarUpload
                value={formData.avatar}
                onChange={(file) => setFormData({ ...formData, avatar: file })}
                label="Photo de profil"
              />

              {/* Informations personnelles compactes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-[#128C7E]" />
                  <h3 className="text-sm font-semibold">Informations personnelles</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-xs">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="h-8 text-sm transition-all duration-200 focus:ring-2 focus:ring-[#128C7E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-xs">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="h-8 text-sm transition-all duration-200 focus:ring-2 focus:ring-[#128C7E]"
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
              </div>

              {/* Sécurité compacte */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-[#128C7E]" />
                  <h3 className="text-sm font-semibold">Sécurité</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-1 text-xs">
                    <Key className="h-3 w-3" />
                    Mot de passe *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setPasswordStrength(calculatePasswordStrength(e.target.value));
                      }}
                      required
                      className="h-8 text-sm pr-8 transition-all duration-200 focus:ring-2 focus:ring-[#128C7E]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-8 px-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>

                  {formData.password && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Force</span>
                        <span className={`font-medium ${passwordStrength <= 2 ? 'text-red-500' :
                          passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'
                          }`}>
                          {getPasswordStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      {passwordStrength < 3 && (
                        <div className="text-xs text-gray-500">
                          Majuscules, minuscules, chiffres requis
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions compactes */}
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  size="sm"
                  className="bg-gradient-to-r from-[#128C7E] to-[#075E54] hover:from-[#0F7B6B] hover:to-[#064A42] text-white"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" />
                      Créer Tenant Admin
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#128C7E] to-[#075E54] rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#128C7E]">Tenant Admin créé avec succès !</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Procédez maintenant au paiement pour activer votre compte.
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    onSuccess?.();
                    onClose();
                  }}
                  size="sm"
                  className="bg-gradient-to-r from-[#128C7E] to-[#075E54] hover:from-[#0F7B6B] hover:to-[#064A42] text-white"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Procéder au paiement
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

    </FormModal>
  );
};

