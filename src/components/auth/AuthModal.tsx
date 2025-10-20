import { useState } from 'react';
import { FormModal } from '@/components/ui/FormModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginTab } from './LoginTab';
import { SignupTab } from './SignupTab';
import { AnimatedLogo } from '@/components/AnimatedLogo';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <FormModal isOpen={open} onClose={onClose} className="max-w-md">
      <div className="space-y-6 p-6">
        {/* Header avec AnimatedLogo */}
        <div className="flex items-center gap-4">
          <AnimatedLogo size={32} />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">Bienvenue</h2>
            <p className="text-sm text-muted-foreground">
              Connectez-vous ou créez votre compte
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" role="tablist">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger 
              value="login"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#128C7E] data-[state=active]:to-[#075E54] data-[state=active]:text-white"
            >
              Connexion
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#128C7E] data-[state=active]:to-[#075E54] data-[state=active]:text-white"
            >
              Inscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6" role="tabpanel">
            <LoginTab onClose={onClose} />
          </TabsContent>

          <TabsContent value="signup" className="mt-6" role="tabpanel">
            <SignupTab onClose={onClose} />
          </TabsContent>
        </Tabs>
      </div>
    </FormModal>
  );
};
