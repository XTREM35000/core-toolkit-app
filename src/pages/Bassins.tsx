import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TankList from '@/components/bassins/TankList';

const BassinsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <TankList />
    </DashboardLayout>
  );
};

export default BassinsPage;
