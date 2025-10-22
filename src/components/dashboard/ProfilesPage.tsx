import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import AdminCreationModal from '@/components/workflow/AdminCreationModal';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';

export const ProfilesPage = () => {
  const [openRoleModal, setOpenRoleModal] = useState<{open: boolean; role?: string}>({ open: false });
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('id,email,full_name,role,created_at').limit(50);
      return data;
    }
  });

  return (
    <DashboardLayout>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Profils</h2>
          <div className="flex gap-2">
            <Button onClick={() => setOpenRoleModal({ open: true, role: 'admin' })}>Créer Admin</Button>
            <Button onClick={() => setOpenRoleModal({ open: true, role: 'vendeur' })}>Créer Vendeur</Button>
            <Button onClick={() => setOpenRoleModal({ open: true, role: 'caissier' })}>Créer Caissier</Button>
          </div>
        </div>

        <Card className="p-4">
          {isLoading && <div>Chargement...</div>}
          {error && <div className="text-red-500">Erreur: {(error as any).message}</div>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Nom</th>
                  <th className="p-3 text-left">Rôle</th>
                  <th className="p-3 text-left">Créé</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.map((p: any) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.id}</td>
                    <td className="p-3">{p.email}</td>
                    <td className="p-3">{p.full_name}</td>
                    <td className="p-3">{p.role}</td>
                    <td className="p-3">{new Date(p.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <AdminCreationModal
          isOpen={openRoleModal.open}
          onClose={() => setOpenRoleModal({ open: false })}
          initialRole={openRoleModal.role as any}
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ['profiles'] });
            setOpenRoleModal({ open: false });
          }}
        />
      </section>
    </DashboardLayout>
  );
};

export default ProfilesPage;
