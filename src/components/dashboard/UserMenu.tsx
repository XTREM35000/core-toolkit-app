import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export const UserMenu = () => {
  const { profile } = useAuth();

  const initials = profile?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || profile?.email?.[0].toUpperCase() || 'U';

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-2 cursor-pointer">
          <Avatar>
            <AvatarFallback>
              {initials}
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
