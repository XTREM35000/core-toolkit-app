import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DraggableModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  allowCloseOnOutsideClick?: boolean;
  allowDragToClose?: boolean;
  dragConstraints?: { top: number; bottom: number };
  className?: string;
  overlayClassName?: string;
  onDragStart?: () => void;
  onDrag?: (event: any, info: PanInfo) => void;
  onDragEnd?: (event: any, info: PanInfo) => void;
  onWheel?: (e: React.WheelEvent) => void;
  style?: React.CSSProperties;
}

export const DraggableModalWrapper = ({
  isOpen,
  onClose,
  children,
  allowCloseOnOutsideClick = false,
  allowDragToClose = true,
  dragConstraints = { top: -200, bottom: 300 },
  className = "",
  overlayClassName = "",
  onDragStart,
  onDrag,
  onDragEnd,
  onWheel,
  style
}: DraggableModalWrapperProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 pt-10 sm:pt-16",
          className
        )}
        onClick={allowCloseOnOutsideClick ? (e) => e.target === e.currentTarget && onClose() : undefined}
      >
        {/* Overlay avec backdrop blur */}
        <div className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm",
          overlayClassName
        )} />

        {/* Contenu du modal draggable */}
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
          // Drag avec limites configurables
          drag="y"
          dragConstraints={dragConstraints}
          dragElastic={0.1}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 800, bounceDamping: 30 }}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={(event, info) => {
            if (allowDragToClose && info.offset.y > 200 && info.velocity.y > 500) {
              onClose();
            } else {
              onDragEnd?.(event, info);
            }
          }}
          onWheel={onWheel}
          className={cn(
            "relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing max-w-lg"
          )}
          style={style}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

