import React from 'react';
import { WorkflowProgressBar } from '@/app/components/ui/WorkflowProgressBar';
import { ThematicLogo } from '@/components/ui/ThematicLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'role', title: 'Rôle', description: 'Choisissez votre rôle' },
  { id: 'company', title: 'Organisation', description: 'Informations sur l’organisation' },
  { id: 'profile', title: 'Profil', description: 'Détails de votre compte' },
  { id: 'finish', title: 'Terminer', description: 'Finaliser l’onboarding' }
];

export default function Onboarding() {
  const [current, setCurrent] = React.useState('role');
  const [completed, setCompleted] = React.useState<string[]>([]);
  const [openModal, setOpenModal] = React.useState(false);

  const next = () => {
    const idx = steps.findIndex(s => s.id === current);
    if (idx >= 0 && idx < steps.length - 1) {
      setCompleted(prev => Array.from(new Set([...prev, current])));
      setCurrent(steps[idx + 1].id);
    }
  };

  return (
    <div className={cn('min-h-screen p-6 bg-background text-foreground')}>
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <ThematicLogo theme="signup" showTitle title="Onboarding" subtitle="Exemple d’intégration" />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => setOpenModal(true)} variant="ghost">Aide</Button>
          </div>
        </header>

        <main className="space-y-6">
          <WorkflowProgressBar
            steps={steps}
            currentStep={current}
            completedSteps={completed}
            onStepClick={(id) => setCurrent(id)}
            showProgress
          />

          <section className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Étape: {current}</h3>
            <p className="text-sm text-muted-foreground mb-4">{steps.find(s => s.id === current)?.description}</p>

            <div className="flex items-center gap-3">
              <Button onClick={next}>Suivant</Button>
              <Button variant="outline" onClick={() => setCompleted(prev => [...prev, current])}>Marquer comme terminée</Button>
            </div>
          </section>
        </main>
      </div>

      <WhatsAppModal isOpen={openModal} onClose={() => setOpenModal(false)} title="Aide" description="Assistance onboarding">
        <></>
      </WhatsAppModal>
    </div>
  );
}
