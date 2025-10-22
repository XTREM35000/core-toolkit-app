import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import BrandingConfig from '@/pages/admin/components/BrandingConfig';
import RolesConfig from '@/pages/admin/components/RolesConfig';
import GeneralConfig from '@/pages/admin/components/GeneralConfig';
import ModulesConfig from '@/pages/admin/components/ModulesConfig';
import SecurityConfig from '@/pages/admin/components/SecurityConfig';
import PageHelpButton from '@/components/ui/PageHelpButton';

const sections = [
  { key: 'branding', label: 'Branding & Apparence' },
  { key: 'roles', label: 'Rôles & Permissions' },
  { key: 'general', label: 'Paramètres Généraux' },
  { key: 'modules', label: 'Modules Métier' },
  { key: 'security', label: 'Sécurité & Accès' },
  { key: 'notifications', label: 'Notifications' },
];

export default function ConfigurationPlateforme() {
  const [active, setActive] = useState<string>('branding');

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl overflow-hidden shadow">
        <ModalHeader
          title="Configuration Plateforme"
          subtitle="Panneau de configuration Super Admin"
          onClose={() => { /* no-op on page */ }}
        />

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-64 bg-gray-50 p-4 rounded-lg">
              <nav className="space-y-2">
                {sections.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActive(s.key)}
                    className={`block w-full text-left px-3 py-2 rounded-md ${active === s.key ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                    {s.label}
                  </button>
                ))}
              </nav>
            </aside>

            <section className="flex-1">
              {active === 'branding' && <BrandingConfig />}
              {active === 'roles' && <RolesConfig />}
              {active === 'general' && <GeneralConfig />}
              {active === 'modules' && <ModulesConfig />}
              {active === 'security' && <SecurityConfig />}
              {active === 'notifications' && <div>Notifications (à implémenter)</div>}
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
