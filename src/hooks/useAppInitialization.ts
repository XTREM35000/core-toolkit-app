import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InitStatus } from '@/types';

export const useAppInitialization = () => {
  const [status, setStatus] = useState<InitStatus>({
    step: 'checking',
    hasSuperAdmin: false,
    hasAdmin: false,
    showDevModal: false,
    showSuperAdminModal: false,
    showAdminModal: false,
    showAuthModal: false,
  });

  const check = async () => {
    try {
      // Check for Super Admin
      const { data: superAdmin } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'super_admin')
        .limit(1);

      const hasSuperAdmin = (superAdmin?.length ?? 0) > 0;
      let hasAdmin = false;

      if (hasSuperAdmin) {
        // Check for Admin
        const { data: admin } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1);

        hasAdmin = (admin?.length ?? 0) > 0;
      }

      setStatus({
        step: 'checked',
        hasSuperAdmin,
        hasAdmin,
        showDevModal: !hasSuperAdmin,
        showSuperAdminModal: false,
        showAdminModal: false,
        showAuthModal: hasSuperAdmin && hasAdmin,
      });
    } catch (error) {
      console.error('Error checking initialization status:', error);
      setStatus(prev => ({ ...prev, step: 'checked' }));
    }
  };

  useEffect(() => {
    check();
  }, []);

  const update = (updates: Partial<InitStatus>) => {
    setStatus(prev => ({ ...prev, ...updates }));
  };

  return { status, update, check };
};
