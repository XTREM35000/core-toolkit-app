import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Shield, UserCog, Users, Palette, LogOut, Fish, Shell } from 'lucide-react';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import heroImage from '@/assets/hero-aquahelix.jpg';
import piscicultureImage from '@/assets/pisciculture-feature.jpg';
import helicicultureImage from '@/assets/heliciculture-feature.jpg';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, profile, loading, isSuperAdmin, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers le dashboard si l'utilisateur est connecté
    if (user && !loading) {
      console.log('🔄 Redirection vers /admin depuis Index.tsx');
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Afficher un loader pendant la vérification ou la redirection
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

  // Si l'utilisateur est connecté, ne rien afficher (redirection en cours)
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Redirection vers le dashboard...</p>
        </div>
      </div>
    );
  }

  // Si pas connecté, afficher la page d'accueil publique
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
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={heroImage} 
          alt="AquaHelix Manager Pro - Pisciculture et Héliciculture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <AnimatedLogo size={120} className="mb-6" useImage={true} />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            AquaHelix Manager Pro
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl px-4 opacity-90">
            Gestion intelligente de votre pisciculture et héliciculture
          </p>
          
          <div className="mt-8 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Palette className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              className="rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              {getRoleIcon()}
            </div>
            <div>
              <h2 className="text-lg font-bold">{profile?.full_name || 'Utilisateur'}</h2>
              <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground hidden md:block">
            Thème : <span className="font-semibold">{theme === 'whatsapp' ? 'WhatsApp' : 'Apple'}</span>
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Activités Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
              <div className="relative h-48">
                <img src={piscicultureImage} alt="Pisciculture" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Fish className="w-10 h-10 mb-2" />
                  <h3 className="text-2xl font-bold">Pisciculture</h3>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-muted-foreground">
                  Gérez vos bassins, suivez la croissance de vos poissons, et optimisez la qualité de l'eau en temps réel.
                </p>
                <Button className="w-full gradient-primary">
                  Accéder au module
                </Button>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
              <div className="relative h-48">
                <img src={helicicultureImage} alt="Héliciculture" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Shell className="w-10 h-10 mb-2" />
                  <h3 className="text-2xl font-bold">Héliciculture</h3>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-muted-foreground">
                  Contrôlez vos parcs d'escargots, surveillez l'hygrométrie et optimisez les conditions de reproduction.
                </p>
                <Button className="w-full gradient-primary">
                  Accéder au module
                </Button>
              </div>
            </div>
          </div>

          {/* Informations Section */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Compte
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Email:</span> {profile?.email}</p>
                <p><span className="text-muted-foreground">Rôle:</span> {getRoleLabel()}</p>
                <p><span className="text-muted-foreground">Statut:</span> {profile?.is_active ? 'Actif' : 'Inactif'}</p>
              </div>
            </div>

            <div className="glass p-6 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Fish className="h-5 w-5 text-primary" />
                Poissons
              </h3>
              <p className="text-sm text-muted-foreground">
                Suivez vos cohortes, analysez la croissance et optimisez l'alimentation.
              </p>
            </div>

            <div className="glass p-6 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shell className="h-5 w-5 text-primary" />
                Escargots
              </h3>
              <p className="text-sm text-muted-foreground">
                Gérez la reproduction, contrôlez l'environnement et planifiez les récoltes.
              </p>
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