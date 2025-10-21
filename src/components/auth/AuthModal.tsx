import { useState } from 'react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import AnimatedLogo from '@/components/AnimatedLogo';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginTab } from './LoginTab';
import { SignupTab } from './SignupTab';
import { LogIn } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <WhatsAppModal 
      isOpen={open} 
      onClose={onClose}
      size="lg"
      className="rounded-2xl"
      allowCloseOnOutsideClick={true}
      hideHeader={true}
    >
      <ModalHeader
        title="Authentification"
        subtitle="Connectez-vous ou créez votre compte"
        headerLogo={<AnimatedLogo size={56} mainIcon={LogIn} mainColor="text-white" secondaryColor="text-blue-300" waterDrop />}
        badge={
          <div className="flex items-center gap-2 bg-blue-500 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold">
            <LogIn className="w-4 h-4" />
            Accès Plateforme
          </div>
        }
        onClose={onClose}
      />

      <div className="p-6 bg-gradient-to-b from-white to-gray-50 dark:from-[hsl(var(--card))] dark:to-[hsl(var(--card))] rounded-b-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="rounded-lg py-2.5">Connexion</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg py-2.5">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-0">
            <LoginTab />
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-0">
            <SignupTab />
          </TabsContent>
        </Tabs>
      </div>
    </WhatsAppModal>
  );
};