import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

const Alerts = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-gradient-to-r from-purple-50 to-white rounded-2xl overflow-hidden shadow-lg">
          <ModalHeader
            title="Alertes"
            subtitle="Gérez les alertes et notifications"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-purple-300" />}
            onClose={() => {}}
          />

          <div className="p-6 bg-white">
            <Card className="p-4">
              <div className="text-sm text-gray-600">Page Alertes - à implémenter: liste des alertes, actions et règles.</div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
