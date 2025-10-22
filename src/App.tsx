import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AppInitialization } from "./components/onboarding/AppInitialization";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import SuperAdminDashboard from "./components/dashboard/SuperAdminDashboard";
import ConfigurationPlateforme from './pages/admin/ConfigurationPlateforme';
import Activities from "./pages/Activities";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Stock from "./pages/Stock";
import Ponds from "./pages/Ponds";
import Parks from "./pages/Parks";
import FishCohorts from "./pages/FishCohorts";
import SnailCohorts from "./pages/SnailCohorts";
import SplashScreen from './components/SplashScreen';
import Farms from "./pages/Farms";
import BassinsPiscicoles from "./pages/BassinsPiscicoles";
import Bassins from "./pages/Bassins";
import CohortesPoissons from "./pages/CohortesPoissons";
import CohortesEscargots from "./pages/CohortesEscargots";
import ParcsHelicicoles from "./pages/ParcsHelicicoles";
import StockAliments from "./pages/StockAliments";
import ConditionsEnvironnement from "./pages/ConditionsEnvironnement";
import Security from "./pages/Security";
import Reports from "./pages/Reports";
import Help from './pages/Help';
import Fournisseurs from './pages/Fournisseurs';
import Ventes from './pages/Ventes';
import Encaissements from './pages/Encaissements';
import Profile from './pages/Profile';
import CollaboratorsAdd from './pages/CollaboratorsAdd';
import Collaborators from './pages/Collaborators';
import ListeCommandesPage from './pages/ListeCommandesPage';
import ListeClientsPage from './pages/ListeClientsPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // L'app est prête après le splash screen
    setAppReady(true);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {/* AppInitialization fonctionne en arrière-plan */}
              <AppInitialization />
              
              {/* Routes principales toujours visibles */}
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/admin" element={<SuperAdminDashboard />} />
                <Route path="/admin/config" element={<ConfigurationPlateforme />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/bassins-piscicoles" element={<BassinsPiscicoles />} />
                <Route path="/bassins" element={<Bassins />} />
                <Route path="/cohortes-poissons" element={<CohortesPoissons />} />
                <Route path="/cohortes-escargots" element={<CohortesEscargots />} />
                <Route path="/parcs-helicicoles" element={<ParcsHelicicoles />} />
                <Route path="/stock-aliments" element={<StockAliments />} />
                <Route path="/conditions-environnement" element={<ConditionsEnvironnement />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/ponds" element={<Ponds />} />
                <Route path="/parks" element={<Parks />} />
                <Route path="/fish-cohorts" element={<FishCohorts />} />
                <Route path="/snail-cohorts" element={<SnailCohorts />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/collaborators/add" element={<CollaboratorsAdd />} />
                <Route path="/collaborators" element={<Collaborators />} />
                <Route path="/farms" element={<Farms />} />
                <Route path="/security" element={<Security />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/help" element={<Help />} />
                <Route path="/commandes" element={<ListeCommandesPage />} />
                <Route path="/fournisseurs" element={<Fournisseurs />} />
                <Route path="/clients" element={<ListeClientsPage />} />
                <Route path="/ventes" element={<Ventes />} />
                <Route path="/encaissements" element={<Encaissements />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;