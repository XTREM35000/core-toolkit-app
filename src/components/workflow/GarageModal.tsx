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
  Wrench,
  X,
  MapPin,
  Phone,
  User,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Building,
  Mail,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DraggableModalWrapper } from '@/components/ui/draggable-modal-wrapper';
import { PhoneInput } from '@/components/ui/phone-input';
import { ThematicLogo } from '@/components/ui/ThematicLogo';

interface GarageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const GarageModal = ({ isOpen, onClose, onSuccess }: GarageModalProps) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    managerName: '',
    managerPhone: '',
    openingHours: '08:00',
    closingHours: '18:00',
    services: ''
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

  // Vérifier si l'utilisateur a déjà un garage
  useEffect(() => {
    const checkExistingGarage = async () => {
      if (profile?.id) {
        try {
          console.log('🔍 Vérification du garage existant pour l\'utilisateur:', profile.id);
          const { data: userOrgs, error } = await supabase
            .from('user_organization')
            .select(`
              organization_id,
              organizations (
                id,
                garages (
                  id,
                  name,
                  status
                )
              )
            `)
            .eq('user_id', profile.id)
            .eq('role', 'admin');

          if (error) {
            console.log('ℹ️ Erreur lors de la vérification des garages:', error.message);
            return;
          }

          if (userOrgs && userOrgs.length > 0) {
            console.log('🔍 Organisations trouvées:', userOrgs);
            const hasActiveGarages = userOrgs.some(org =>
              org.organizations?.garages &&
              org.organizations.garages.length > 0 &&
              org.organizations.garages.some((garage: any) => garage.status === 'active')
            );

            if (hasActiveGarages) {
              console.log('✅ Garage actif trouvé, passage à l\'étape suivante');
              onSuccess?.();
            } else {
              console.log('⚠️ Aucun garage actif trouvé, création nécessaire');
            }
          } else {
            console.log('ℹ️ Aucune organisation trouvée, création nécessaire');
          }
        } catch (error) {
          console.log('ℹ️ Erreur lors de la vérification des garages:', error);
        }
      }
    };

    if (isOpen) {
      checkExistingGarage();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.name.trim()) {
        setError('Le nom du garage est requis');
        return;
      }

      if (!formData.managerName.trim()) {
        setError('Le nom du gérant est requis');
        return;
      }

      // Simuler la création du garage
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStep(2);
    } catch (error: any) {
      console.error('Erreur création garage:', error);
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
        {/* Indicateur Garage */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-orange-500 text-orange-900 px-3 py-1 rounded-full text-xs font-semibold z-10">
          <Wrench className="w-4 h-4" />
          Garage
        </div>

        <div className="p-4 text-center">
          <div className="flex justify-center mb-3">
            <ThematicLogo
              theme="garage"
              size={48}
              className="text-white"
            />
          </div>
          <h2 className="text-xl font-bold mb-1 text-white">
            Création de Garage
          </h2>
          <p className="text-xs opacity-90 text-white/90">
            Configurez votre garage
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

              {/* Informations essentielles ultra-compactes */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-xs">Nom garage *</Label>
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
                    <Label htmlFor="managerName" className="text-xs">Gérant *</Label>
                    <Input
                      id="managerName"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                      required
                      className="h-7 text-xs"
                      placeholder="Nom du gérant"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
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
                  <PhoneInput
                    value={formData.phone}
                    onChange={(phone) => setFormData({ ...formData, phone })}
                    label="Téléphone"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address" className="text-xs">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="h-7 text-xs"
                    placeholder="Rue, quartier"
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
                      Créer Garage
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
                <h3 className="text-lg font-bold text-[#128C7E]">Garage créé avec succès !</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Votre garage est maintenant configuré.
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