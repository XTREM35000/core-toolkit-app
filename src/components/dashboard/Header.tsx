import React from 'react';
import { UserMenu } from './UserMenu';

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold">AquaManager Pro</h1>
        <nav className="hidden md:flex gap-3 text-sm text-muted-foreground">
          <a href="/admin" className="px-2 py-1 rounded hover:bg-gray-100">Dashboard</a>
          <a href="#" className="px-2 py-1 rounded hover:bg-gray-100">Rapports</a>
          <a href="#" className="px-2 py-1 rounded hover:bg-gray-100">Paramètres</a>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
