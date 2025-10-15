import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  allowCloseOnOutsideClick?: boolean;
  className?: string;
  overlayClassName?: string;
}

export const ModalWrapper = ({
  isOpen,
  onClose,
  children,
  allowCloseOnOutsideClick = false,
  className = "",
  overlayClassName = ""
}: ModalWrapperProps) => {
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

        {/* Contenu du modal */}
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
