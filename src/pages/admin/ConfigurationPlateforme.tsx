import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import BrandingConfig from '@/pages/admin/components/BrandingConfig';
import RolesConfig from '@/pages/admin/components/RolesConfig';
import GeneralConfig from '@/pages/admin/components/GeneralConfig';
import ModulesConfig from '@/pages/admin/components/ModulesConfig';
import SecurityConfig from '@/pages/admin/components/SecurityConfig';
import PageHelpButton from '@/components/ui/PageHelpButton';

import {
  Brush,
  ShieldCheck,
  Settings2,
  Boxes,
  BellRing,
  Users
} from "lucide-react";

const sections = [
  { key: 'branding', label: 'Branding & Apparence', icon: Brush },
  { key: 'roles', label: 'Rôles & Permissions', icon: Users },
  { key: 'general', label: 'Paramètres Généraux', icon: Settings2 },
  { key: 'modules', label: 'Modules Métier', icon: Boxes },
  { key: 'security', label: 'Sécurité & Accès', icon: ShieldCheck },
  { key: 'notifications', label: 'Notifications', icon: BellRing },
];

export default function ConfigurationPlateforme() {
  const [active, setActive] = useState<string>('branding');

  useEffect(() => {
    const activeSection = sections.find(s => s.key === active);
    if (activeSection) document.title = `${activeSection.label} | Configuration MultiFarm`;
  }, [active]);

  return (
    <DashboardLayout>
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden">
        <ModalHeader
          title="Configuration Plateforme"
          subtitle="Panneau de configuration Super Admin"
          onClose={() => { /* no-op */ }}
        />

        {/* Floating help button */}
        <div className="absolute top-4 right-4 animate-in fade-in slide-in-from-top">
          <PageHelpButton tooltip="Aide & Support" />
        </div>

        <div className="p-8 bg-gradient-to-br from-emerald-50/60 to-white">
          <div className="flex flex-col md:flex-row gap-8">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-72 bg-white rounded-xl p-4 shadow-md border border-emerald-100">
              <nav className="space-y-2">
                {sections.map((s) => {
                  const Icon = s.icon;
                  const isActive = active === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setActive(s.key)}
                      aria-label={s.label}
                      role="tab"
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm
                        transition-all duration-200 transform
                        ${isActive
                          ? "bg-emerald-600 text-white shadow-md border-l-4 border-l-lime-400 scale-[1.03]"
                          : "text-gray-700 hover:bg-emerald-50 hover:scale-[1.01]"
                        }
                        focus:outline-none focus:ring-2 focus:ring-emerald-400/60
                      `}
                    >
                      <Icon
                        className={`
                          h-5 w-5 transition-transform duration-300
                          ${isActive ? "text-white rotate-6" : "text-emerald-600 group-hover:rotate-3"}
                        `}
                      />
                      {s.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Content section */}
            <section className="flex-1 animate-in fade-in duration-300">
              {active === 'branding' && <BrandingConfig />}
              {active === 'roles' && <RolesConfig />}
              {active === 'general' && <GeneralConfig />}
              {active === 'modules' && <ModulesConfig />}
              {active === 'security' && <SecurityConfig />}
              {active === 'notifications' && (
                <div className="text-gray-600 p-6 border rounded-lg shadow-sm bg-white/50">
                  Notifications (à implémenter)
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
