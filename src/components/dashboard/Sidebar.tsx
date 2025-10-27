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
import { motion } from "framer-motion";
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

/**
 * AppSidebar - Version PRO (Material style + dark/light auto)
 * - Icônes animées (hover glow + légère rotation 15°)
 * - Aucun changement sur le logo
 * - Pas de répétitions d'icônes entre items / sous-menus
 * - Accessible (aria) et responsive (collapse)
 */

export const AppSidebar = ({ onNavigate }: { onNavigate?: (s: string) => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSuperAdmin, isAdmin, profile } = useAuth();
  const { state } = useSidebar();
  const [openModules, setOpenModules] = React.useState<Record<string, boolean>>({});
  const sidebarRef = React.useRef<HTMLDivElement | null>(null);

  const navGroups = {
    tableau: [
      { path: "/admin", label: "Tableau de Bord", icon: LayoutDashboard, admin: false }
    ],

    production: [
      {
        path: "/poissons",
        label: "Poissons",
        icon: Fish,
        admin: false,
        children: [
          { path: "/poissons/cohortes", label: "Cohortes", icon: Users, admin: false },
          { path: "/poissons/bassins", label: "Bassins", icon: Fish, admin: false },
          { path: "/poissons/especes", label: "Espèces", icon: FileText, admin: false }
        ]
      },
      {
        path: "/heliciculture",
        label: "Héliciculture",
        icon: Shell,
        admin: false,
        children: [
          { path: "/heliciculture/cohortes", label: "Cohortes", icon: Users, admin: false },
          { path: "/heliciculture/escargotieres", label: "Escargotières", icon: Building, admin: false },
          { path: "/heliciculture/mesures", label: "Mesures", icon: Thermometer, admin: false },
          { path: "/heliciculture/pontes", label: "Pontes", icon: FileText, admin: false },
          { path: "/heliciculture/journal", label: "Journal", icon: FileText, admin: false },
          { path: "/heliciculture/stock", label: "Stock", icon: Warehouse, admin: false },
          { path: "/heliciculture/ventes", label: "Ventes", icon: ShoppingCart, admin: false }
        ]
      },
      {
        path: "/aviculture",
        label: "Aviculture",
        icon: Beef,
        admin: false,
        children: [
          { path: "/aviculture/cohortes", label: "Cohortes Poulets", icon: Users, admin: false },
          { path: "/aviculture/poulaillers", label: "Poulaillers", icon: Warehouse, admin: false }
        ]
      },
      {
        path: "/cuniculture",
        label: "Cuniculture",
        icon: Rabbit,
        admin: false,
        children: [
          { path: "/cuniculture/cohortes", label: "Cohortes Lapins", icon: Users, admin: false },
          { path: "/cuniculture/clapiers", label: "Clapiers", icon: Rabbit, admin: false }
        ]
      },
      { path: "/ruchers", label: "Ruchers", icon: Bug, admin: false },
      { path: "/etables", label: "Étables", icon: Beef, admin: false },
      { path: "/parcelles", label: "Parcelles", icon: Sprout, admin: false },
      { path: "/zones-peche", label: "Zones de Pêche", icon: Anchor, admin: false }
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

  const handleNavigation = (path: string, label: string, event?: React.MouseEvent) => {
    // Prevent default browser navigation scrolling
    try { event?.preventDefault(); } catch { }

    // Stabilize current scroll position immediately
    try { window.scrollTo({ top: window.scrollY, behavior: 'auto' }); } catch { }

    if (path.startsWith('/admin') && onNavigate) {
      const view = path.replace('/admin/', '') || 'dashboard';
      onNavigate(view);
    } else {
      navigate(path);
    }

    // After navigation, ensure the browser does not jump to top
    setTimeout(() => {
      try {
        // Prevent document jump
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo({ top: window.scrollY });

        // Try to find the clicked sidebar item and ensure it's visible
        try {
          const sidebar = sidebarRef.current as HTMLElement | null;
          if (sidebar) {
            const selector = `[data-sidebar-path="${path}"]`;
            const el = sidebar.querySelector(selector) as HTMLElement | null;
            if (el && typeof el.scrollIntoView === 'function') {
              // Prefer keeping it in view, center if possible
              el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
            }
          }
        } catch { }

        document.documentElement.style.scrollBehavior = '';
      } catch { }
    }, 10);
  };

  const groupColors = {
    tableau: { active: "bg-blue-600", text: "text-blue-600", accent: "#2563eb" },
    production: { active: "bg-emerald-600", text: "text-emerald-600", accent: "#059669" },
    operations: { active: "bg-orange-600", text: "text-orange-600", accent: "#d97706" },
    commercial: { active: "bg-purple-600", text: "text-purple-600", accent: "#6d28d9" },
    analytics: { active: "bg-indigo-600", text: "text-indigo-600", accent: "#4f46e5" },
    administration: { active: "bg-red-600", text: "text-red-600", accent: "#dc2626" },
    support: { active: "bg-gray-600", text: "text-gray-600", accent: "#4b5563" }
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

  const IconWrap: React.FC<{ Icon: any; isActive?: boolean; color?: string; label?: string }> = ({ Icon, isActive, color, label }) => {
    // Motion wrapper for hover rotation + glow
    return (
      <motion.span
        title={label}
        role="img"
        aria-label={label}
        whileHover={{
          rotate: 15,
          scale: 1.06,
          boxShadow: `0 8px 22px ${color ?? 'rgba(0,0,0,0.12)'}`
        }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className={cn("flex items-center justify-center w-5 h-5", isActive ? "text-white" : "text-gray-500")}
        style={{ display: "inline-flex" }}
      >
        <Icon />
      </motion.span>
    );
  };

  const renderNavGroup = (groupKey: string, items: any[], colorScheme: any) => {
    const filteredItems = items.filter(item =>
      !item.admin || (item.admin && (isSuperAdmin || isAdmin))
    );

    if (filteredItems.length === 0) return null;

    const renderNavItem = (item: any) => {
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      const childMatches = hasChildren && item.children.some((child: any) => location.pathname === child.path || location.pathname.startsWith(child.path));
      const isOpen = openModules[item.path] ?? !!childMatches;
      const isActive = location.pathname === item.path || (hasChildren && childMatches);

      return (
        <div key={item.path} className="mb-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              data-sidebar-path={item.path}
              isActive={location.pathname === item.path}
              tooltip={item.label}
              onClick={(e) => {
                if (hasChildren) {
                  // Preserve sidebar scroll when toggling groups
                  const currentScroll = (sidebarRef.current as any)?.scrollTop ?? 0;
                  setOpenModules(prev => ({ ...prev, [item.path]: !isOpen }));
                  requestAnimationFrame(() => {
                    try { (sidebarRef.current as any)?.scrollTo?.({ top: currentScroll, behavior: 'auto' }); } catch { }
                  });
                } else {
                  handleNavigation(item.path, item.label, e);
                }
              }}
              aria-expanded={hasChildren ? isOpen : undefined}
              aria-controls={hasChildren ? `${item.path}-submenu` : undefined}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer select-none transition-colors duration-200",
                isActive ? "bg-opacity-100 text-white" : "hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
              style={isActive ? { background: colorScheme.accent, boxShadow: "0 6px 18px rgba(0,0,0,0.08)" } : undefined}
            >
              <div className="w-5 h-5 flex-shrink-0">
                <IconWrap Icon={item.icon} isActive={isActive} color={isActive ? (colorScheme.accent + "80") : (colorScheme.accent + "40")} label={item.label} />
              </div>

              <span className={cn("text-sm font-medium truncate", isActive ? "text-white" : "text-gray-800 dark:text-gray-200")}>
                {item.label}
              </span>

              {hasChildren && (
                <div className="ml-auto flex items-center gap-2">
                  <span className={cn("text-xs text-gray-400 dark:text-gray-300 hidden sm:inline")}>{/* helper */}</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-180 text-gray-600" : "text-gray-400")} />
                </div>
              )}

              {!hasChildren && location.pathname === item.path && state !== "collapsed" && (
                <span className="ml-auto w-2 h-2 bg-white rounded-full" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>

          {hasChildren && (
            <div
              id={`${item.path}-submenu`}
              className={cn(
                "ml-6 mt-1 space-y-1 overflow-hidden transition-[max-height,opacity,transform] duration-250 ease-in-out",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
              )}
              style={{ maxHeight: isOpen ? 1000 : 0 }}
            >
              {item.children.filter((child: any) => !child.admin || (child.admin && (isSuperAdmin || isAdmin))).map((child: any) => {
                const childActive = location.pathname === child.path;
                return (
                  <SidebarMenuItem key={child.path}>
                    <SidebarMenuButton
                      data-sidebar-path={child.path}
                      isActive={childActive}
                      tooltip={child.label}
                      onClick={(e) => handleNavigation(child.path, child.label, e)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150",
                        childActive ? "text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      )}
                      style={childActive ? { background: colorScheme.accent } : undefined}
                    >
                      <div className="w-4 h-4">
                        <IconWrap Icon={child.icon ?? FileText} isActive={childActive} color={colorScheme.accent} label={child.label} />
                      </div>
                      <span className="truncate">{child.label}</span>
                      {childActive && state !== "collapsed" && <span className="ml-auto w-2 h-2 bg-white rounded-full" />}
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
      <SidebarGroup key={groupKey} className="mb-3">
        {state !== "collapsed" && (
          <SidebarGroupLabel className={cn(
            "text-xs font-semibold uppercase tracking-wide px-2 mb-2 border-l-4 pl-3",
            "dark:text-gray-300"
          )} style={{ borderColor: colorScheme.accent }}>
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
    <Sidebar className="border-r bg-white dark:bg-gray-900 shadow-sm">
      <SidebarHeader className="p-5 border-b dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-3">
          <div className="cursor-pointer transition-transform duration-200">
            <AnimatedLogo
              size={state === "collapsed" ? 32 : 36}
              mainColor="text-current"
              secondaryColor="text-gray-300"
            />
          </div>

          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-bold text-lg dark:text-white text-gray-900">MultiFarm SaaS</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Management Suite</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent ref={sidebarRef as any} className="px-3 py-5 space-y-2">
        {Object.entries(navGroups).map(([groupKey, items]) =>
          renderNavGroup(groupKey, items, (groupColors as any)[groupKey])
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="space-y-3">
          {state !== "collapsed" && profile && (
            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {profile.full_name?.[0] || profile.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {profile.full_name || "Utilisateur"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {profile.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            {state !== "collapsed" && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <small className="text-xs text-gray-500 dark:text-gray-400 font-medium">Système actif</small>
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
