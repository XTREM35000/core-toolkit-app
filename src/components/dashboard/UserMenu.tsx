import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  CreditCard, 
  Palette,
  Bell,
  HelpCircle,
  Crown,
  UserCog,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const UserMenu = () => {
  const { user, profile, isSuperAdmin, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({ 
        title: "Déconnexion réussie",
        description: "À bientôt sur AquaHelix!",
        duration: 3000
      });
      navigate("/");
      setShowLogoutDialog(false);
    } catch (error) {
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return profile?.email?.[0]?.toUpperCase() || "U";
  };

  const getRoleBadge = () => {
    if (isSuperAdmin) {
      return { label: "Super Admin", color: "bg-gradient-to-r from-purple-600 to-pink-600", icon: Crown };
    }
    if (isAdmin) {
      return { label: "Administrateur", color: "bg-gradient-to-r from-blue-600 to-cyan-600", icon: UserCog };
    }
    return { label: "Utilisateur", color: "bg-gradient-to-r from-gray-600 to-gray-700", icon: User };
  };

  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  const menuItems = [
    { icon: User, label: "Mon Profil", action: () => navigate("/profile"), description: "Gérer votre profil" },
    { icon: Bell, label: "Notifications", action: () => navigate("/notifications"), description: "Paramètres de notifications" },
    { icon: CreditCard, label: "Abonnement", action: () => navigate("/subscription"), description: "Gérer votre abonnement" },
    { icon: Palette, label: "Apparence", action: () => navigate("/appearance"), description: "Personnaliser l'interface" },
    { icon: Shield, label: "Sécurité", action: () => navigate("/security"), description: "Sécurité du compte" },
    { icon: HelpCircle, label: "Aide & Support", action: () => navigate("/help"), description: "Centre d'aide" },
  ];

  if (isAdmin || isSuperAdmin) {
    menuItems.splice(1, 0,
      { icon: UserCog, label: "Collaborateurs", action: () => navigate("/collaborators"), description: "Gérer les collaborateurs" },
      { icon: UserCog, label: "Ajouter un collaborateur", action: () => navigate("/collaborators/add"), description: "Inviter un nouveau collaborateur" }
    );
  }

  // Add super-admin only configuration entry
  if (isSuperAdmin) {
    menuItems.splice(2, 0, { icon: Shield, label: 'Configuration Plateforme', action: () => navigate('/admin/config'), description: 'Panneau de configuration Super Admin' });
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative p-0 h-auto rounded-full hover:scale-105 transition-transform duration-200">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-white shadow-lg hover:shadow-xl transition-all duration-300">
                <AvatarImage 
                  src={(profile as any)?.avatar_url ?? (profile as any)?.avatarUrl ?? (profile as any)?.avatar ?? undefined} 
                  alt={profile?.full_name || profile?.email} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              {/* Animation de pulse */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-blue-400/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </Button>
        </DropdownMenuTrigger>

        <AnimatePresence>
          {isOpen && (
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0 overflow-hidden border-0 shadow-2xl rounded-2xl bg-white text-gray-900"
        forceMount
            >
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="bg-white"
                >
                {/* Header avec infos utilisateur */}
                <DropdownMenuLabel className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Avatar className="h-16 w-16 ring-4 ring-white/80 shadow-lg">
                        <AvatarImage 
                            src={(profile as any)?.avatar_url ?? (profile as any)?.avatarUrl ?? (profile as any)?.avatar ?? undefined} 
                            alt={profile?.full_name || profile?.email}
                            className="object-cover"
                          />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      <motion.h3 
                        className="font-bold text-lg truncate text-gray-900"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {profile?.full_name || "Utilisateur"}
                      </motion.h3>
                      <motion.p 
                        className="text-sm text-gray-600 truncate mt-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        {profile?.email}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`mt-2 inline-flex items-center gap-1.5 ${roleBadge.color} text-white text-xs px-2.5 py-1 rounded-full shadow-md`}
                      >
                        <RoleIcon className="w-3 h-3" />
                        <span>{roleBadge.label}</span>
                        {isSuperAdmin && <Sparkles className="w-3 h-3" />}
                      </motion.div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                {/* Menu items avec animations */}
                <div className="p-2 max-h-96 overflow-y-auto">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.3 }}
                      >
                        <DropdownMenuItem
                          onSelect={item.action}
                          className="p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 group focus:bg-blue-50 focus:text-blue-700"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <span className="font-medium text-sm">{item.label}</span>
                              <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                                {item.description}
                              </p>
                            </div>
                            <motion.div
                              whileHover={{ x: 2 }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <div className="w-1 h-1 rounded-full bg-blue-600" />
                            </motion.div>
                          </div>
                        </DropdownMenuItem>
                      </motion.div>
                    );
                  })}
                </div>

                <DropdownMenuSeparator />

                {/* Déconnexion */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <DropdownMenuItem
                    onSelect={() => setShowLogoutDialog(true)}
                    className="p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-red-50 hover:text-red-700 group focus:bg-red-50 focus:text-red-700 text-red-600"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="p-2 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-200">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-sm">Déconnexion</span>
                        <p className="text-xs text-red-500 group-hover:text-red-600 transition-colors">
                          Quitter la session
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </motion.div>

                {/* Footer */}
                <div className="p-3 bg-gray-50/50 border-t">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>AquaHelix Pro</span>
                    <span>v1.0.0</span>
                  </div>
                </div>
              </motion.div>
            </DropdownMenuContent>
          )}
        </AnimatePresence>
      </DropdownMenu>

      {/* Dialog de confirmation de déconnexion */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AlertDialogHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-lg font-semibold">
                Confirmer la déconnexion
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Êtes-vous sûr de vouloir vous déconnecter de votre compte AquaHelix ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-row gap-3 justify-center sm:justify-center">
              <AlertDialogCancel className="mt-0 flex-1 rounded-xl border-gray-300 hover:bg-gray-50">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-200 transition-all"
              >
                Se déconnecter
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserMenu;