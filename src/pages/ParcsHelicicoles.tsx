import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ParcsHelicicolesList from '@/components/parcs/ParcsHelicicolesList';

const ParcsHelicicoles = () => (
  <DashboardLayout>
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">Parcs Hélicicoles</h1>
      <ParcsHelicicolesList />
    </div>
  </DashboardLayout>
);

export default ParcsHelicicoles;
