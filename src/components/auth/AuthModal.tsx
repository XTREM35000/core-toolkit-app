import { useState } from 'react';
import { FormModal } from '@/components/ui/FormModal';
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
    <FormModal isOpen={open} onClose={onClose} className="max-w-md">
      <div className="space-y-4 p-6">
        {/* Compact header so the form fields fit fully inside the modal */}
        <div className="flex items-center gap-4">
          <AnimatedLogo size={32} mainColor="text-emerald-600" secondaryColor="text-emerald-300" />
          <div>
            <h2 className="text-xl font-bold">Bienvenue</h2>
            <p className="text-sm text-muted-foreground">Connectez-vous ou créez votre compte</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <LoginTab />
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <SignupTab />
          </TabsContent>
        </Tabs>
      </div>
    </FormModal>
  );
};
