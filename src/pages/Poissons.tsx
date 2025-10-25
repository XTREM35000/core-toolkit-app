import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CohortesPoissonsList from '@/components/cohortes/CohortesPoissonsList';
import BassinsList from '@/components/bassins/BassinsList';
import SpeciesList from '@/components/cohortes/SpeciesList';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

const SECTIONS = [
  { id: 'cohortes', label: 'Cohortes' },
  { id: 'bassins', label: 'Bassins' },
  { id: 'especes', label: 'Espèces' }
];

const Poissons = ({ initialSection }: { initialSection?: string } = {}) => {
  const [active, setActive] = useState<string>(initialSection || 'cohortes');
  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({ cohortes: null, bassins: null, especes: null });

  useEffect(() => {
    if (initialSection) {
      setTimeout(() => scrollTo(initialSection), 150);
    } else if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      if (id) setTimeout(() => scrollTo(id), 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionsRef.current[id];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const absoluteY = window.scrollY + rect.top - 80; // reserve some offset for headers
    window.scrollTo({ top: absoluteY, behavior: 'smooth' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-6">
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg">
          <ModalHeader
            title="Poissons"
            subtitle="Gérer cohortes, bassins et espèces"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-blue-300" />}
            onClose={() => { }}
          />

          <div className="p-6 bg-white space-y-6">
            <div ref={(el) => (sectionsRef.current.cohortes = el)} data-section="cohortes">
              <Card className="p-4">
                <CohortesPoissonsList />
              </Card>
            </div>

            <div ref={(el) => (sectionsRef.current.bassins = el)} data-section="bassins">
              <Card className="p-4">
                <BassinsList />
              </Card>
            </div>

            <div ref={(el) => (sectionsRef.current.especes = el)} data-section="especes">
              <Card className="p-4">
                <SpeciesList />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Poissons;
