import React, { useEffect } from 'react';
import { getHelpForPath } from '@/lib/helpMessages';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StockAlimentsList from '@/components/stock/StockAlimentsList';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

const StockAliments = () => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.pageHelp = getHelpForPath('/stock-aliments');
    }
    return () => {
      if (typeof document !== 'undefined') delete document.body.dataset.pageHelp;
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg">
          <ModalHeader
            title="Stock Aliments"
            subtitle="Gérer les stocks d'aliments"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-blue-300" />}
            onClose={() => { }}
          />

          <div className="p-6 bg-white">
            <Card className="p-4">
              <StockAlimentsList />
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StockAliments;
