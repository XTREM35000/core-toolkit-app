import { useEffect } from 'react';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { useAuth } from '@/contexts/AuthContext';
import { DeveloperModal } from '../workflow/DeveloperModal';
import { SuperAdminModal as SuperAdminCreationModal } from '../workflow/SuperAdminModal';
import { AdminCreationModal } from '../workflow/AdminCreationModal';
import { AuthModal } from '../auth/AuthModal';
import { FormModal } from '@/components/ui/FormModal';
import AnimatedLogo from '@/components/AnimatedLogo';

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
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <FormModal isOpen={true} onClose={() => { }} draggable className="max-w-md">
          <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] rounded-t-2xl text-white shadow-2xl">
            <div className="flex flex-col items-center justify-center pt-6 pb-4">
              <AnimatedLogo size={56} mainColor="text-white" secondaryColor="text-green-300" waterDrop className="mb-2" />
              <h2 className="text-xl font-bold mb-1">Initialisation de l'application</h2>
              <p className="text-xs opacity-90 mb-2">Veuillez patienter pendant la configuration...</p>
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mt-2" />
            </div>
          </div>
        </FormModal>
      </div>
    );
  }

  return (
    <>
      {status.showDevModal && (
        <DeveloperModal
          isOpen={status.showDevModal}
          onClose={() => update({
            showDevModal: false,
            showSuperAdminModal: true
          })}
        />
      )}

      {status.showSuperAdminModal && (
        <SuperAdminCreationModal
          isOpen={status.showSuperAdminModal}
          onClose={() => update({ showSuperAdminModal: false })}
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
          isOpen={status.showAdminModal}
          onClose={() => update({ showAdminModal: false })}
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
          onClose={() => { }}
        />
      )}
    </>
  );
};
