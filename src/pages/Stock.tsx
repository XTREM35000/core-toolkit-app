import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Stock = () => {
  return (
    <DashboardLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Stock</h1>
        <p>Stock and inventory management.</p>
      </div>
    </DashboardLayout>
  );
};

export default Stock;
