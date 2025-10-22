import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreateProfileModal from '@/components/workflow/CreateProfileModal';

const Clients = () => {
  const [openNew, setOpenNew] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['profiles','clients'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').ilike('role','%client%').limit(200);
      return data;
    }
  });

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Clients</h2>
          <div>
            <Button onClick={() => setOpenNew(true)}>Nouveau client</Button>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

  <CreateProfileModal isOpen={openNew} onClose={() => { setOpenNew(false); qc.invalidateQueries({ queryKey: ['profiles','clients'] }); }} role="client" onCreated={() => qc.invalidateQueries({ queryKey: ['profiles','clients'] })} />
      </div>
    </DashboardLayout>
  );
};

export default Clients;
