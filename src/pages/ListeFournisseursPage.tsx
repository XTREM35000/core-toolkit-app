import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreateProfileModal from '@/components/workflow/CreateProfileModal';
import { useAuth } from '@/components/workflow/AdminCreationModal';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';

const ListeFournisseursPage = () => {
  const [openNew, setOpenNew] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const qc = useQueryClient();
  const { profile: me } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['profiles', 'suppliers'],
    queryFn: async () => {
      const { data } = await (supabase as any).from('profiles').select('*').ilike('role', '%supplier%').limit(500);
      return data;
    }
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-gradient-to-r from-rose-50 to-white rounded-2xl overflow-hidden shadow-lg">
          <ModalHeader
            title="Contacts — Fournisseurs"
            subtitle="Liste des fournisseurs"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-rose-300" />}
            onClose={() => { }}
          />

          <div className="p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Fournisseurs</h2>
              <div>
                <Button onClick={() => setOpenNew(true)} className="bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg">Ajouter un Fournisseur</Button>
              </div>
            </div>

            <Card className="p-4 border-0 shadow-lg">
              {isLoading ? <div>Chargement...</div> : (
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full text-sm divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-3 text-gray-600">Nom</th>
                        <th className="text-left py-3 px-3 text-gray-600">Email</th>
                        <th className="text-left py-3 px-3 text-gray-600">Téléphone</th>
                        <th className="text-right py-3 px-3 text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(data) && data.map((c: any) => (
                        <tr className="border-t hover:bg-gray-50 dark:hover:bg-gray-800" key={c.id}>
                          <td className="p-3">{c.full_name}</td>
                          <td className="p-3">{c.email}</td>
                          <td className="p-3">{c.phone}</td>
                          <td className="p-3 text-right">
                            <button className="text-sm text-blue-600 hover:underline" onClick={() => setEditing(c)}>Modifier</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <CreateProfileModal tenantId={me?.tenant_id ?? null} isOpen={openNew} onClose={() => { setOpenNew(false); qc.invalidateQueries({ queryKey: ['profiles', 'suppliers'] }); }} role="supplier" onCreated={() => qc.invalidateQueries({ queryKey: ['profiles', 'suppliers'] })} />
            <CreateProfileModal tenantId={me?.tenant_id ?? null} isOpen={!!editing} existing={editing} onClose={() => { setEditing(null); qc.invalidateQueries({ queryKey: ['profiles', 'suppliers'] }); }} role="supplier" onCreated={() => qc.invalidateQueries({ queryKey: ['profiles', 'suppliers'] })} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ListeFournisseursPage;
