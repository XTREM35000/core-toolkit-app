import React from 'react';
import AdminCreationModal from './AdminCreationModal';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
}

const SupplierModal = ({ isOpen, onClose, onSaved }: Props) => {
  return (
    <AdminCreationModal isOpen={!!isOpen} onClose={onClose || (() => {})} initialRole={'vendeur' as any} onSuccess={onSaved} />
  );
};

export default SupplierModal;
