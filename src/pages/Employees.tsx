import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Employees = () => {
  return (
    <DashboardLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Employees</h1>
        <p>Employee management.</p>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
