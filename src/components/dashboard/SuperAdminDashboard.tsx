import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import ProfilesPage from './ProfilesPage';
import CollaboratorsPage from './CollaboratorsPage';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Fish, Shell, BarChart3, Users, Settings, Shield, UserCog, 
  TrendingUp, AlertCircle, LayoutDashboard, Beef, Sprout 
} from 'lucide-react';
import heroImage from '@/assets/hero-aquahelix.jpg';
import piscicultureImage from '@/assets/pisciculture-feature.jpg';
import helicicultureImage from '@/assets/heliciculture-feature.jpg';

export const SuperAdminDashboard = () => {
  const [view, setView] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    bassins: 0,
    parcs: 0,
    alertes: 0
  });
  const { profile, isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Récupérer le nombre d'utilisateurs
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Récupérer le nombre de collaborateurs
      const { count: collaboratorsCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      setStats({
        users: usersCount || 0,
        bassins: 12, // Données simulées pour l'exemple
        parcs: 8,   // Données simulées pour l'exemple
        alertes: 3   // Données simulées pour l'exemple
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'profiles':
        return <ProfilesPage />;
      case 'collaborators':
        return <CollaboratorsPage />;
      case 'dashboard':
      default:
        return <DashboardHome />;
    }
  };

  const statCards = [
    { 
      title: "Utilisateurs Actifs", 
      value: stats.users, 
      icon: Users, 
      color: "text-primary", 
      bgColor: "bg-primary/10" 
    },
    { 
      title: "Bassins Actifs", 
      value: stats.bassins, 
      icon: Fish, 
      color: "text-blue-600", 
      bgColor: "bg-blue-50" 
    },
    { 
      title: "Parcs d'Escargots", 
      value: stats.parcs, 
      icon: Shell, 
      color: "text-green-600", 
      bgColor: "bg-green-50" 
    },
    { 
      title: "Alertes", 
      value: stats.alertes, 
      icon: AlertCircle, 
      color: "text-destructive", 
      bgColor: "bg-destructive/10" 
    },
  ];

  const farmTypes = [
    { name: "Pisciculture Tilapia", icon: "🐟", count: 1500, type: "poissons" },
    { name: "Élevage Escargots", icon: "🐌", count: 5000, type: "escargots" },
    { name: "Bassins Actifs", icon: "🏊", count: stats.bassins, type: "bassins" },
    { name: "Parcs Reproduction", icon: "🔬", count: stats.parcs, type: "parcs" },
    { name: "Stock Aliments", icon: "🌾", count: 1200, type: "stock" },
  ];

  const quickActions = [
    { label: "Gestion Profils", icon: Users, action: () => setView('profiles'), path: "/profiles" },
    { label: "Collaborateurs", icon: UserCog, action: () => setView('collaborators'), path: "/collaborators" },
    { label: "Analytiques", icon: BarChart3, action: () => navigate("/analytics"), path: "/analytics" },
    { label: "Paramètres", icon: Settings, action: () => navigate("/settings"), path: "/settings" },
  ];

  const DashboardHome = () => (
    <div className="space-y-8">
      {/* Hero Section avec bienvenue personnalisée */}
      <Card className="relative h-64 overflow-hidden border-0 shadow-xl">
        <img 
          src={heroImage} 
          alt="AquaHelix Manager Pro"
          className="w-full h-full object-cover"
        />
         <AnimatedLogo size={120} className="mb-6" useImage={true} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <CardContent className="absolute inset-0 flex items-center px-8">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Bienvenue, {profile?.full_name || 'Administrateur'} 👋
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Gestion intelligente de votre pisciculture et héliciculture
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                {isSuperAdmin ? <Shield className="w-4 h-4" /> : <UserCog className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {isSuperAdmin ? 'Super Administrateur' : 'Administrateur'}
                </span>
              </div>
              <div className="text-sm opacity-80">
                {profile?.email}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules d'activités */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Modules d'Activité</h3>
          <Button variant="outline" onClick={() => navigate("/modules")}>
            Voir tous les modules
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
            <div className="relative h-48">
              <img src={piscicultureImage} alt="Pisciculture" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <Fish className="w-10 h-10 mb-2" />
                <h3 className="text-2xl font-bold">Pisciculture</h3>
              </div>
            </div>
            <CardContent className="p-6 space-y-3">
              <p className="text-muted-foreground">
                Gérez vos bassins, suivez la croissance de vos poissons, et optimisez la qualité de l'eau en temps réel.
              </p>
              <Button className="w-full gradient-primary">
                Accéder au module
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
            <div className="relative h-48">
              <img src={helicicultureImage} alt="Héliciculture" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <Shell className="w-10 h-10 mb-2" />
                <h3 className="text-2xl font-bold">Héliciculture</h3>
              </div>
            </div>
            <CardContent className="p-6 space-y-3">
              <p className="text-muted-foreground">
                Contrôlez vos parcs d'escargots, surveillez l'hygrométrie et optimisez les conditions de reproduction.
              </p>
              <Button className="w-full gradient-primary">
                Accéder au module
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vue d'ensemble des fermes */}
      <Card>
        <CardHeader>
          <CardTitle>Vue d'ensemble des Activités</CardTitle>
          <CardDescription>Statistiques détaillées de vos différentes activités</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {farmTypes.map((farm, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="text-4xl mb-2">{farm.icon}</div>
                  <CardTitle className="text-sm">{farm.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-primary">{farm.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {farm.type === 'poissons' ? 'poissons' : 
                     farm.type === 'escargots' ? 'escargots' : 'unités'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions Rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="h-20 flex-col gap-2 hover:shadow-md transition-all"
                onClick={action.action}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Administration Avancée */}
      {(isSuperAdmin || isAdmin) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCog className="h-6 w-6 text-primary" />
                <CardTitle>Panneau d'administration</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={view === 'profiles' ? "default" : "outline"}
                  onClick={() => setView('profiles')}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Profils
                </Button>
                <Button 
                  variant={view === 'collaborators' ? "default" : "outline"}
                  onClick={() => setView('collaborators')}
                  className="flex items-center gap-2"
                >
                  <UserCog className="h-4 w-4" />
                  Collaborateurs
                </Button>
              </div>
            </div>
            <CardDescription>
              En tant qu'{isSuperAdmin ? 'administrateur suprême' : 'administrateur'}, 
              vous avez accès aux fonctionnalités de gestion avancées.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Activité Récente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Activité Récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'Nouvel utilisateur créé', time: 'Il y a 2 min', user: 'Jean Dupont', type: 'user' },
              { action: 'Bassin mis à jour', time: 'Il y a 15 min', user: 'Marie Lambert', type: 'bassin' },
              { action: 'Rapport de production généré', time: 'Il y a 1 heure', user: 'Admin System', type: 'report' },
              { action: 'Paramètres système modifiés', time: 'Il y a 2 heures', user: profile?.full_name || 'Admin', type: 'settings' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'bassin' ? 'bg-green-100 text-green-600' :
                    activity.type === 'report' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {activity.type === 'user' && <Users className="w-4 h-4" />}
                    {activity.type === 'bassin' && <Fish className="w-4 h-4" />}
                    {activity.type === 'report' && <BarChart3 className="w-4 h-4" />}
                    {activity.type === 'settings' && <Settings className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">par {activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout onNavigate={(k) => setView(k)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;