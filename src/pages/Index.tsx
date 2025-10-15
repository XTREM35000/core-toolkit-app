import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Shield, UserCog, Users, Palette, LogOut } from 'lucide-react';

const Index = () => {
  const { user, profile, loading, isSuperAdmin, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleIcon = () => {
    if (isSuperAdmin) return <Shield className="h-6 w-6" />;
    if (isAdmin) return <UserCog className="h-6 w-6" />;
    return <Users className="h-6 w-6" />;
  };

  const getRoleLabel = () => {
    if (isSuperAdmin) return 'Super Administrateur';
    if (isAdmin) return 'Administrateur';
    return 'Utilisateur';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              {getRoleIcon()}
            </div>
            <div>
              <h1 className="text-xl font-bold">{profile?.full_name || 'Utilisateur'}</h1>
              <p className="text-sm text-muted-foreground">{getRoleLabel()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              <Palette className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              className="rounded-full"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Bienvenue sur votre Dashboard
            </h2>
            <p className="text-xl text-muted-foreground">
              Thème actuel : <span className="font-semibold">{theme === 'whatsapp' ? 'WhatsApp' : 'Apple'}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-xl space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Informations du compte
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Email:</span> {profile?.email}</p>
                <p><span className="text-muted-foreground">Rôle:</span> {getRoleLabel()}</p>
                <p><span className="text-muted-foreground">Statut:</span> {profile?.is_active ? 'Actif' : 'Inactif'}</p>
              </div>
            </div>

            <div className="glass p-6 rounded-xl space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Personnalisation
              </h3>
              <p className="text-sm text-muted-foreground">
                Basculez entre les thèmes WhatsApp (vert sombre) et Apple (bleu clair) pour personnaliser votre expérience.
              </p>
              <Button
                onClick={toggleTheme}
                className="w-full gradient-primary text-primary-foreground"
              >
                Changer de thème
              </Button>
            </div>
          </div>

          {(isSuperAdmin || isAdmin) && (
            <div className="glass p-8 rounded-xl space-y-4 shadow-glow">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <UserCog className="h-6 w-6 text-primary" />
                Panneau d'administration
              </h3>
              <p className="text-muted-foreground">
                En tant qu'{isSuperAdmin ? 'administrateur suprême' : 'administrateur'}, vous avez accès aux fonctionnalités de gestion avancées.
              </p>
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Utilisateurs</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Sécurité</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <UserCog className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Paramètres</span>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
