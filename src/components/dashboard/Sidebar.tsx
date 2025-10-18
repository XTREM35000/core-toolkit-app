import React from 'react';

export const Sidebar = ({ onNavigate }: { onNavigate?: (key: string) => void }) => {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <div className="mb-6">
        <h2 className="font-semibold text-sm text-muted-foreground">Navigation</h2>
      </div>
      <ul className="space-y-2 text-sm">
        <li>
          <button onClick={() => onNavigate?.('profiles')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Profils</button>
        </li>
        <li>
          <button onClick={() => onNavigate?.('collaborators')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Collaborateurs</button>
        </li>
        <li>
          <button onClick={() => onNavigate?.('roles')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Rôles</button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
