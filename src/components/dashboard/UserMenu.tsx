import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const UserMenu = () => {
  const { profile } = useAuth();

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const parts = name.split(' ');
      return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.[0]?.toUpperCase() || 'U';
  };

  // Safe access to avatar_url
  const avatarUrl = (profile as any)?.avatar_url;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-2 cursor-pointer">
          <Avatar>
            {avatarUrl && (
              <AvatarImage src={avatarUrl} alt={profile?.full_name || profile?.email || 'User'} />
            )}
            <AvatarFallback className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white">
              {getInitials(profile?.full_name, profile?.email)}
            </AvatarFallback>
          </Avatar>
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
