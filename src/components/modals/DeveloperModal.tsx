import { useEffect, useState } from 'react';
import { BaseModal } from './BaseModal';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Globe } from 'lucide-react';

interface DeveloperModalProps {
  onClose: () => void;
}

export const DeveloperModal = ({ onClose }: DeveloperModalProps) => {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
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
  }, [onClose]);

  return (
    <BaseModal open={true} onClose={onClose} showClose={false}>
      <div className="space-y-6 p-6">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-4xl font-bold text-primary-foreground shadow-glow">
            DEV
          </div>
          
          <div>
            <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Bienvenue sur cette Plateforme
            </h2>
            <p className="text-muted-foreground mt-2">
              Développée avec passion et expertise
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="glass p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-lg">🚀 Technologies</h3>
            <p className="text-sm text-muted-foreground">
              React · TypeScript · Supabase · Tailwind CSS
            </p>
          </div>

          <div className="glass p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-lg">✨ Fonctionnalités</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Authentification multi-rôles sécurisée</li>
              <li>• Thèmes dynamiques (WhatsApp / Apple)</li>
              <li>• Architecture modulaire et évolutive</li>
            </ul>
          </div>
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
            className="w-full gradient-primary text-primary-foreground font-semibold"
          >
            Commencer maintenant
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
