import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CohortesEscargotsList from '@/components/cohortes/CohortesEscargotsList';

const CohortesEscargots = () => (
  <DashboardLayout>
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">Cohortes Escargots</h1>
      <CohortesEscargotsList />
    </div>
  </DashboardLayout>
);

export default CohortesEscargots;
