import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CohortesPoissonsList from '@/components/cohortes/CohortesPoissonsList';
import BassinsList from '@/components/bassins/BassinsList';
import SpeciesList from '@/components/cohortes/SpeciesList';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

const Poissons = () => {
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
            <Card className="p-4">
              <CohortesPoissonsList />
            </Card>

            <Card className="p-4">
              <BassinsList />
            </Card>

            <Card className="p-4">
              <SpeciesList />
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Poissons;
