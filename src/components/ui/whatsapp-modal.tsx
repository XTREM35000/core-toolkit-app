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
  // Optional overrides / event forwards for draggable behavior
  dragConstraints?: { top?: number; bottom?: number };
  onDragStart?: () => void;
  onDrag?: (event: any, info: PanInfo) => void;
  onDragEnd?: (event: any, info: PanInfo) => void;
  onWheel?: (e: React.WheelEvent) => void;
  style?: React.CSSProperties;
  hideHeader?: boolean; // If true, don't render the built-in header (allow custom header in children)
  allowCloseOnOutsideClick?: boolean;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  showSuperAdminIndicator = false,
  size = 'xl',
  className = '',
  headerLogo,
  dragConstraints,
  onDragStart: externalOnDragStart,
  onDrag: externalOnDrag,
  onDragEnd: externalOnDragEnd,
  onWheel: externalOnWheel,
  style: externalStyle,
  hideHeader = false,
  allowCloseOnOutsideClick = true
}) => {
  const [dragY, setDragY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  // Hook responsive pour les limites de drag
  // const responsiveConstraints = useBreakpointDragConstraints();

  // Valeurs de test / defaults
  const defaultConstraints = { top: -400, bottom: 400 };
  const effectiveConstraints = dragConstraints ? { top: dragConstraints.top ?? defaultConstraints.top, bottom: dragConstraints.bottom ?? defaultConstraints.bottom } : defaultConstraints;

  // Gestion du drag vertical
  const handleDragStart = () => {
    setIsDragging(true);
    externalOnDragStart?.();
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
    externalOnDrag?.(event, info);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    externalOnDragEnd?.(event, info);

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
    sm: 'max-w-sm h-[95vh]',
    md: 'max-w-md h-[95vh]',
    lg: 'max-w-2xl h-[95vh]',
    xl: 'max-w-4xl h-[95vh]',
    full: 'max-w-6xl h-[95vh]'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        onClick={allowCloseOnOutsideClick ? (e) => e.target === e.currentTarget && onClose() : undefined}
      >
        {/* Overlay avec backdrop blur */}
        <div className="absolute inset-0" style={{ background: 'var(--overlay-color)', backdropFilter: 'blur(6px)' }} />
        <motion.div
          initial={{ scale: 0.98, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag={true}
          dragConstraints={effectiveConstraints}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{ ...externalStyle, transform: `translateY(${dragY}px)` }}
          className={cn(
            'relative bg-white dark:bg-neutral-900 rounded-t-3xl shadow-xl w-full',
            'flex flex-col',
            size === 'sm' && 'max-w-sm h-[95vh]',
            size === 'md' && 'max-w-md h-[95vh]',
            size === 'lg' && 'max-w-2xl h-[95vh]',
            size === 'xl' && 'max-w-4xl h-[95vh]',
            size === 'full' && 'max-w-full h-[95vh]',
            'mx-4',
            className
          )}
          onWheel={externalOnWheel}
        >
          {/* Optionally render header (if the children already include a custom header, hideHeader can be true) */}
          {!hideHeader && (
            <>
              {/* Handle de drag */}
              <div className="flex justify-center pt-3 pb-2 rounded-t-2xl" style={{ background: 'var(--card-bg)' }}>
                <div className="w-12 h-1.5 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.06), var(--primary-start))' }} />
              </div>
              {/* Header */}
              <div className="text-white" style={{ background: 'linear-gradient(90deg, var(--primary-start), var(--primary-end))' }}>
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
              {/* Contenu — allow visible overflow so children can render outside and not block drag */}
              <div className="rounded-b-2xl flex-1 overflow-visible" style={{ background: 'var(--card-bg)' }}>
                <div className="p-6" style={{ color: 'var(--muted-foreground)' }}>
                  {children}
                </div>
              </div>
            </>
          )}
          {/* If hideHeader is true, just render children as-is (children expected to include header/handle) */}
          {hideHeader && <>{children}</>}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
