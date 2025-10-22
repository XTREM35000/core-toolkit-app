import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreateProfileModal from '@/components/workflow/CreateProfileModal';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/workflow/AdminCreationModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ListeClientsPage = () => {
  const [openNew, setOpenNew] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const qc = useQueryClient();
  const { profile: me } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['profiles','clients'],
    queryFn: async () => {
      const { data } = await (supabase as any).from('profiles').select('*').ilike('role','%client%').limit(500);
      return data;
    }
  });

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Clients</h2>
          <div>
            <Button onClick={() => setOpenNew(true)}>Ajouter un Client</Button>
          </div>
        </div>

        <Card className="p-4">
          {isLoading ? <div>Chargement...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) && data.map((c: any) => (
                    <tr className="border-t" key={c.id}>
                      <td className="p-2">{c.full_name}</td>
                      <td className="p-2">{c.email}</td>
                      <td className="p-2">{c.phone}</td>
                      <td className="p-2 text-right">
                        <button className="text-sm text-blue-600" onClick={() => setEditing(c)}>Modifier</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        <CreateProfileModal tenantId={me?.tenant_id ?? null} isOpen={openNew} onClose={() => { setOpenNew(false); qc.invalidateQueries({ queryKey: ['profiles','clients'] }); }} role="client" onCreated={() => qc.invalidateQueries({ queryKey: ['profiles','clients'] })} />
        <CreateProfileModal tenantId={me?.tenant_id ?? null} isOpen={!!editing} existing={editing} onClose={() => { setEditing(null); qc.invalidateQueries({ queryKey: ['profiles','clients'] }); }} role="client" onCreated={() => qc.invalidateQueries({ queryKey: ['profiles','clients'] })} />
      </div>
    </DashboardLayout>
  );
};

export default ListeClientsPage;
