import React from 'react';
import { AppSidebar } from './Sidebar';
import Header from './Header';
import NavigationBreadcrumb from '@/components/NavigationBreadcrumb';
import PageHelpButton from '@/components/ui/PageHelpButton';
import { useLocation } from 'react-router-dom';
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onNavigate?: (key: string) => void;
}

export const DashboardLayout = ({ children, onNavigate }: DashboardLayoutProps) => {
  const location = useLocation();
  return (
    <SidebarProvider>
      <AppSidebar onNavigate={onNavigate} />
      <SidebarInset>
    <Header />
    <NavigationBreadcrumb />
        <main className="flex-1 p-6 bg-gray-50/30 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-end mb-4">
              <PageHelpButton pageId={location.pathname} />
            </div>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;