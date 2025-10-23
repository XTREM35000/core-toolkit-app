import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ParcellesList from '../components/agriculture/ParcellesList';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

const Parcelles = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg">
          <ModalHeader
            title="Parcelles"
            subtitle="Gérer vos parcelles"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-blue-300" />}
            onClose={() => { /* noop in page */ }}
          />

          <div className="p-6 bg-white">
            <Card className="p-4">
              <ParcellesList />
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Parcelles;
