import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/avatar';

export const UserMenu = () => {
  const { profile } = useAuth();

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-2 cursor-pointer">
          <Avatar src={profile?.avatar_url || ''} alt={profile?.full_name || profile?.email || 'User'} />
          <div className="hidden sm:block text-sm">
            <div className="font-medium">{profile?.full_name || profile?.email}</div>
            <div className="text-xs text-muted-foreground">{(profile?.roles || []).join(', ')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
