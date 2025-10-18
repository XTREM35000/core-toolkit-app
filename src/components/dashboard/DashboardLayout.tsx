import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export const DashboardLayout = ({ children, onNavigate }: { children: React.ReactNode, onNavigate?: (k: string) => void }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar onNavigate={onNavigate} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
