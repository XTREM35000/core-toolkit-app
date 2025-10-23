import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CohortesLapinsList from '../components/cuniculture/CohortesLapinsList';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

const CohortesLapins = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg">
          <ModalHeader
            title="Cohortes Lapins"
            subtitle="Gérer cohortes et cycles"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-blue-300" />}
            onClose={() => { /* noop in page */ }}
          />

          <div className="p-6 bg-white">
            <Card className="p-4">
              <CohortesLapinsList />
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CohortesLapins;
