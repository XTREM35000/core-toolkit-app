import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Shield, 
  Settings, 
  Fish, 
  Shell, 
  BarChart3, 
  FileText, 
  HelpCircle,
  AlertCircle,
  Beef,
  Building,
  Activity,
  ShoppingCart,
  CreditCard
} from "lucide-react";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

export const AppSidebar = ({ onNavigate }: { onNavigate?: (key: string) => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSuperAdmin, isAdmin, profile } = useAuth();
  const { state } = useSidebar();

  const navItems = [
    { path: "/admin", label: "Tableau de Bord", icon: LayoutDashboard, admin: false },
    { path: "/activities", label: "Activité", icon: Activity, admin: false },

    // Aquaculture / Production
    { path: "/bassins-piscicoles", label: "Bassins piscicoles", icon: Fish, admin: false },
    { path: "/cohortes-poissons", label: "Cohortes poissons", icon: Fish, admin: false },
    { path: "/cohortes-escargots", label: "Cohortes escargots", icon: Shell, admin: false },
    { path: "/parcs-helicicoles", label: "Parcs hélicicoles", icon: Building, admin: false },

    // Operations
    { path: "/stock-aliments", label: "Stock aliments", icon: Beef, admin: false },
    { path: "/conditions-environnement", label: "Conditions env.", icon: BarChart3, admin: false },

  // NAVIGATION (approvisionnement & ventes)
  { path: "/commandes", label: "Commandes Fournisseurs", icon: FileText, admin: false },
  { path: "/ventes", label: "Ventes Clients", icon: ShoppingCart, admin: false },
  { path: "/encaissements", label: "Encaissements", icon: CreditCard, admin: false },

    { path: "/alerts", label: "Alertes", icon: AlertCircle, admin: false },
    { path: "/analytics", label: "Analytiques", icon: BarChart3, admin: false },
    { path: "/reports", label: "Rapports", icon: FileText, admin: false },

  // Admin-only
    { path: "/farms", label: "Fermes", icon: Building, admin: true },
    { path: "/fournisseurs", label: "Fournisseurs", icon: FileText, admin: true },
    { path: "/clients", label: "Clients", icon: Users, admin: true },
    { path: "/profiles", label: "Gestion Profils", icon: Users, admin: true },
    { path: "/security", label: "Sécurité", icon: Shield, admin: true },

  // Removed global "Paramètres" entry per request
  ];

  const handleNavigation = (path: string, label: string) => {
    if (path.startsWith('/admin') && onNavigate) {
      const view = path.replace('/admin/', '') || 'dashboard';
      onNavigate(view);
    } else {
      navigate(path);
    }
  };

  const filteredNavItems = navItems.filter(item => 
    !item.admin || (item.admin && (isSuperAdmin || isAdmin))
  );

  const mainNavItems = filteredNavItems.filter(item => !item.admin);
  const adminNavItems = filteredNavItems.filter(item => item.admin);

  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-white to-gray-50/50">
      {/* Header */}
      <SidebarHeader className="p-6 border-b bg-gradient-to-r from-blue-50/80 to-white">
        <div className="flex items-center gap-3">
          <div className="cursor-pointer hover:scale-105 transition-transform">
            <AnimatedLogo size={state === "collapsed" ? 28 : 32} mainColor="text-blue-600" secondaryColor="text-blue-300" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                AquaHelix
              </span>
              <p className="text-xs text-gray-500">Manager Pro</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Navigation Principale */}
        <SidebarGroup>
          {state !== "collapsed" && (
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarMenu>
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.label}
                    onClick={() => handleNavigation(item.path, item.label)}
                    className={cn(
                      "transition-all duration-200",
                      isActive 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200/50" 
                        : "hover:bg-blue-50 hover:text-blue-600"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 transition-transform",
                      isActive ? "text-white" : "text-gray-400"
                    )} />
                    <span>{item.label}</span>
                    {isActive && state !== "collapsed" && (
                      <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Section Administration */}
        {(isSuperAdmin || isAdmin) && adminNavItems.length > 0 && (
          <SidebarGroup className="mt-6">
            {state !== "collapsed" && (
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                Administration
              </SidebarGroupLabel>
            )}
            <SidebarMenu>
              {adminNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => handleNavigation(item.path, item.label)}
                      className={cn(
                        "transition-all duration-200",
                        isActive 
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-200/50" 
                          : "hover:bg-purple-50 hover:text-purple-600"
                      )}
                    >
                      <item.icon className={cn(
                        "w-4 h-4 transition-transform",
                        isActive ? "text-white" : "text-gray-400"
                      )} />
                      <span>{item.label}</span>
                      {isActive && state !== "collapsed" && (
                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Section Support */}
        <SidebarGroup className="mt-8">
          {state !== "collapsed" && (
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
              Support
            </SidebarGroupLabel>
          )}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Aide & Support"
                onClick={() => navigate("/help")}
                className="hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
              >
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span>Aide & Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t bg-gray-50/50">
        <div className="space-y-2">
          {state !== "collapsed" && (
            <>
              <div className="flex items-center justify-between">
                <small className="text-xs text-gray-500">
                  &copy; {new Date().getFullYear()} AquaHelix
                </small>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-500">En ligne</span>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Version 1.0.0
              </div>
              {profile && (
                <div className="text-xs text-gray-500 truncate">
                  Connecté en tant que {profile.full_name || profile.email}
                </div>
              )}
            </>
          )}
          {state === "collapsed" && (
            <div className="flex justify-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;