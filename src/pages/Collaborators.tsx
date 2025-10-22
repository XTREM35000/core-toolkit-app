import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CollaboratorsPage from '@/components/dashboard/CollaboratorsPage';

const Collaborators: React.FC = () => {
  return (
    <DashboardLayout>
      <CollaboratorsPage />
    </DashboardLayout>
  );
};

export default Collaborators;
