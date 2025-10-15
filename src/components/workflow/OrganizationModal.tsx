import { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Crown,
  Globe,
  FileText,
  Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DraggableModalWrapper } from '@/components/ui/draggable-modal-wrapper';
import { PhoneInput } from '@/components/ui/phone-input';
import { EmailInput } from '@/components/ui/email-input';
import { ThematicLogo } from '@/components/ui/ThematicLogo';

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const OrganizationModal = ({ isOpen, onClose, onSuccess }: OrganizationModalProps) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    address: '',
    city: '',
    country: 'Côte d\'Ivoire',
    phone: '',
    email: '',
    website: '',
    taxNumber: ''
  });

  // Gestion du drag vertical comme dans SuperAdminModal
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    // Empêcher le drag horizontal excessif
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

    // Empêcher la fermeture accidentelle lors du drag horizontal
    if (Math.abs(info.offset.x) > 100) {
      // Reset position sans fermer
      setDragY(0);
      return;
    }

    // Fermer seulement si le drag vertical est suffisant ET vers le bas avec une vitesse importante
    if (info.offset.y > 250 && info.velocity.y > 500) { // Réduit de 600 à 250 pour cohérence
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

  // Vérifier si l'utilisateur a déjà une organisation
  useEffect(() => {
    const checkExistingOrganization = async () => {
      if (profile?.id) {
        try {
          console.log('🔍 Vérification de l\'organisation existante pour l\'utilisateur:', profile.id);
          const { data: userOrgs, error } = await supabase
            .from('user_organization')
            .select(`
              organization_id,
              organizations (
                id,
                name,
                slug,
                status
              )
            `)
            .eq('user_id', profile.id)
            .eq('role', 'admin');

          if (error) {
            console.log('ℹ️ Erreur lors de la vérification des organisations:', error.message);
            return;
          }

          if (userOrgs && userOrgs.length > 0) {
            console.log('✅ Organisation(s) existante(s) trouvée(s):', userOrgs);
            // Vérifier si au moins une organisation est active
            const activeOrg = userOrgs.find(org =>
              org.organizations && org.organizations.status === 'active'
            );

            if (activeOrg) {
              console.log('✅ Organisation active trouvée, passage à l\'étape suivante');
              onSuccess?.();
            } else {
              console.log('⚠️ Aucune organisation active, création nécessaire');
            }
          } else {
            console.log('ℹ️ Aucune organisation existante, création nécessaire');
          }
        } catch (error) {
          console.log('ℹ️ Erreur lors de la vérification des organisations:', error);
        }
      }
    };

    if (isOpen) {
      checkExistingOrganization();
    }
  }, [profile?.id, isOpen, onSuccess]);

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

  // Génération automatique du slug
  const generateSlug = (name: string) => {
    const currentYear = new Date().getFullYear();
    const baseSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
      .replace(/\s+/g, '-') // Remplacer espaces par tirets
      .replace(/-+/g, '-') // Supprimer tirets multiples
      .replace(/^-|-$/g, ''); // Supprimer tirets en début/fin

    return `${baseSlug}-${currentYear}`;
  };

  // Mise à jour du slug quand le nom change
  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.name)
      }));
    }
  }, [formData.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Log pour débogage
      console.log('🏢 OrganizationModal - Données du formulaire:', formData);
      console.log('🏢 OrganizationModal - Email:', formData.email);

      // Validation
      if (!formData.name.trim()) {
        setError('Le nom de l\'organisation est requis');
        return;
      }

      if (!formData.email.trim()) {
        setError('L\'email de contact est requis');
        return;
      }

      if (!profile?.id) {
        setError('Utilisateur non authentifié');
        return;
      }

      // Préparer les données pour l'insertion
      const organizationData = {
        name: formData.name.trim(),
        slug: formData.slug || generateSlug(formData.name),
        address: {
          street: formData.address,
          city: formData.city,
          country: formData.country,
          tax_number: formData.taxNumber
        },
        plan_type: 'free', // Par défaut
        status: 'pending',
        created_by: profile.id
      };

      // Créer l'organisation
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert(organizationData)
        .select()
        .single();

      if (orgError) throw orgError;

      // Créer la relation user_organization
      const { error: userOrgError } = await supabase
        .from('user_organization')
        .insert({
          user_id: profile.id,
          organization_id: orgData.id,
          role: 'admin'
        });

      if (userOrgError) throw userOrgError;

      setStep(2);
    } catch (error: any) {
      console.error('Erreur création organisation:', error);
      setError(error.message || 'Une erreur est survenue lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DraggableModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      allowCloseOnOutsideClick={false}
      allowDragToClose={true}
      dragConstraints={{ top: -300, bottom: 400 }} // Cohérent avec les autres modals
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onWheel={(e) => {
        e.stopPropagation();
        const nextY = dragY - Math.sign(e.deltaY) * 20;
        const clamped = Math.max(-300, Math.min(400, nextY)); // Cohérent avec les autres modals
        setDragY(clamped);
      }}
      style={{
        transform: `translateY(${dragY}px)`
      }}
    >
      {/* Handle de drag */}
      <div className="flex justify-center pt-3 pb-2 bg-white">
        <div className="w-12 h-1.5 rounded-full bg-[#128C7E]/30" />
      </div>

      {/* Header avec charte graphique WhatsApp */}
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white">
        {/* Indicateur Organisation */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-blue-500 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold z-10">
          <Building className="w-4 h-4" />
          Organisation
        </div>

        <div className="p-4 text-center">
          <div className="flex justify-center mb-3">
            <ThematicLogo
              theme="organization"
              size={48}
              className="text-white"
            />
          </div>
          <h2 className="text-xl font-bold mb-1 text-white">
            Création d'Organisation
          </h2>
          <p className="text-xs opacity-90 text-white/90">
            Configurez votre organisation
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

      {/* Contenu compact SANS SCROLL */}
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-[hsl(var(--card))] dark:to-[hsl(var(--card))]">
        <div className="p-3">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-2">
              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Informations de base compactes */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-[#128C7E]" />
                  <h3 className="text-sm font-semibold">Informations de base</h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-xs">Nom organisation *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-7 text-xs"
                      placeholder="Garage Auto Excellence"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-xs">Ville</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="h-7 text-xs"
                      placeholder="Abidjan"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Adresse ultra-compact */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <EmailInput
                    value={formData.email}
                    onChange={(email) => setFormData({ ...formData, email })}
                    label="Email"
                    required
                    className="col-span-1"
                  />
                  <PhoneInput
                    value={formData.phone}
                    onChange={(phone) => setFormData({ ...formData, phone })}
                    label="Téléphone"
                    className="col-span-1"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address" className="text-xs">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="h-7 text-xs"
                    placeholder="Rue, quartier, ville"
                  />
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
                      Créer Organisation
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
                <h3 className="text-lg font-bold text-[#128C7E]">Organisation créée avec succès !</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Votre organisation est maintenant configurée.
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
                  Continuer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DraggableModalWrapper>
  );
};