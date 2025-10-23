import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ParcsHelicicolesList from '@/components/parcs/ParcsHelicicolesList';
import CohortesEscargotsList from '@/components/cohortes/CohortesEscargotsList';
import EscargotiereList from '@/components/heliciculture/EscargotiereList';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

const Heliciculture = () => (
  <DashboardLayout>
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg">
        <ModalHeader
          title="Héliciculture"
          subtitle="Gérer vos parcs et escargotières"
          headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-blue-300" />}
          onClose={() => {}}
        />

        <div className="p-6 bg-white">
          <Card className="p-4 mb-6">
            <h3 className="text-lg font-medium mb-2">Parcs</h3>
            <ParcsHelicicolesList />
          </Card>

          <Card className="p-4 mb-6">
            <h3 className="text-lg font-medium mb-2">Escargotières</h3>
            <EscargotiereList />
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Cohortes</h3>
            <CohortesEscargotsList />
          </Card>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default Heliciculture;
