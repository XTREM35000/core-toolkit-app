import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Activities = () => {
  return (
    <DashboardLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Activities</h1>
        <p>Activity log will be shown here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Activities;
