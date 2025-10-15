import { useEffect } from 'react';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { useAuth } from '@/contexts/AuthContext';
import { DeveloperModal } from '../modals/DeveloperModal';
import { SuperAdminCreationModal } from '../modals/SuperAdminCreationModal';
import { AdminCreationModal } from '../modals/AdminCreationModal';
import { AuthModal } from '../auth/AuthModal';

export const AppInitialization = () => {
  const { status, update, check } = useAppInitialization();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      check();
    }
  }, [user]);

  if (status.step === 'checking') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Initialisation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {status.showDevModal && (
        <DeveloperModal 
          onClose={() => update({ 
            showDevModal: false, 
            showSuperAdminModal: true 
          })} 
        />
      )}

      {status.showSuperAdminModal && (
        <SuperAdminCreationModal 
          onSuccess={() => {
            update({ 
              hasSuperAdmin: true, 
              showSuperAdminModal: false,
              showAdminModal: true 
            });
            check();
          }} 
        />
      )}

      {status.showAdminModal && (
        <AdminCreationModal 
          onSuccess={() => {
            update({ 
              hasAdmin: true, 
              showAdminModal: false,
              showAuthModal: true 
            });
            check();
          }} 
        />
      )}

      {status.showAuthModal && !user && (
        <AuthModal 
          open={true} 
          onClose={() => {}} 
        />
      )}
    </>
  );
};
