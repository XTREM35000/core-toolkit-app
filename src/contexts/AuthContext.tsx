import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch roles from user_roles table (secure)
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles' as any)
        .select('role')
        .eq('user_id', userId) as any;

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
      }

      // Combine profile with roles
      setProfile({
        ...profileData,
        roles: rolesData?.map((r: any) => r.role) || []
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const isSuperAdmin = profile?.roles?.includes('super_admin') || false;
  const isAdmin = profile?.roles?.includes('admin') || isSuperAdmin;
  
  const hasPermission = (permission: string): boolean => {
    if (!profile) return false;
    if (isSuperAdmin) return true;
    
    const permissions = Array.isArray(profile.permissions) 
      ? profile.permissions 
      : [];
    
    return permissions.includes('*') || permissions.includes(permission);
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    isSuperAdmin,
    isAdmin,
    hasPermission,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
