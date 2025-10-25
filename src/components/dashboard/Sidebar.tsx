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
  ChevronDown,
  ChevronRight,
  BarChart3,
  FileText,
  HelpCircle,
  AlertCircle,
  Beef,
  Building,
  Activity,
  ShoppingCart,
  CreditCard,
  Warehouse,
  Sprout,
  Rabbit,
  Bug,
  Anchor,
  Truck,
  Package,
  Thermometer,
  Bell,
  PieChart,
  FileBarChart,
  Globe
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

export const AppSidebar = ({ onNavigate }: { onNavigate?: (string) => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSuperAdmin, isAdmin, profile } = useAuth();
  const { state } = useSidebar();
  const [openModules, setOpenModules] = React.useState<Record<string, boolean>>({});

  // Réorganisation par groupes logiques
  const navGroups = {
    tableau: [
      { path: "/admin", label: "Tableau de Bord", icon: LayoutDashboard, admin: false }
    ],

    // Modules métiers — pages principales qui regroupent les cohortes/ressources
    production: [
      { path: "/bassins-piscicoles", label: "Bassins Piscicoles", icon: Fish, admin: false },
      {
        path: "/poissons",
        label: "Poissons",
        icon: Fish,
        admin: false,
        children: [
          { path: "/cohortes-poissons", label: "Cohortes Poissons", icon: Users, admin: false },
          { path: "/bassins-piscicoles", label: "Bassins Piscicoles", icon: Fish, admin: false },
          { path: "/especes-poissons", label: "Espèces", icon: FileText, admin: false }
        ]
      },
      {
        path: "/heliciculture",
        label: "Héliciculture",
        icon: Shell,
        admin: false,
        children: [
          { path: "/cohortes-escargots", label: "Cohortes Escargots", icon: Shell, admin: false },
          { path: "/escargotieres", label: "Escargotières", icon: Building, admin: false },
          { path: "/mesures-heliciculture", label: "Mesures", icon: Thermometer, admin: false }
        ]
      },
      {
        path: "/aviculture",
        label: "Aviculture",
        icon: Beef,
        admin: false,
        children: [
          { path: "/cohortes-poulets", label: "Cohortes Poulets", icon: Users, admin: false },
          { path: "/poulaillers", label: "Poulaillers", icon: Warehouse, admin: false }
        ]
      },
      {
        path: "/cuniculture",
        label: "Cuniculture",
        icon: Rabbit,
        admin: false,
        children: [
          { path: "/cohortes-lapins", label: "Cohortes Lapins", icon: Users, admin: false },
          { path: "/clapiers", label: "Clapiers", icon: Rabbit, admin: false }
        ]
      },
      { path: "/poulaillers", label: "Poulaillers", icon: Warehouse, admin: false },
      { path: "/ruchers", label: "Ruchers", icon: Bug, admin: false },
      { path: "/etables", label: "Étables", icon: Beef, admin: false },
      { path: "/parcelles", label: "Parcelles", icon: Sprout, admin: false },
      { path: "/zones-peche", label: "Zones de Pêche", icon: Anchor, admin: false },
    ],

    operations: [
      { path: "/stock-aliments", label: "Stock Aliments", icon: Package, admin: false },
      { path: "/conditions-environnement", label: "Conditions Environnement", icon: Thermometer, admin: false },
      { path: "/activities", label: "Activités", icon: Activity, admin: false }
    ],

    commercial: [
      { path: "/commandes", label: "Commandes Fournisseurs", icon: Truck, admin: false },
      { path: "/ventes", label: "Ventes Clients", icon: ShoppingCart, admin: false },
      { path: "/encaissements", label: "Encaissements", icon: CreditCard, admin: false }
    ],

    analytics: [
      { path: "/analytics", label: "Analytiques", icon: PieChart, admin: false },
      { path: "/reports", label: "Rapports", icon: FileBarChart, admin: false },
      { path: "/alerts", label: "Alertes", icon: Bell, admin: false }
    ],

    administration: [
      { path: "/clients", label: "Clients", icon: Users, admin: true },
      { path: "/profiles", label: "Gestion Profils", icon: UserCog, admin: true },
      { path: "/security", label: "Sécurité", icon: Shield, admin: true },
      { path: "/admin/config", label: "Configuration", icon: Settings, admin: true }
    ],

    support: [
      { path: "/help", label: "Aide & Support", icon: HelpCircle, admin: false }
    ]
  };

  const handleNavigation = (path: string, label: string) => {
    if (path.startsWith('/admin') && onNavigate) {
      const view = path.replace('/admin/', '') || 'dashboard';
      onNavigate(view);
    } else {
      navigate(path);
    }
  };

  // Couleurs par groupe pour une identité visuelle forte
  const groupColors = {
    tableau: { active: "bg-blue-600", hover: "hover:bg-blue-50 hover:text-blue-600", text: "text-blue-600" },
    production: { active: "bg-green-600", hover: "hover:bg-green-50 hover:text-green-600", text: "text-green-600" },
    operations: { active: "bg-orange-600", hover: "hover:bg-orange-50 hover:text-orange-600", text: "text-orange-600" },
    commercial: { active: "bg-purple-600", hover: "hover:bg-purple-50 hover:text-purple-600", text: "text-purple-600" },
    analytics: { active: "bg-indigo-600", hover: "hover:bg-indigo-50 hover:text-indigo-600", text: "text-indigo-600" },
    administration: { active: "bg-red-600", hover: "hover:bg-red-50 hover:text-red-600", text: "text-red-600" },
    support: { active: "bg-gray-600", hover: "hover:bg-gray-50 hover:text-gray-600", text: "text-gray-600" }
  };

  const groupLabels = {
    tableau: "Tableau de Bord",
    production: "Production",
    operations: "Opérations",
    commercial: "Commercial",
    analytics: "Analytics",
    administration: "Administration",
    support: "Support"
  };

  const renderNavGroup = (groupKey, items, colorScheme) => {
    const filteredItems = items.filter(item =>
      !item.admin || (item.admin && (isSuperAdmin || isAdmin))
    );

    if (filteredItems.length === 0) return null;

    const renderNavItem = (item) => {
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      const childMatches = hasChildren && item.children.some(child => location.pathname === child.path || location.pathname.startsWith(child.path));
      const isOpen = openModules[item.path] ?? !!childMatches;
      // only mark an item active when its path exactly matches the location.
      // if a child is active, we keep the parent visually distinct but not 'selected'
      const isActive = location.pathname === item.path;

      return (
        <div key={item.path}>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={item.label}
              onClick={() => handleNavigation(item.path, item.label)}
              className={cn(
                "transition-all duration-200 group relative",
                isActive
                  ? `${colorScheme.active} text-white shadow-lg`
                  : childMatches
                    ? "bg-gray-100 text-gray-900"
                    : `${colorScheme.hover} text-gray-700`
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 transition-transform group-hover:scale-110",
                isActive ? "text-white" : "text-gray-500"
              )} />
              <span className="font-medium">{item.label}</span>

              {hasChildren && (
                <button
                  aria-label={isOpen ? "Réduire" : "Développer"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenModules(prev => ({ ...prev, [item.path]: !isOpen }));
                  }}
                  className={cn("ml-auto p-1 rounded focus:outline-none", isActive ? "text-white" : childMatches ? "text-gray-700" : "text-gray-400")}
                >
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-180" : "rotate-0")} />
                </button>
              )}

              {!hasChildren && isActive && state !== "collapsed" && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>

          {hasChildren && (
            <div
              className={cn(
                "ml-4 mt-1 space-y-1 overflow-hidden transition-[max-height,opacity,transform] duration-200 ease-in-out",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
              )}
              style={{ maxHeight: isOpen ? 500 : 0 }}
            >
              {item.children.filter(child => !child.admin || (child.admin && (isSuperAdmin || isAdmin))).map(child => {
                const childActive = location.pathname === child.path;
                return (
                  <SidebarMenuItem key={child.path}>
                    <SidebarMenuButton
                      isActive={childActive}
                      tooltip={child.label}
                      onClick={() => handleNavigation(child.path, child.label)}
                      className={cn(
                        "transition-all duration-150 group relative text-sm",
                        childActive ? `${colorScheme.active} text-white shadow-sm` : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {child.icon ? (
                        <child.icon className={cn("w-4 h-4 mr-2", childActive ? "text-white" : "text-gray-500")} />
                      ) : (
                        <div className={cn("w-2 h-2 mr-2 rounded-full", childActive ? "bg-white" : "bg-gray-400")} />
                      )}
                      <span className="ml-0.5">{child.label}</span>
                      {childActive && state !== "collapsed" && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </div>
          )}
        </div>
      );
    };

    return (
      <SidebarGroup key={groupKey} className="mb-2">
        {state !== "collapsed" && (
          <SidebarGroupLabel className={cn(
            "text-xs font-bold uppercase tracking-wider px-2 mb-2 border-l-4 pl-3",
            colorScheme.text,
            groupKey === 'tableau' ? "border-l-blue-500" :
              groupKey === 'production' ? "border-l-green-500" :
                groupKey === 'operations' ? "border-l-orange-500" :
                  groupKey === 'commercial' ? "border-l-purple-500" :
                    groupKey === 'analytics' ? "border-l-indigo-500" :
                      groupKey === 'administration' ? "border-l-red-500" :
                        "border-l-gray-500"
          )}>
            {groupLabels[groupKey]}
          </SidebarGroupLabel>
        )}
        <SidebarMenu>
          {filteredItems.map(item => renderNavItem(item))}
        </SidebarMenu>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-white to-gray-50/80 shadow-lg">
      {/* Header avec design premium */}
      <SidebarHeader className="p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="cursor-pointer hover:scale-105 transition-transform duration-300">
            <AnimatedLogo
              size={state === "collapsed" ? 32 : 36}
              mainColor="text-white"
              secondaryColor="text-blue-200"
            />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white tracking-tight">
                AquaHelix
              </span>
              <p className="text-blue-100 text-sm font-medium">Management Suite</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6 space-y-1">
        {/* Affichage de tous les groupes organisés */}
        {Object.entries(navGroups).map(([groupKey, items]) =>
          renderNavGroup(groupKey, items, groupColors[groupKey])
        )}
      </SidebarContent>

      {/* Footer avec informations utilisateur */}
      <SidebarFooter className="p-4 border-t bg-gradient-to-r from-gray-50 to-white">
        <div className="space-y-3">
          {state !== "collapsed" && profile && (
            <div className="flex items-center gap-3 p-2 bg-white rounded-lg border shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {profile.full_name?.[0] || profile.email?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile.full_name || "Utilisateur"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profile.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            {state !== "collapsed" && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <small className="text-xs text-gray-500 font-medium">Système actif</small>
              </div>
            )}
            {state === "collapsed" && (
              <div className="flex justify-center w-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;