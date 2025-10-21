import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Farms = () => {
  return (
    <DashboardLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Farms</h1>
        <p>Manage farms and tenants.</p>
      </div>
    </DashboardLayout>
  );
};

export default Farms;
