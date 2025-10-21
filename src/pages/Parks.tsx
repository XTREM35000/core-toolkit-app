import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Parks = () => {
  return (
    <DashboardLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Parks</h1>
        <p>Manage parks and reproduction areas.</p>
      </div>
    </DashboardLayout>
  );
};

export default Parks;
