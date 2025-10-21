import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Ponds = () => {
  return (
    <DashboardLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Ponds</h1>
        <p>Manage ponds and basins.</p>
      </div>
    </DashboardLayout>
  );
};

export default Ponds;
