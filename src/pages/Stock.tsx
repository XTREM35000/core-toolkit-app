import React, { useEffect } from 'react';
import { getHelpForPath } from '@/lib/helpMessages';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Stock = () => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.pageHelp = getHelpForPath('/stock');
    }
    return () => {
      if (typeof document !== 'undefined') delete document.body.dataset.pageHelp;
    };
  }, []);
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
