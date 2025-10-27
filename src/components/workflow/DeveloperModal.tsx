import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Globe, Code } from 'lucide-react';
import { ModalHeader } from './shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal = ({ isOpen, onClose }: DeveloperModalProps) => {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    let mounted = true;
    if (!isOpen) return;
    const timer = setInterval(() => {
      if (!mounted) return;
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { mounted = false; clearInterval(timer); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="bg-white rounded-t-3xl shadow-2xl w-full max-w-3xl mx-auto overflow-visible">
        <ModalHeader
          title="Bienvenue sur MultiFarm SaaS Manager Pro"
          subtitle="Plateforme de gestion piscicole et hélicicole"
          icon={Code}
          onClose={onClose}
        />
        <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] rounded-t-2xl text-white shadow-2xl">
          <div className="flex flex-col items-center justify-center pt-6 pb-4">
            <AnimatedLogo size={56} mainColor="text-white" secondaryColor="text-green-300" waterDrop className="mb-2" />
            <h2 className="text-2xl font-bold mb-1">Bienvenue sur MultiFarm SaaS Manager Pro</h2>
            <p className="text-xs opacity-90 mb-2">Gestion complète pour élevages piscicoles et hélicicoles</p>
          </div>
        </div>
        <div className="space-y-4 p-6 bg-white dark:bg-[hsl(var(--card))] rounded-b-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Business overview: Aquaculture */}
            <div className="glass p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Pisciculture (Aquaculture)</h3>
              <p className="text-sm text-muted-foreground">Gestion des bassins, alimentation, suivi de croissance, inventaires, alertes sanitaires et rapports.</p>
              <img src="/images/img/photo-stock.avif" alt="Pisciculture" className="w-full h-28 object-cover rounded-md mt-2 shadow-sm" />
            </div>

            {/* Business overview: Heliciculture */}
            <div className="glass p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Héliciculture (Élevage d'escargots)</h3>
              <p className="text-sm text-muted-foreground">Suivi des lots, reproduction, alimentation, hygiene des parcs et gestion commerciale adaptée.</p>
              <img src="/images/img/photo-dashboard.avif" alt="Héliciculture" className="w-full h-28 object-cover rounded-md mt-2 shadow-sm" />
            </div>
          </div>

          <div className="glass p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-lg">A propos du développeur</h3>
            <p className="text-sm text-muted-foreground">
              Thierry Gogo — Développeur FullStack
            </p>
            <p className="text-sm text-muted-foreground">01 bp 5341 Abidjan 01 • Abidjan Riviera 3</p>
            <p className="text-sm text-muted-foreground">Téléphones: +225 075896656 / 0103644527</p>
            <p className="text-sm text-muted-foreground">Contact technique et accompagnement sur mesure pour vos projets piscicoles et hélicicoles.</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <a href="tel:+225075896656"><Github className="h-5 w-5" /></a>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><Linkedin className="h-5 w-5" /></a>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <a href="/" target="_blank" rel="noreferrer"><Globe className="h-5 w-5" /></a>
              </Button>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Fermeture automatique dans <span className="font-bold text-green-600">{countdown}s</span></p>
              <Button
                onClick={onClose}
                className="mt-2 bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white font-semibold rounded-lg"
              >
                Commencer maintenant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
