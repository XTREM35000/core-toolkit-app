import React from 'react';
import { AppSidebar } from './Sidebar';
import Header from './Header';
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onNavigate?: (key: string) => void;
}

export const DashboardLayout = ({ children, onNavigate }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar onNavigate={onNavigate} />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6 bg-gray-50/30 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;