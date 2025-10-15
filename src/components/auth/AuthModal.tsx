import { useState } from 'react';
import { BaseModal } from '../modals/BaseModal';
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
    <BaseModal open={open} onClose={onClose} className="max-w-md">
      <div className="space-y-6 p-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <LogIn className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Bienvenue</h2>
          <p className="text-sm text-muted-foreground">
            Connectez-vous ou créez votre compte
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-6">
            <LoginTab />
          </TabsContent>
          
          <TabsContent value="signup" className="mt-6">
            <SignupTab />
          </TabsContent>
        </Tabs>
      </div>
    </BaseModal>
  );
};
