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
      // Prefer calling RPCs which are SECURITY DEFINER and safe to call from client
      let hasSuperAdmin = false;
      let hasAdmin = false;

      try {
        const { data: superRes, error: superErr } = await supabase.rpc('has_super_admin') as any;
        if (!superErr && superRes !== undefined) {
          // supabase.rpc returns value in `data` for single scalar functions
          hasSuperAdmin = Boolean(superRes);
        }
      } catch (rpcErr) {
        // RPC might not exist yet — we'll fallback below
        // console.debug('has_super_admin rpc not available, falling back to selects');
      }

      try {
        const { data: adminRes, error: adminErr } = await supabase.rpc('exists_admin') as any;
        if (!adminErr && adminRes !== undefined) {
          hasAdmin = Boolean(adminRes);
        }
      } catch (rpcErr) {
        // RPC missing — fallback later
      }

      // Fallback: if RPCs weren't available or returned undefined, perform direct selects
      if (!hasSuperAdmin) {
        try {
          const { data: profilesWithSuper } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'super_admin')
            .limit(1) as any;
          hasSuperAdmin = (profilesWithSuper?.length ?? 0) > 0;
        } catch (err) {
          // ignore and keep false
        }

        if (!hasSuperAdmin) {
          try {
            const { data: superAdmin } = await supabase
              .from('user_roles' as any)
              .select('id')
              .eq('role', 'super_admin')
              .limit(1) as any;

            hasSuperAdmin = (superAdmin?.length ?? 0) > 0;
          } catch (err) {
            // ignore
          }
        }
      }

      if (!hasAdmin) {
        try {
          const { data: admin } = await supabase
            .from('user_roles' as any)
            .select('id')
            .eq('role', 'admin')
            .limit(1) as any;

          hasAdmin = (admin?.length ?? 0) > 0;
        } catch (err) {
          // ignore
        }
      }

      setStatus({
        step: 'checked',
        hasSuperAdmin,
        hasAdmin,
        // If there's no super admin, show the dev / super admin modal.
        // If there is a super admin but no admin, show the admin creation modal.
        showDevModal: !hasSuperAdmin,
        showSuperAdminModal: !hasSuperAdmin,
        showAdminModal: hasSuperAdmin && !hasAdmin,
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
