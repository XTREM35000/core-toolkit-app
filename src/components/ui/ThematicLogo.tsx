import {
  Car,
  Wrench,
  Settings,
  User,
  Building,
  Crown,
  Shield,
  CreditCard,
  UserPlus,
  LucideIcon
} from 'lucide-react';
import AnimatedLogo from '@/components/AnimatedLogo';

// Thèmes de logos selon le contexte
export const LOGO_THEMES = {
  // Super Admin - Administrateur système
  superAdmin: {
    mainIcon: Shield,
    secondaryIcon: Settings,
    mainColor: "text-red-500",
    secondaryColor: "text-yellow-400",
    animation: "idle" as const
  },

  // Admin - Responsable de garage
  admin: {
    mainIcon: User,
    secondaryIcon: Wrench,
    mainColor: "text-blue-600",
    secondaryColor: "text-orange-500",
    animation: "idle" as const
  },

  // Garage - Atelier automobile
  garage: {
    mainIcon: Car,
    secondaryIcon: Wrench,
    mainColor: "text-[#128C7E]",
    secondaryColor: "text-yellow-300",
    animation: "repair" as const
  },

  // Organization - Entreprise
  organization: {
    mainIcon: Building,
    secondaryIcon: User,
    mainColor: "text-purple-600",
    secondaryColor: "text-blue-400",
    animation: "idle" as const
  },

  // Signup - Inscription
  signup: {
    mainIcon: UserPlus,
    secondaryIcon: Crown,
    mainColor: "text-green-600",
    secondaryColor: "text-yellow-500",
    animation: "idle" as const
  },

  // Signin - Connexion
  signin: {
    mainIcon: User,
    secondaryIcon: Shield,
    mainColor: "text-blue-600",
    secondaryColor: "text-green-500",
    animation: "idle" as const
  },

  // Plan - Abonnement
  plan: {
    mainIcon: Crown,
    secondaryIcon: CreditCard,
    mainColor: "text-yellow-600",
    secondaryColor: "text-green-500",
    animation: "idle" as const
  },

  // Default - AutoMaster général
  default: {
    mainIcon: Car,
    secondaryIcon: Wrench,
    mainColor: "text-[#128C7E]",
    secondaryColor: "text-yellow-300",
    animation: "idle" as const
  }
};

interface ThematicLogoProps {
  theme: keyof typeof LOGO_THEMES;
  size?: number;
  className?: string;
  showTitle?: boolean;
  title?: string;
  subtitle?: string;
}

export const ThematicLogo = ({
  theme,
  size = 48,
  className = "",
  showTitle = false,
  title,
  subtitle
}: ThematicLogoProps) => {
  const themeConfig = LOGO_THEMES[theme] || LOGO_THEMES.default;

  if (showTitle) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <AnimatedLogo
          size={size}
          mainIcon={themeConfig.mainIcon}
          secondaryIcon={themeConfig.secondaryIcon}
          mainColor={themeConfig.mainColor}
          secondaryColor={themeConfig.secondaryColor}
          animation={themeConfig.animation}
        />
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-gray-900">
            {title || getDefaultTitle(theme)}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <AnimatedLogo
      size={size}
      mainIcon={themeConfig.mainIcon}
      secondaryIcon={themeConfig.secondaryIcon}
      mainColor={themeConfig.mainColor}
      secondaryColor={themeConfig.secondaryColor}
      animation={themeConfig.animation}
      className={className}
    />
  );
};

const getDefaultTitle = (theme: keyof typeof LOGO_THEMES): string => {
  const titles = {
    superAdmin: "Super Administrateur",
    admin: "Administrateur",
    garage: "Gestion Garage",
    organization: "Organisation",
    signup: "Inscription",
    signin: "Connexion",
    plan: "Abonnement",
    default: "AutoMaster Suite"
  };

  return titles[theme] || titles.default;
};

export default ThematicLogo;
