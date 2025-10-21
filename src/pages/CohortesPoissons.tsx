import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CohortesPoissonsList from '@/components/cohortes/CohortesPoissonsList';

const CohortesPoissons = () => (
  <DashboardLayout>
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">Cohortes Poissons</h1>
      <CohortesPoissonsList />
    </div>
  </DashboardLayout>
);

export default CohortesPoissons;
