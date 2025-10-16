// src\components\workflow\PlanSelectionModal.tsx
// 
import { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  X,
  Check,
  Star,
  Zap,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormModal } from '@/components/ui/FormModal';
import { ThematicLogo } from '@/components/ui/ThematicLogo';
import { supabase } from '@/integrations/supabase/client';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (selectedPlan: Plan) => void;
}

interface PlanFeatures {
  max_organizations: number;
  max_garages_per_org: number;
  max_users_per_org: number;
  max_vehicles_per_garage: number;
  support_level: 'email' | 'priority' | 'premium';
  analytics: boolean;
  setup_days?: number;
  caution_amount?: number;
  additional_activities?: number;
  additional_instances?: number;
}

interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  duration: string;
  features: PlanFeatures; // Mise à jour du type
  popular?: boolean;
  gradient: string;
  color: string;
}

interface SubscriptionPlanDB {
  id: string;
  name: string;
  type: string;
  price: number;
  duration_days: number;
  features: any;
  created_at: string;
  is_active: boolean;
}

export const PlanSelectionModal = ({ isOpen, onClose, onSuccess }: PlanSelectionModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Constante utilisée pour représenter une durée illimitée dans la logique des plans
  const UNLIMITED_DAYS = 9999;

  // Charger les plans depuis la base de données
  useEffect(() => {
    loadPlansFromDatabase();
    // ...existing code...
  }, []);

  const loadPlansFromDatabase = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des plans...');

      const { data, error } = await (supabase as any)
        .from('subscription_plans')
        .select('id, name, type, price, duration_days, features, created_at, is_active')
        .order('price', { ascending: true });

      if (error) throw error;

      let rawPlans = data || [];
      if (!rawPlans.length) {
        console.log('⚠️ Aucun plan trouvé, création des plans par défaut...');
        const seed = [
          {
            name: 'Gratuit',
            type: 'free',
            price: 0,
            duration_days: 7,
            features: {
              max_organizations: 1,
              max_garages_per_org: 1,
              max_users_per_org: 5,
              max_vehicles_per_garage: 50,
              support_level: 'email',
              analytics: false,
              setup_days: 0,
              caution_amount: 0,
              additional_activities: 0,
              additional_instances: 0
            },
            is_active: true
          },
          {
            name: 'Mensuel Pro',
            type: 'monthly',
            price: 15000,
            duration_days: 30,
            features: {
              max_organizations: 1,
              max_garages_per_org: 1,
              max_users_per_org: 20,
              max_vehicles_per_garage: 500,
              support_level: 'priority',
              analytics: true,
              setup_days: 2,
              caution_amount: 50000,
              additional_activities: 2,
              additional_instances: 0
            },
            is_active: true
          },
          {
            name: 'Annuel Pro',
            type: 'annual',
            price: 150000,
            duration_days: 365,
            features: {
              max_organizations: 2,
              max_garages_per_org: 2,
              max_users_per_org: 100,
              max_vehicles_per_garage: 2000,
              support_level: 'premium',
              analytics: true,
              setup_days: 2,
              caution_amount: 50000,
              additional_activities: 0,
              additional_instances: 3
            },
            is_active: true
          }
        ];

        await (supabase as any).from('subscription_plans').insert(seed);
        console.log('✅ Plans par défaut créés');

        const { data: reloaded, error: reloadError } = await (supabase as any)
          .from('subscription_plans')
          .select('id, name, type, price, duration_days, features, created_at, is_active')
          .order('price', { ascending: true });

        if (reloadError) throw reloadError;
        rawPlans = reloaded || [];
      }

      console.log('🔄 Formatage des plans...');
      const formattedPlans: Plan[] = (rawPlans as any[]).map((plan: any) => {
        console.log(`📝 Formatage du plan ${plan.name}:`, {
          id: plan.id,
          type: plan.type,
          duration_days: plan.duration_days,
          features: plan.features
        });

        return {
          id: plan.id,
          name: plan.name,
          type: plan.type,
          price: typeof plan.price === 'string' ? Number(plan.price) : plan.price,
          duration: plan.duration_days === UNLIMITED_DAYS ? 'Illimité' : `${plan.duration_days} jours`,
          features: plan.features as any,
          popular: plan.type === 'monthly',
          gradient: getGradientByType(plan.type),
          color: getColorByType(plan.type)
        };
      });

      console.log('✅ Plans formatés:', formattedPlans);
      setPlans(formattedPlans);

      if (!selectedPlan && formattedPlans.length) {
        setSelectedPlan(formattedPlans[0].id);
        console.log('📌 Plan par défaut sélectionné:', formattedPlans[0].name);
      }
    } catch (error) {
      console.error('❌ Erreur chargement plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
      console.log('🏁 Chargement terminé');
    }
  };

  // Nouvelle fonction pour sauvegarder le plan
  const saveSelectedPlan = async (plan: Plan) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          selected_plan: plan.type,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      if (plan.type === 'free') {
        const { error: subscriptionError } = await (supabase as any)
          .from('subscriptions' as any)
          .upsert({
            user_id: user.id,
            plan_id: plan.id,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,plan_id'
          });

        if (subscriptionError) throw subscriptionError;
      }

      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde plan:', error);
      return false;
    }
  };

  // Mettre à jour handleContinue
  const handleContinue = async () => {
    if (selectedPlan) {
      setLoading(true);
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      if (selectedPlanData) {
        const success = await saveSelectedPlan(selectedPlanData);
        if (success) {
          onSuccess?.(selectedPlanData);
        }
      }
      setLoading(false);
    }
  };

  // Gestion du drag vertical
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
    if (Math.abs(info.offset.x) > 100) {
      setDragY(0);
      return;
    }
    if (info.offset.y > 250 && info.velocity.y > 500) { // Augmenté de 200 à 250
      onClose();
    } else {
      setDragY(0);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      draggable
      aria-label="Sélection du plan d'abonnement"
      className="max-w-2xl"
    >
      {/* Header compact WhatsApp */}
      <div className="flex flex-col items-center justify-center pt-4 pb-2 bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white rounded-t-xl">
        <ThematicLogo theme="plan" size={40} className="mb-2" />
        <h2 className="text-lg font-bold mb-1">Choisissez votre Plan</h2>
        <p className="text-xs opacity-90">Sélectionnez l'abonnement adapté</p>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white/80 hover:text-white hover:bg-white/20 focus:ring-white/50"
          aria-label="Fermer la modal"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Contenu compact SANS SCROLL */}
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-[hsl(var(--card))] dark:to-[hsl(var(--card))]">
        <div className="p-3">
          {/* Cartes des plans ultra-compactes */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {plans.map((plan) => {
              let features: any = {};
              try {
                features = typeof plan.features === 'string'
                  ? JSON.parse(plan.features)
                  : plan.features || {};
              } catch {
                features = {};
              }
              const isSelected = selectedPlan === plan.id;
              const isPopular = plan.type === 'monthly';
              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "relative transition-all duration-200 cursor-pointer",
                    isSelected ? "ring-2 ring-primary shadow-lg scale-105" : "hover:shadow-md",
                    getPlanColor(plan.type)
                  )}
                  onClick={() => setSelectedPlan(plan.id)}
                  tabIndex={0}
                  aria-label={`Sélectionner le plan ${plan.name}`}
                  role="button"
                >
                  <CardHeader className="pb-2">
                    {isPopular && (
                      <Badge
                        className="absolute -top-1 -right-1 bg-gradient-to-r from-[#128C7E] to-[#075E54] text-xs"
                        variant="secondary"
                      >
                        ⭐
                      </Badge>
                    )}
                    <CardTitle className="text-sm font-bold">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="mb-2">
                      <p className="text-lg font-bold">
                        {plan.price === 0 ? 'Gratuit' : `${plan.price.toLocaleString('fr-FR')}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {plan.type === 'free' ? '1 semaine' : plan.type === 'monthly' ? '/mois' : '/an'}
                      </p>
                    </div>
                    <ul className="space-y-1 text-xs">
                      <li>• {features.max_organizations || 1} org</li>
                      <li>• {features.max_garages_per_org || 1} garage</li>
                      <li>• {features.max_users_per_org || 5} users</li>
                      <li>• Support {features.support_level || 'email'}</li>
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {/* Boutons d'action compacts */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-7 text-xs"
            >
              Annuler
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedPlan || loading}
              className="flex-1 h-7 text-xs bg-gradient-to-r from-[#128C7E] to-[#075E54] hover:from-[#0F7B6B] hover:to-[#064A42] text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-white mr-1" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Continuer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </FormModal>
  );
};

type FeatureKey =
  | 'max_organizations'
  | 'max_garages_per_org'
  | 'max_users_per_org'
  | 'max_vehicles_per_garage'
  | 'support_level'
  | 'analytics';

// Labels pour les features
const FEATURE_LABELS: Record<FeatureKey, (value: any) => string> = {
  max_organizations: (value) => `${value} Organisation(s)`,
  max_garages_per_org: (value) => `${value} Garage(s) par org`,
  max_users_per_org: (value) => `${value} Utilisateur(s)`,
  max_vehicles_per_garage: (value) => `Jusqu'à ${value} Véhicules`,
  support_level: (value) => `Support ${value}`,
  analytics: (value) => (value ? 'Analytics Avancées' : 'Analytics Basiques')
};

const formatFeatures = (features: any): string[] => {
  try {
    const obj = typeof features === 'string' ? JSON.parse(features) : features;
    if (!obj || typeof obj !== 'object') return [];
    return Object.entries(obj).map(([key, value]) => {
      const formatter = FEATURE_LABELS[key as FeatureKey];
      return formatter ? formatter(value) : `${key}: ${String(value)}`;
    });
  } catch (error) {
    console.error('Erreur parsing features:', error);
    return [];
  }
};

const getGradientByType = (type: string): string => {
  switch (type) {
    case 'free':
      return 'from-gray-500 to-gray-600';
    case 'monthly':
      return 'from-blue-500 to-blue-600';
    default:
      return 'from-purple-500 to-purple-600';
  }
};

const getColorByType = (type: string): string => {
  switch (type) {
    case 'free':
      return 'gray';
    case 'monthly':
      return 'blue';
    default:
      return 'purple';
  }
};

const calculateSavings = (plan: Plan): number => {
  if (plan.type === 'annual') {
    return 20; // 20% d'économie pour le plan annuel
  }
  return 0;
};

// Composant réutilisable pour afficher une feature
const FeatureItem = ({ text }: { text: string }) => (
  <li className="flex items-center text-xs">
    <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
    <span className="text-gray-700">{text}</span>
  </li>
);

// Fonction utilitaire pour obtenir la couleur du plan
const getPlanColor = (type: string): string => {
  switch (type) {
    case 'free':
      return 'bg-gray-50 hover:bg-gray-100';
    case 'monthly':
      return 'bg-blue-50 hover:bg-blue-100';
    default:
      return 'bg-purple-50 hover:bg-purple-100';
  }
};
