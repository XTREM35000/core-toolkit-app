import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showClose?: boolean;
  className?: string;
}

export const BaseModal = ({ 
  open, 
  onClose, 
  title, 
  children, 
  showClose = true,
  className = ''
}: BaseModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`glass border-border/50 ${className}`}>
        {showClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        {title && (
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
