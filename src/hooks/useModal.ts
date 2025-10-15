import { useState, ReactNode } from 'react';

export const useModal = () => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = (newContent: ReactNode) => {
    setContent(newContent);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => setContent(null), 300);
  };

  return {
    open,
    content,
    openModal,
    closeModal,
  };
};
