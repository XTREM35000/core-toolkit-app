import React from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { useBreakpointDragConstraints } from '@/hooks/useResponsiveDragConstraints';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  showSuperAdminIndicator?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  headerLogo?: React.ReactNode;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  showSuperAdminIndicator = false,
  size = 'lg',
  className = '',
  headerLogo
}) => {
  const [dragY, setDragY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  // Hook responsive pour les limites de drag
  // const dragConstraints = useBreakpointDragConstraints();

  // Valeurs de test fixes pour déboguer
  const testConstraints = { top: -100, bottom: 300 };

  // Gestion du drag vertical
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    // Empêcher le drag horizontal excessif
    if (Math.abs(info.offset.x) > 50) {
      return;
    }
    // onSelectPlan: (plan: PlanDetails) => Promise<void>;
    // Limiter le drag vertical
    const maxDragY = 100;
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
    if (info.offset.y > 200 && info.velocity.y > 500) {
      onClose();
    } else {
      // Reset position avec animation fluide
      setDragY(0);
    }
  };

  // Gestion de la touche Escape
  React.useEffect(() => {
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

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 pt-10 sm:pt-16"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Overlay avec backdrop blur */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Modal - Positionné correctement avec limites de drag */}
        <motion.div
          initial={{
            scale: 0.98,
            opacity: 0,
            y: 20
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0
          }}
          exit={{
            scale: 0.98,
            opacity: 0,
            y: 20
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.3
          }}
          // Drag avec limites responsives - RESTRICTIF sur l'axe horizontal
          drag="y"
          dragConstraints={{ top: -150, bottom: 100 }}
          dragElastic={0.1}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 800, bounceDamping: 30 }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onWheel={(e) => {
            e.stopPropagation();
            // Scroll wheel moves modal up/down slightly when not over the scrollable content
            const nextY = dragY - Math.sign(e.deltaY) * 20;
            const clamped = Math.max(-150, Math.min(100, nextY));
            setDragY(clamped);
          }}
          className={cn(
            "relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing",
            sizeClasses[size],
            className
          )}
          style={{
            y: dragY
          }}
        >
          {/* Handle de drag */}
          <div className="flex justify-center pt-3 pb-2 bg-white">
            <div className="w-12 h-1.5 rounded-full bg-[#128C7E]/30" />
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white">
            {/* Indicateur Super Admin */}
            {showSuperAdminIndicator && (
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold z-10">
                <Crown className="w-4 h-4" />
                Super Admin
              </div>
            )}

            <div className="p-6 text-center">
              {headerLogo && (
                <div className="flex justify-center mb-3">
                  {headerLogo}
                </div>
              )}
              {title && (
                <h2 className="text-2xl font-bold mb-2 text-white">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm opacity-90 text-white/90">
                  {description}
                </p>
              )}
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

          {/* Contenu avec zone scroll augmentée */}
          <div className="bg-gradient-to-b from-white to-gray-50 dark:from-[hsl(var(--card))] dark:to-[hsl(var(--card))]">
            <div className="p-6 max-h-[calc(100vh-180px)] overflow-y-auto">
              {children}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
