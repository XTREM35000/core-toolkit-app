import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StockAlimentsList from '@/components/stock/StockAlimentsList';

const StockAliments = () => (
  <DashboardLayout>
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">Stock Aliments</h1>
      <StockAlimentsList />
    </div>
  </DashboardLayout>
);

export default StockAliments;
