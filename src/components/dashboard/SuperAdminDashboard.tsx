import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import ProfilesPage from './ProfilesPage';
import CollaboratorsPage from './CollaboratorsPage';

export const SuperAdminDashboard = () => {
  const [view, setView] = useState('profiles');

  const render = () => {
    switch (view) {
      case 'profiles':
        return <ProfilesPage />;
      case 'collaborators':
        return <CollaboratorsPage />;
      default:
        return <ProfilesPage />;
    }
  };

  return (
    <DashboardLayout onNavigate={(k) => setView(k)}>
      {render()}
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
