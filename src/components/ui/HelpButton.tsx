import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HelpButtonProps {
  pageName?: string; // can be a pathname like '/profile'
  position?: string; // optional extra class for positioning
}

const messages: Record<string, string> = {
  profile: "Page de gestion de votre profil. Modifiez vos informations personnelles, téléchargez une photo, et cliquez sur Enregistrer pour sauvegarder.",
  bassins: "Gestion des bassins piscicoles. Créez, modifiez ou supprimez vos bassins. Assignez des cohortes de poissons et suivez leur évolution.",
  'cohortes-escargots': "Gestion des cohortes d'escargots : suivez les lots, les entrées/sorties et l'état des parcelles.",
  'cohortes-poissons': "Gestion des cohortes de poissons : surveillez la croissance, effectuez des traitements et planifiez les transferts.",
  commandes: "Page des commandes : créez et suivez les commandes fournisseurs et clients.",
  ventes: "Gestion des ventes : enregistrez de nouvelles ventes, suivez les statuts et exportez les rapports.",
  collaborators: "Liste des collaborateurs : invitez de nouveaux membres, définissez des rôles et gérez les accès.",
  analytics: "Tableau de bord analytique : consultez les indicateurs clés et filtrez par période.",
  'admin/config': "Configuration administrateur : paramétrez les options globales et gérez les rôles et autorisations.",
};

function resolveKey(path?: string) {
  if (!path) return 'default';
  const p = path.toLowerCase();
  if (p.startsWith('/profile')) return 'profile';
  if (p.includes('bassin') || p.includes('bassins')) return 'bassins';
  if (p.includes('cohortes') && p.includes('escargot')) return 'cohortes-escargots';
  if (p.includes('cohortes') && p.includes('poisson')) return 'cohortes-poissons';
  if (p.includes('commandes')) return 'commandes';
  if (p.includes('ventes')) return 'ventes';
  if (p.includes('collaborator') || p.includes('collaborators')) return 'collaborators';
  if (p.includes('analytics')) return 'analytics';
  if (p.includes('admin') && p.includes('config')) return 'admin/config';
  return 'default';
}

const HelpButton: React.FC<HelpButtonProps> = ({ pageName, position }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const key = resolveKey(pageName);
  const message = messages[key] ?? "Besoin d'aide ? Cliquez ici pour des conseils rapides sur cette page.";

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${position ?? ''}`}>
      <button
        aria-label="Aide contextuelle"
        title="Aide"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-1 ring-blue-700/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <span className="text-sm font-semibold">?</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 md:w-80 z-50">
          <Card className="p-3 shadow-lg border">
            <div className="text-sm text-gray-800 mb-3">{message}</div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setOpen(false)}>Compris</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HelpButton;
