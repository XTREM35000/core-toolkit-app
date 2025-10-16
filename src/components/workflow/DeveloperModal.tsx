import { useEffect, useState } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Globe } from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal = ({ isOpen, onClose }: DeveloperModalProps) => {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  return (
    <WhatsAppModal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
      className="rounded-2xl"
      hideHeader={true}
    >
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] rounded-t-2xl text-white shadow-2xl">
        <div className="flex flex-col items-center justify-center pt-6 pb-4">
          <AnimatedLogo size={56} mainColor="text-white" secondaryColor="text-green-300" waterDrop className="mb-2" />
          <h2 className="text-2xl font-bold mb-1">Bienvenue sur cette Plateforme</h2>
          <p className="text-xs opacity-90 mb-2">Développée avec passion et expertise</p>
        </div>
      </div>
      <div className="space-y-3 p-6 bg-white dark:bg-[hsl(var(--card))] rounded-b-2xl">
        <div className="glass p-4 rounded-lg space-y-2">
          <h3 className="font-semibold text-lg">🚀 Technologies</h3>
          <p className="text-sm text-muted-foreground">React · TypeScript · Supabase · Tailwind CSS</p>
        </div>
        <div className="glass p-4 rounded-lg space-y-2">
          <h3 className="font-semibold text-lg">✨ Fonctionnalités</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Authentification multi-rôles sécurisée</li>
            <li>• Thèmes dynamiques (WhatsApp / Apple)</li>
            <li>• Architecture modulaire et évolutive</li>
          </ul>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full">
            <Github className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Linkedin className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Globe className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Fermeture automatique dans <span className="font-bold text-primary">{countdown}s</span>
            </p>
          </div>
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white font-semibold rounded-lg"
          >
            Commencer maintenant
          </Button>
        </div>
      </div>
    </WhatsAppModal>
  );
};
