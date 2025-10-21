import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BassinsList from '@/components/bassins/BassinsList';

const BassinsPiscicoles = () => {
  return (
    <DashboardLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Bassins Piscicoles</h1>
        <BassinsList />
      </div>
    </DashboardLayout>
  );
};

export default BassinsPiscicoles;
