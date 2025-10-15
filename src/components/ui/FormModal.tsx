import React from 'react';
import { WhatsAppModal } from './whatsapp-modal';
import { BaseModal as UiBaseModal } from './base-modal';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  draggable?: boolean;
  // drag options forwarded to WhatsAppModal
  dragConstraints?: { top?: number; bottom?: number };
  className?: string;
}

export const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, title, description, children, size = 'md', draggable = false, dragConstraints, className }) => {
  // Use WhatsAppModal for the special look & draggable handling, but fall back to UiBaseModal for simpler cases
  if (draggable) {
    return (
      <WhatsAppModal isOpen={isOpen} onClose={onClose} title={title} description={description} size={size} className={className}>
        {children}
      </WhatsAppModal>
    );
  }

  return (
    <UiBaseModal isOpen={isOpen} onClose={onClose} title={title || ''} className={className}>
      {children}
    </UiBaseModal>
  );
};

export default FormModal;
