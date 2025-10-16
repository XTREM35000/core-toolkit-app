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
import { ThematicLogo } from '@/components/ui/ThematicLogo';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { PhoneInput } from '@/components/ui/phone-input';
import { EmailInput } from '@/components/ui/email-input';
import { FormModal } from '@/components/ui/FormModal';

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

  // Gestion du drag vertical comme dans WhatsAppModal
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    // Empêcher le drag horizontal excessif
    if (Math.abs(info.offset.x) > 50) {
      return;
    }
    // Augmenter les limites de drag vertical pour compenser les messages d'erreur
    const maxDragY = 300; // Augmenté de 200 à 300
    const clampedY = Math.max(-maxDragY, Math.min(maxDragY, info.offset.y));
    setDragY(clampedY);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);

    // Empêcher la fermeture accidentelle lors du drag horizontal
    if (Math.abs(info.offset.x) > 100) {
      // Reset position sans fermer
      setDragY(0);
      return;
    }

    // Fermer seulement si le drag vertical est suffisant ET vers le bas avec une vitesse importante
    if (info.offset.y > 250 && info.velocity.y > 500) { // Augmenté de 200 à 250
      onClose();
    } else {
      // Reset position avec animation fluide
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

  const checkSuperAdminExists = async (): Promise<boolean> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'super_admin')
      .limit(1);

    return !error && data && data.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('[SuperAdmin] handleSubmit: start', formData);
      // Validation des données
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        console.error('[SuperAdmin] Champs manquants', formData);
        setError('Tous les champs obligatoires doivent être remplis');
        return;
      }

      if (formData.password.length < 8) {
        console.error('[SuperAdmin] Mot de passe trop court', formData.password);
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }

      // Vérifier si un super admin existe déjà
      const { data: existingAdmins, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'super_admin')
        .limit(1);
      console.log('[SuperAdmin] Vérification super admin existant', { existingAdmins, checkError });

      if (checkError) throw checkError;

      if (existingAdmins && existingAdmins.length > 0) {
        console.warn('[SuperAdmin] Un super admin existe déjà', existingAdmins);
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
          console.log('[SuperAdmin] Upload avatar', filePath);

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, formData.avatar);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);
            avatarUrl = publicUrl;
            console.log('[SuperAdmin] Avatar upload OK', avatarUrl);
          } else {
            console.warn('[SuperAdmin] Erreur upload avatar, utilisation sans avatar:', uploadError);
          }
        } catch (uploadError) {
          console.warn('[SuperAdmin] Erreur upload avatar, utilisation sans avatar:', uploadError);
        }
      }

      // Créer le super admin avec la même approche que TenantAdminModal
      console.log('[SuperAdmin] Création du compte auth...', formData.email);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            avatar_url: avatarUrl,
            role: 'super_admin',
            email_verified: true,
            onboarding_completed: true
          }
        }
      });
      console.log('[SuperAdmin] Résultat signUp', { authData, authError });

      if (authError) throw authError;

      if (authData.user) {
        console.log('[SuperAdmin] Compte auth créé, mise à jour du profil...', authData.user.id);

        // Mettre à jour le profil existant avec le rôle super_admin
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            avatar_url: avatarUrl,
            role: 'super_admin',
            email_verified: true,
            onboarding_completed: true,
            full_name: `${formData.firstName} ${formData.lastName}`,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });
        console.log('[SuperAdmin] Résultat upsert profil', { profileError });

        if (profileError) {
          console.error('[SuperAdmin] Erreur mise à jour profil:', profileError);
          // Si c'est un conflit, essayer une mise à jour simple
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone,
              avatar_url: avatarUrl,
              role: 'super_admin',
              email_verified: true,
              onboarding_completed: true,
              full_name: `${formData.firstName} ${formData.lastName}`,
              updated_at: new Date().toISOString()
            })
            .eq('id', authData.user.id);
          console.log('[SuperAdmin] Résultat update profil', { updateError });
          if (updateError) throw updateError;
        }

        console.log('[SuperAdmin] Profil Super Admin mis à jour, initialisation des plans...');

        // Initialiser les plans d'abonnement
        await initializeSubscriptionPlans();

        console.log('[SuperAdmin] Super Admin créé avec succès!');
        setStep(2);

        // Appeler onSuccess automatiquement après un délai pour permettre à l'utilisateur de voir le message de succès
        setTimeout(() => {
          console.log('[SuperAdmin] Appel de onSuccess...');
          onSuccess?.();
          // Ne pas fermer le modal ici, laisser le parent gérer la fermeture
        }, 2000); // 2 secondes pour voir le message de succès
      }
    } catch (error: any) {
      console.error('[SuperAdmin] Erreur création super admin:', error);

      // Gestion d'erreurs spécifiques
      if (error.message && (error.message.includes('already exists') || error.message.includes('existe déjà'))) {
        setError('Un super administrateur existe déjà dans le système');
      } else if (error.message && error.message.includes('email')) {
        setError('Erreur avec l\'adresse email. Vérifiez le format.');
      } else if (error.message && error.message.includes('password')) {
        setError('Le mot de passe ne respecte pas les critères de sécurité');
      } else {
        setError(error.message || 'Une erreur est survenue lors de la création');
      }
    } finally {
      setLoading(false);
    }
  };

  const initializeSubscriptionPlans = async () => {
    const plans = [
      {
        name: 'Gratuit',
        type: 'free',
        price: 0,
        duration_days: 9999,
        features: JSON.stringify({
          max_organizations: 1,
          max_garages_per_org: 1,
          max_users_per_org: 3,
          max_vehicles_per_garage: 50,
          support_level: 'email',
          analytics: false
        })
      },
      {
        name: 'Mensuel Pro',
        type: 'monthly',
        price: 50000,
        duration_days: 30,
        features: JSON.stringify({
          max_organizations: 3,
          max_garages_per_org: 5,
          max_users_per_org: 20,
          max_vehicles_per_garage: 500,
          support_level: 'priority',
          analytics: true
        })
      },
      {
        name: 'Annuel Business',
        type: 'annual',
        price: 500000,
        duration_days: 365,
        features: JSON.stringify({
          max_organizations: 10,
          max_garages_per_org: 20,
          max_users_per_org: 100,
          max_vehicles_per_garage: 2000,
          support_level: 'premium',
          analytics: true
        })
      }
    ];

    for (const plan of plans) {
      // supabase client typings may not include 'subscription_plans' in the generated schema,
      // so cast to any for this specific call to avoid the TypeScript overload error.
      await (supabase as any).from('subscription_plans').upsert(plan, {
        onConflict: 'type'
      });
    }
  };

  return (
    <FormModal
      key={isOpen ? 'superadmin-open' : 'superadmin-closed'}
      {...({
        isOpen,
        onClose,
        draggable: true,
        dragConstraints: { top: -600, bottom: 600 },
        onDragStart: handleDragStart,
        onDrag: handleDrag,
        onDragEnd: handleDragEnd,
        onWheel: (e: any) => {
          e.stopPropagation();
          const nextY = dragY - Math.sign(e.deltaY) * 20;
          const clamped = Math.max(-600, Math.min(600, nextY));
          setDragY(clamped);
        },
        className: "min-h-[700px] rounded-2xl"
      } as any)}
    >
      {/* Handle de drag */}
      <div className="flex justify-center pt-3 pb-2 bg-white">
        <div className="w-12 h-1.5 rounded-full bg-[#128C7E]/30" />
      </div>

      {/* Header avec charte graphique WhatsApp */}
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white rounded-t-2xl">
        {/* Indicateur Super Admin */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold z-10">
          <Crown className="w-4 h-4" />
          Super Admin
        </div>

        <div className="p-4 text-center">
          <div className="flex justify-center mb-3">
            <ThematicLogo
              theme="superAdmin"
              size={48}
              className="text-white"
            />
          </div>
          <h2 className="text-xl font-bold mb-1 text-white">Configuration Super Admin</h2>
          <p className="text-xs opacity-90 text-white/90">Initialisation de la plateforme</p>
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

      {/* Contenu sans barre de défilement (afficher tous les champs) */}
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-[hsl(var(--card))] dark:to-[hsl(var(--card))] rounded-b-2xl min-h-[600px]">
        <div className="p-4">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-shake mb-4">
                  <AlertDescription className="text-sm leading-relaxed">{error}</AlertDescription>
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

                  {/* Barre de force du mot de passe compacte */}
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
                      Créer Super Admin
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
                <h3 className="text-lg font-bold text-[#128C7E]">Super Admin créé avec succès !</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  La plateforme est maintenant initialisée.
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    onSuccess?.();
                    // Ne pas fermer le modal ici, laisser le parent gérer la fermeture
                  }}
                  size="sm"
                  className="bg-gradient-to-r from-[#128C7E] to-[#075E54] hover:from-[#0F7B6B] hover:to-[#064A42] text-white"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Continuer vers Plan Selection
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormModal>
  );
};
