import React, { useRef, useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ParcsHelicicolesList from '@/components/parcs/ParcsHelicicolesList';
import CohortesEscargotsList from '@/components/cohortes/CohortesEscargotsList';
import EscargotiereList from '@/components/heliciculture/EscargotiereList';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import HelpButton from '@/components/ui/HelpButton';
import { MapPin, Shell as ShellIcon, Users } from 'lucide-react';

const SECTIONS = [
  { id: 'parcs', label: 'Parcs' },
  { id: 'escargotieres', label: 'Escargotières' },
  { id: 'cohortes', label: 'Cohortes' }
];

const Heliciculture = ({ initialSection }: { initialSection?: string } = {}) => {
  const [active, setActive] = useState<string>(initialSection || 'parcs');
  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({ parcs: null, escargotieres: null, cohortes: null });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            if (id) setActive(id);
          }
        });
      },
      { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    Object.values(sectionsRef.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  // Sync page-level help message for the global HelpButton to read
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.pageHelp = getHelpText(active) || '';
    }
    return () => {
      if (typeof document !== 'undefined') delete document.body.dataset.pageHelp;
    };
  }, [active]);

  // If the page is opened via a direct route targeting a section, scroll to it on mount
  useEffect(() => {
    if (initialSection) {
      setTimeout(() => scrollTo(initialSection), 200);
    } else if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      if (id) setTimeout(() => scrollTo(id), 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionsRef.current[id];
    if (!el) return;
    // compute offset so the up-arrow sits just below the sticky menu
    const menu = document.querySelector('.heliciculture-top-menu') as HTMLElement | null;
    const menuHeight = menu ? menu.getBoundingClientRect().height : 64;
    const rect = el.getBoundingClientRect();
    const absoluteY = window.scrollY + rect.top - menuHeight - 8; // 8px gap
    window.scrollTo({ top: absoluteY, behavior: 'smooth' });
  };

  const scrollToMenu = () => {
    const container = document.querySelector('.heliciculture-top-menu');
    if (container) (container as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getHelpText = (sectionId: string) => {
    switch (sectionId) {
      case 'parcs':
        return 'Les parcs regroupent plusieurs bassins et escargotières. Ici vous pouvez créer, éditer ou supprimer un parc.';
      case 'escargotieres':
        return 'Les escargotières sont les unités de production. Gérez les paramètres et suivez les mesures.';
      case 'cohortes':
        return "Les cohortes représentent des lots d'animaux suivis dans le temps. Ajoutez la date, le parc associé et la composition.";
      default:
        return '';
    }
  };

  return (

    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg">

          {/* Compact horizontal menu above the header */}
          <div className="px-4 py-2 bg-white border-b heliciculture-top-menu sticky top-0 z-40">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    aria-current={active === s.id}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${active === s.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    {s.id === 'parcs' && <MapPin className="w-4 h-4" />}
                    {s.id === 'escargotieres' && <ShellIcon className="w-4 h-4" />}
                    {s.id === 'cohortes' && <Users className="w-4 h-4" />}
                    <span className="font-medium">{s.label}</span>
                  </button>
                ))}
              </div>

              <div />
            </div>
          </div>
          <ModalHeader
            title="Héliciculture"
            subtitle="Gérer vos parcs et escargotières"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-blue-300" />}
            onClose={() => { }}
            showClose={false}
          />

          <div className="p-6 bg-white space-y-6">
            <div ref={(el) => (sectionsRef.current.parcs = el)} data-section="parcs">
              <div className="flex justify-end mb-2">
                <button aria-label="Remonter au menu" title="Remonter" onClick={scrollToMenu} className="p-1 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 transform rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.293 9.293a1 1 0 011.414 0L9 13.586V3a1 1 0 112 0v10.586l4.293-4.293a1 1 0 011.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
              <Card className="p-4 mb-6">
                <h3 className="text-lg font-medium mb-2">Parcs</h3>
                <ParcsHelicicolesList />
              </Card>
            </div>

            <div ref={(el) => (sectionsRef.current.escargotieres = el)} data-section="escargotieres">
              <div className="flex justify-end mb-2">
                <button aria-label="Remonter au menu" title="Remonter" onClick={scrollToMenu} className="p-1 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 transform rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.293 9.293a1 1 0 011.414 0L9 13.586V3a1 1 0 112 0v10.586l4.293-4.293a1 1 0 011.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
              <Card className="p-4 mb-6">
                <h3 className="text-lg font-medium mb-2">Escargotières</h3>
                <EscargotiereList />
              </Card>
            </div>

            <div ref={(el) => (sectionsRef.current.cohortes = el)} data-section="cohortes">
              <div className="flex justify-end mb-2">
                <button aria-label="Remonter au menu" title="Remonter" onClick={scrollToMenu} className="p-1 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 transform rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.293 9.293a1 1 0 011.414 0L9 13.586V3a1 1 0 112 0v10.586l4.293-4.293a1 1 0 011.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">Cohortes</h3>
                <CohortesEscargotsList />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Heliciculture;
