import { ReactNode } from 'react';
import { X, LucideIcon } from 'lucide-react';

interface ModalHeaderProps {
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  headerLogo?: ReactNode; // optional custom logo node (e.g. AnimatedLogo)
  badge?: ReactNode;
  onClose: () => void;
  headerGradient?: string;
  showClose?: boolean;
}

export const ModalHeader = ({ title, subtitle, icon: Icon, headerLogo, badge, onClose, headerGradient, showClose = true }: ModalHeaderProps) => {
  const gradient = headerGradient ?? 'from-[#128C7E] to-[#075E54]';
  return (
    <div className={`bg-gradient-to-r ${gradient} text-white rounded-t-2xl relative`}>
      {badge && (
        <div className="absolute top-3 right-3 z-10">
          {badge}
        </div>
      )}

      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
          {headerLogo ? headerLogo : (Icon ? <Icon className="h-8 w-8 text-white" /> : null)}
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-sm opacity-90">{subtitle}</p>
      </div>

      {showClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 text-white/80 hover:text-white hover:bg-white/20"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
