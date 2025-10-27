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
    alertes: 0,
    poissons: 0,
    escargots: 0,
    stock: 0,
    poulaillers: 0,
    clapiers: 0,
    ruchers: 0,
    etables: 0,
    parcelles: 0,
    zones_peche: 0,
    recoltes_miel: 0,
    captures_peche: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Array<{ action: string; time: string; user: string; type?: string }>>([]);
  const [latestBassin, setLatestBassin] = useState<any | null>(null);
  const [latestParc, setLatestParc] = useState<any | null>(null);
  const [latestAlert, setLatestAlert] = useState<any | null>(null);
  const { profile, isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // helper to try multiple candidate table names for a count
      const tryCount = async (candidates: string[]) => {
        for (const t of candidates) {
          try {
            const { count } = await (supabase as any)
              .from(t)
              .select('*', { count: 'exact', head: true });
            if (typeof count === 'number') return count;
          } catch (e) {
            // ignore and try next
          }
        }
        return 0;
      };

      // Récupérer le nombre d'utilisateurs
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Nombre de bassins (chercher sous plusieurs noms courants)
      const bassinsCount = await tryCount(['bassins_piscicoles', 'bassins', 'bassins_list']);

      // Nombre de parcs (prendre la table d'héliciculture si présente)
      const parcsCount = await tryCount(['parcs_helicicoles', 'parcs']);

      // Nombre d'alertes (table 'alerts' ou 'alertes')
      let alertesCount = 0;
      try {
        const { count } = await (supabase as any)
          .from('alertes')
          .select('*', { count: 'exact', head: true });
        alertesCount = count || 0;
      } catch (err) {
        try {
          const { count } = await (supabase as any)
            .from('alerts')
            .select('*', { count: 'exact', head: true });
          alertesCount = count || 0;
        } catch (err2) {
          // keep 0
        }
      }

      const poissonsCount = await tryCount(['poissons', 'fish', 'pisciculture', 'productions']);
  const escargotsCount = await tryCount(['cohortes_escargots', 'escargots', 'snails', 'heliciculture']);
      const stockCount = await tryCount(['stock', 'stocks', 'inventory', 'stock_aliments']);

  const poulaillersCount = await tryCount(['poulaillers', 'poultry_houses', 'poulailler']);
  const clapiersCount = await tryCount(['clapiers', 'clapiers_lapins', 'rabbit_hutches']);
  const ruchersCount = await tryCount(['ruchers', 'apiaries', 'rucher']);
  const etablesCount = await tryCount(['etables', 'stables', 'etables_animaux']);
  const parcellesCount = await tryCount(['parcelles', 'parcelles_cultures', 'fields']);
  const zonesPecheCount = await tryCount(['zones_peche', 'zones_peche', 'fishing_zones']);
  const recoltesMielCount = await tryCount(['recoltes_miel', 'recoltes', 'honey_harvests']);
  const capturesPecheCount = await tryCount(['captures_peche', 'captures', 'fishing_catches']);

      setStats({
        users: usersCount || 0,
        bassins: bassinsCount,
        parcs: parcsCount,
        alertes: alertesCount,
        poissons: poissonsCount,
        escargots: escargotsCount,
        stock: stockCount,
        poulaillers: poulaillersCount,
        clapiers: clapiersCount,
        ruchers: ruchersCount,
        etables: etablesCount,
        parcelles: parcellesCount,
        zones_peche: zonesPecheCount,
        recoltes_miel: recoltesMielCount,
        captures_peche: capturesPecheCount,
      });

      // load a few representative recent items to show real info in cards
      try {
        const { data: lb } = await (supabase as any).from('bassins_piscicoles').select('id,nom,statut,updated_at').order('updated_at', { ascending: false }).limit(1) as any;
        setLatestBassin((lb || [])[0] ?? null);
      } catch (e) {
        setLatestBassin(null);
      }

      try {
        const { data: lp } = await (supabase as any).from('parcs_helicicoles').select('id,nom,statut,updated_at').order('updated_at', { ascending: false }).limit(1) as any;
        setLatestParc((lp || [])[0] ?? null);
      } catch (e) {
        setLatestParc(null);
      }

      try {
        const { data: la } = await (supabase as any).from('alertes').select('id,message,level,created_at').order('created_at', { ascending: false }).limit(1) as any;
        setLatestAlert((la || [])[0] ?? null);
      } catch (e) {
        setLatestAlert(null);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const loadRecentActivities = async () => {
    const candidates = ['activities', 'activity_log', 'activity', 'audit_logs', 'events', 'logs'];
    for (const table of candidates) {
      try {
        const { data, error } = await (supabase as any)
          .from(table)
          .select('id, action, created_by, created_at, user_id, metadata')
          .order('created_at', { ascending: false })
          .limit(10) as any;

        if (error || !data || data.length === 0) continue;

        const userIds = Array.from(new Set(data.map((d: any) => d.created_by || d.user_id).filter(Boolean)));
        let profilesMap: Record<string, string> = {};
        if (userIds.length) {
          try {
            const { data: profiles } = await (supabase as any)
              .from('profiles')
              .select('id, full_name, email')
              .in('id', userIds) as any;
            profilesMap = (profiles || []).reduce((acc: any, p: any) => ({ ...acc, [p.id]: p.full_name || p.email || 'Utilisateur' }), {});
          } catch (e) {
            // ignore
          }
        }

        const mapped = (data || []).map((d: any) => {
          const uid = d.created_by || d.user_id;
          const user = uid ? (profilesMap[uid] || uid) : (d.metadata?.user_name || 'System');
          const action = d.action || d.metadata?.action || 'Action système';
          const time = d.created_at ? new Date(d.created_at).toLocaleString() : '';
          const type = d.metadata?.type || undefined;
          return { action, time, user, type };
        });

        setRecentActivities(mapped);
        return;
      } catch (e) {
        // try next candidate
      }
    }

    // fallback static
    setRecentActivities([
      { action: 'Nouvel utilisateur créé', user: 'Jean Dupont', time: 'Il y a 2 min', type: 'user' },
      { action: 'Bassin mis à jour', user: 'Marie Lambert', time: 'Il y a 15 min', type: 'bassin' },
      { action: 'Rapport de production généré', user: 'Admin System', time: 'Il y a 1 heure', type: 'report' },
      { action: 'Paramètres système modifiés', user: profile?.full_name || 'GOGO THERRY', time: 'Il y a 2 heures', type: 'settings' },
    ]);
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
      bgColor: "bg-primary/10",
      type: "users",
    },
    { 
      title: "Bassins Actifs", 
      value: stats.bassins, 
      icon: Fish, 
      color: "text-blue-600", 
      bgColor: "bg-blue-50",
      type: "bassins",
    },
    { 
      title: "Parcs d'Escargots", 
      value: stats.parcs, 
      icon: Shell, 
      color: "text-green-600", 
      bgColor: "bg-green-50",
      type: "parcs",
    },
    { 
      title: "Alertes", 
      value: stats.alertes, 
      icon: AlertCircle, 
      color: "text-destructive", 
      bgColor: "bg-destructive/10",
      type: "alertes",
    },
  ];

  const farmTypes = [
    { name: "Pisciculture Tilapia", icon: "🐟", count: stats.poissons || 0, type: "poissons" },
    { name: "Élevage Escargots", icon: "🐌", count: stats.escargots || 0, type: "escargots" },
    { name: "Bassins Actifs", icon: "🏊", count: stats.bassins || 0, type: "bassins" },
    { name: "Parcs Reproduction", icon: "🔬", count: stats.parcs || 0, type: "parcs" },
    { name: "Stock Aliments", icon: "🌾", count: stats.stock || 0, type: "stock" },
    { name: "Poulaillers", icon: "🐔", count: stats.poulaillers || 0, type: "poulaillers", path: '/poulaillers' },
    { name: "Clapiers", icon: "🐇", count: stats.clapiers || 0, type: "clapiers", path: '/clapiers' },
    { name: "Ruchers", icon: "🐝", count: stats.ruchers || 0, type: "ruchers", path: '/ruchers' },
    { name: "Étables", icon: "🐄", count: stats.etables || 0, type: "etables", path: '/etables' },
    { name: "Parcelles", icon: "🌱", count: stats.parcelles || 0, type: "parcelles", path: '/parcelles' },
    { name: "Zones de pêche", icon: "🎣", count: stats.zones_peche || 0, type: "zones_peche", path: '/zones-peche' },
    { name: "Récoltes miel", icon: "🍯", count: stats.recoltes_miel || 0, type: "recoltes_miel", path: '/apiculture' },
    { name: "Captures pêche", icon: "🦈", count: stats.captures_peche || 0, type: "captures_peche", path: '/peche' },
  ];

  const quickActions = [
    { label: "Gestion Profils", icon: Users, action: () => setView('profiles'), path: "/profiles" },
    { label: "Collaborateurs", icon: UserCog, action: () => setView('collaborators'), path: "/collaborators" },
    { label: "Analytiques", icon: BarChart3, action: () => navigate("/analytics"), path: "/analytics" },
    { label: "Paramètres", icon: Settings, action: () => navigate("/admin/config"), path: "/admin/config" },
  ];

  const DashboardHome = () => (
    <div className="space-y-8">
  {/* Onboarding / Initialization overlay is mounted globally in App.tsx; avoid mounting it twice here */}
      {/* Hero Section avec bienvenue personnalisée */}
      <Card className="relative h-64 overflow-hidden border-0 shadow-xl">
        <img 
          src={heroImage} 
          alt="MultiFarm SaaS Manager Pro"
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
              Gestion intelligente de toutes vos activités agricoles et animales
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
                  {/* show a short real item summary when available */}
                  {stat.type === 'bassins' && latestBassin && (
                    <p className="text-xs text-muted-foreground mt-2">Dernier bassin: {latestBassin.nom} — {latestBassin.statut}</p>
                  )}
                  {stat.type === 'parcs' && latestParc && (
                    <p className="text-xs text-muted-foreground mt-2">Dernier parc: {latestParc.nom} — {latestParc.statut}</p>
                  )}
                  {stat.type === 'alertes' && latestAlert && (
                    <p className="text-xs text-destructive mt-2">{latestAlert.level ? `${latestAlert.level} — ` : ''}{latestAlert.message ?? 'Nouvelle alerte'}</p>
                  )}
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
          <Button variant="outline" onClick={() => navigate("/admin")}>
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
      {/* Nouveaux modules en grille */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Autres modules</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {farmTypes.slice(5).map((m, i) => (
            <Card
              key={i}
              onClick={() => m.path ? navigate(m.path) : undefined}
              className="relative text-center hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
              aria-label={m.name}
            >
              {/* badge top-right */}
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {m.count}
                </span>
              </div>
              <CardContent className="p-4 flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="text-3xl mb-2">{m.icon}</div>
                  <CardTitle className="text-sm">{m.name}</CardTitle>
                </div>
                <div className="mt-3">
                  <Button variant="outline" onClick={(e) => { e.stopPropagation(); if (m.path) navigate(m.path); }} className="w-full">
                    Accéder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
            {recentActivities.map((activity, index) => (
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