import { useEffect } from 'react';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { DeveloperModal } from '../workflow/DeveloperModal';
import { SuperAdminModal as SuperAdminCreationModal } from '../workflow/SuperAdminModal';
import { AdminCreationModal } from '../workflow/AdminCreationModal';
import { supabase } from '@/integrations/supabase/client';
import { AuthModal } from '../auth/AuthModal';
import { PlanSelectionModal } from '../workflow/PlanSelectionModal';
import { SMSValidationModal } from '../workflow/SmsValidationModal';
import { useState } from 'react';

export const AppInitialization = () => {
  const { status, update, check } = useAppInitialization();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  // For simulation we can prefill an admin email here; in real flow this should come
  // from the created admin payload. Using a fixed email enables OTP simulation and
  // avoids calling the Edge Function (CORS failures) during local testing.
  const [smsTenantAdmin, setSmsTenantAdmin] = useState<{ email?: string } | null>({ email: 'admin@automaster.ci' });

  useEffect(() => {
    if (user) {
      check();
    }
  }, [user]);

  // On mount, verify whether a super_admin already exists to avoid showing the SuperAdminModal unnecessarily
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: hasSuperAdminData, error } = await (supabase as any).rpc('has_super_admin');
        if (!mounted) return;
        if (error) return;
        const hasSuperAdmin = Array.isArray(hasSuperAdminData) ? hasSuperAdminData[0] : hasSuperAdminData;
        if (hasSuperAdmin === true) {
          // Ensure state reflects that a super admin exists so the modal won't show
          update({ hasSuperAdmin: true, showSuperAdminModal: false });
        }
      } catch (e) {
        // ignore RPC errors here; fallback to normal flow
      }
    })();
    return () => { mounted = false; };
  }, []);

  // SUPPRIMER tout l'affichage de chargement - retourner null pendant l'initialisation
  if (status.step === 'checking') {
    return null; // Plus d'écran de chargement visible
  }

  return (
    <>
      {status.showDevModal && (
        <DeveloperModal
          isOpen={status.showDevModal}
          onClose={() => setTimeout(() => update({
            showDevModal: false,
            showSuperAdminModal: true
          }), 0)}
        />
      )}

      {status.showSuperAdminModal && (
        <SuperAdminCreationModal
          isOpen={status.showSuperAdminModal}
          onClose={() => update({ showSuperAdminModal: false })}
          onSuccess={async () => {
            update({
              hasSuperAdmin: true,
              showSuperAdminModal: false,
              showAdminModal: true
            });

            // Prefer a targeted profile refresh when the user is signed in,
            // otherwise fallback to the global check after a small delay.
            if (user) {
              try {
                await refreshProfile();
              } catch (e) {
                // If refresh fails, fallback to check()
                setTimeout(() => check(), 800);
              }
            } else {
              setTimeout(() => {
                check();
              }, 800);
            }
          }}
        />
      )}

      {status.showAdminModal && (
        <AdminCreationModal
          isOpen={status.showAdminModal}
          onClose={() => update({ showAdminModal: false })}
          onSuccess={async () => {
            update({
              hasAdmin: true,
              showAdminModal: false,
              showAuthModal: true
            });

            // Refresh profile if possible, otherwise fallback to check
            if (user) {
              try {
                await refreshProfile();
              } catch (e) {
                setTimeout(() => check(), 800);
              }
            } else {
              setTimeout(() => check(), 800);
            }

            // Close modal and open plan selection next
            toast({ title: 'Succès', description: 'Administrateur créé. Veuillez choisir un plan.', });
            setTimeout(() => {
              setShowPlanModal(true);
            }, 300);
          }}
        />
      )}

      <PlanSelectionModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onSuccess={(selectedPlan) => {
          setShowPlanModal(false);
          // After plan selected, open SMS validation
          setShowSmsModal(true);
        }}
      />

      <SMSValidationModal
        isOpen={showSmsModal}
        onClose={() => setShowSmsModal(false)}
        tenantAdminData={smsTenantAdmin || undefined}
        onSuccess={() => {
          setShowSmsModal(false);
          // In simulation we want to proceed to the auth flow (registration/login)
          // instead of navigating to /admin. Use update() to show the AuthModal.
          update({ showAuthModal: true });
        }}
      />

      {status.showAuthModal && !user && (
        <AuthModal
          open={true}
          onClose={() => { }}
        />
      )}
    </>
  );
};