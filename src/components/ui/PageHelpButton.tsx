import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  pageId?: string;
}

const MESSAGES: Record<string, string> = {
  '/activities': "Suivi des activités récentes de l'exploitation. Consultez les dernières actions et notifications.",
  '/bassins-piscicoles': 'Gestion des bassins piscicoles : création, modification, suivi des cohorts et paramètres.',
  '/cohortes-poissons': 'Gestion des cohortes de poissons : suivi de la croissance, santé et mouvements.',
  '/cohortes-escargots': "Gestion des cohortes d'escargots : reproduction, élevage et suivi des lots.",
  '/parcs-helicicoles': 'Gestion des parcs hélicicoles : paramètres, suivi et maintenance.',
  '/stock-aliments': "Gestion du stock d'aliments : inventaire, mouvements et approvisionnements.",
  '/conditions-environnement': 'Monitoring des conditions environnementales : capteurs et historiques.',
  '/commandes': 'Gestion des commandes fournisseurs : création et suivi des réceptions.',
  '/ventes': 'Gestion des ventes clients : créer et suivre les commandes et facturations.',
  '/encaissements': 'Suivi des encaissements et trésorerie : enregistrement des paiements.',
  '/alerts': "Centre d'alertes : consultez et gérez les notifications importantes.",
  '/analytics': 'Tableaux de bord et analyses : visualisez les indicateurs clés de performance.',
  '/reports': 'Génération de rapports et exports : exportez les données nécessaires.',
  '/employees': "Gestion des employés et collaborateurs (Admin) : rôles et accès.",
  '/farms': 'Gestion multi-fermes (Admin) : paramètres et accès multi-site.',
  '/fournisseurs': "Gestion des fournisseurs (Admin) : contacts et historique d'achats.",
  '/clients': 'Gestion de la clientèle (Admin) : fiches clients et historiques.',
  '/profiles': "Gestion des profils utilisateurs (Admin) : mettez à jour les informations utilisateur.",
  '/security': "Paramètres de sécurité (Admin) : règles d'accès et authentification.",
  '/settings': "Paramètres généraux de l'application : configuration et préférences."
};

function resolveMessage(pathname?: string): string | undefined {
  if (!pathname) return undefined;
  
  const normalizedPath = pathname.toLowerCase();
  
  // Match exact path first
  if (MESSAGES[normalizedPath]) return MESSAGES[normalizedPath];
  
  // Then try partial matches
  if (normalizedPath.includes('bassins')) return MESSAGES['/bassins-piscicoles'];
  if (normalizedPath.includes('cohortes') && normalizedPath.includes('poissons')) return MESSAGES['/cohortes-poissons'];
  if (normalizedPath.includes('cohortes') && normalizedPath.includes('escargots')) return MESSAGES['/cohortes-escargots'];
  if (normalizedPath.includes('commandes')) return MESSAGES['/commandes'];
  if (normalizedPath.includes('ventes')) return MESSAGES['/ventes'];
  if (normalizedPath.includes('encaissements')) return MESSAGES['/encaissements'];
  if (normalizedPath.includes('analytics')) return MESSAGES['/analytics'];
  if (normalizedPath.includes('reports')) return MESSAGES['/reports'];
  if (normalizedPath.includes('employees')) return MESSAGES['/employees'];
  if (normalizedPath.includes('farms')) return MESSAGES['/farms'];
  if (normalizedPath.includes('fournisseurs')) return MESSAGES['/fournisseurs'];
  if (normalizedPath.includes('clients')) return MESSAGES['/clients'];
  if (normalizedPath.includes('profiles')) return MESSAGES['/profiles'];
  if (normalizedPath.includes('security')) return MESSAGES['/security'];
  if (normalizedPath.includes('settings')) return MESSAGES['/settings'];
  if (normalizedPath.includes('alerts')) return MESSAGES['/alerts'];
  
  return undefined;
}

const PageHelpButton: React.FC<Props> = ({ pageId }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const message = resolveMessage(pageId) ?? "Besoin d'aide ? Cliquez pour obtenir des conseils rapides sur cette page.";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Desktop & Mobile - Single consistent button */}
      <button
        aria-label="Aide"
        title="Aide"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-1 ring-blue-700/20 cursor-pointer transform-gpu transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 active:translate-y-[1px]"
      >
        <span className="text-sm font-semibold">?</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 md:w-80 z-50">
          <Card className="p-3 shadow-lg border">
            <div className="text-sm text-gray-800 mb-3">{message}</div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Compris
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PageHelpButton;