import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const UserMenu = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('Sign out failed', err);
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 focus:outline-none">
            <Avatar>
              {(profile as any)?.avatar_url ? (
                <AvatarImage src={(profile as any).avatar_url} alt={profile?.full_name || profile?.email || 'User'} />
              ) : (
                <AvatarFallback>{(profile?.full_name || profile?.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-56">
          <div className="px-4 py-3 border-b">
            <div className="text-sm font-medium">{profile?.full_name || profile?.email}</div>
            <div className="text-xs text-muted-foreground">{profile?.email}</div>
          </div>
          <DropdownMenuItem onSelect={() => navigate('/profile')}>Profile</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/settings')}>Settings</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/subscriptions')}>Abonnements</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/admin')}>Admin Dashboard</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/developer')}>Developer Tools</DropdownMenuItem>
          <div className="border-t" />
          <DropdownMenuItem onSelect={handleSignOut}>Se déconnecter</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
