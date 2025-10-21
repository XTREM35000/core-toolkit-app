import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ConditionsEnvironnementList from '@/components/conditions/ConditionsEnvironnementList';

const ConditionsEnvironnement = () => (
  <DashboardLayout>
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">Conditions Environnement</h1>
      <ConditionsEnvironnementList />
    </div>
  </DashboardLayout>
);

export default ConditionsEnvironnement;
