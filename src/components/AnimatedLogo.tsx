import { motion } from 'framer-motion';
import logoImage from '@/assets/logo-aquahelix.png';
import {
  Car,
  Wrench,
  Settings,
  Car as CarIcon,
  Cog,
  SprayCan,
  Hammer,
  Gauge,
  LucideIcon,
  User,
  UserCheck
} from 'lucide-react';

// Ajout d'animations spécifiques à l'automobile
const carAnimations = {
  idle: 'animate-bounce-slow',
  repair: 'animate-wrench-rotate',
  service: 'animate-spin-slow',
  paint: 'animate-spray',
  gauge: 'animate-pulse'
};

interface AnimatedLogoProps {
  size?: number;
  mainIcon?: LucideIcon;
  secondaryIcon?: LucideIcon;
  mainColor?: string;
  secondaryColor?: string;
  waterDrop?: boolean;
  animation?: keyof typeof carAnimations;
  className?: string;
  useImage?: boolean; // Nouveau prop pour utiliser l'image
  role?: 'super_admin' | 'admin' | 'default';
}

export function AnimatedLogo({
  size = 56, // 56px par défaut (w-14 h-14)
  mainIcon: MainIcon = Car,
  secondaryIcon: SecondaryIcon = Wrench,
  mainColor = 'text-white',
  secondaryColor = 'text-yellow-300',
  waterDrop = true,
  className = '',
  useImage = false, // Par défaut, utiliser les icônes lucide
  role = 'default'
}: AnimatedLogoProps) {

  // If a role is provided, override icons/colors to sensible defaults.
  if (role === 'super_admin') {
    // assign lucide components to variables typed as any to avoid TS JSX type issues
    MainIcon = (UserCheck as unknown) as LucideIcon;
    mainColor = 'text-white';
    secondaryColor = 'text-yellow-300';
    waterDrop = true;
  } else if (role === 'admin') {
    MainIcon = (User as unknown) as LucideIcon;
    mainColor = 'text-white';
    secondaryColor = 'text-green-300';
    waterDrop = true;
  }

  // Si useImage est true, afficher le logo animé avec l'image
  if (useImage) {
    return (
      <motion.div
        className={`relative ${className}`}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.img
          src={logoImage}
          alt="AquaHelix Manager Pro"
          style={{ width: size, height: size }}
          className="drop-shadow-lg"
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'radial-gradient(circle, rgba(18,140,126,0.4) 0%, transparent 70%)',
          }}
        />
      </motion.div>
    );
  }

  // Calculer les tailles relatives
  const mainIconSize = Math.round(size * 0.71); // ~10/14 de la taille totale
  const secondaryIconSize = Math.round(size * 0.43); // ~6/14 de la taille totale
  const pointSize = Math.round(size * 0.21); // ~3/14 de la taille totale

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Fond avec effet goutte d'eau */}
      {waterDrop && (
        <div className="absolute inset-0 bg-black/20 rounded-full blur-sm transform -translate-y-1"></div>
      )}

      {/* Icône principale avec animation */}
      <MainIcon 
        className={`
          ${mainColor} 
          absolute inset-0 m-auto 
          transform hover:scale-110 transition-transform
          ${MainIcon === Car ? 'animate-car-idle' : 'animate-pulse'}
        `}
        style={{ width: mainIconSize, height: mainIconSize }}
      />

      {/* Icône secondaire avec animation */}
      <SecondaryIcon 
        className={`
          ${secondaryColor} 
          absolute top-0 right-0
          ${SecondaryIcon === Wrench ? 'animate-wrench' : 'animate-spin-slow'}
        `}
        style={{ width: secondaryIconSize, height: secondaryIconSize }}
      />

      {/* Point lumineux */}
      <div 
        className="absolute -bottom-1 -right-1 bg-green-400 rounded-full animate-ping"
        style={{ width: pointSize, height: pointSize }}
      />
    </div>
  );
}

export default AnimatedLogo;