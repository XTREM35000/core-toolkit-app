import React from 'react';

// Re-export common modal implementations
export { FormModal } from './FormModal';
import { FormModal as _FormModal } from './FormModal';
export { BaseModal } from './base-modal';
export * from './dialog-modal';
export * from './modal-wrapper';
export * from './draggable-modal';
export * from './draggable-modal-wrapper';
export * from './dialog';
export * from './whatsapp-modal';

// Provide a compatibility `Modal` named export that many components import.
// This wrapper maps `open` / `onOpenChange` props to FormModal's `isOpen` / `onClose`.
export const Modal: React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  draggable?: boolean;
  className?: string;
}> = ({ open, onOpenChange, title, description, children, size = 'md', draggable = false, className }) => {
  return (
    <_FormModal
      isOpen={!!open}
      onClose={() => onOpenChange && onOpenChange(false)}
      title={title}
      description={description}
      size={size as any}
      draggable={!!draggable}
      className={className}
    >
      {children}
    </_FormModal>
  );
};

export default Modal;
