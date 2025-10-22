import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VenteClientModal from '@/components/workflow/VenteClientModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

const ListeVentesPage = () => {
  const [openNew, setOpenNew] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['ventes_clients'],
    queryFn: async () => {
      const { data } = await (supabase as any).from('ventes_clients').select('*').order('created_at', { ascending: false });
      return data;
    }
  });

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ventes Clients</h2>
          <div>
            <Button onClick={() => setOpenNew(true)}>Nouvelle Vente</Button>
          </div>
        </div>

        <Card className="p-4">
          {isLoading ? <div>Chargement...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Quantité</th>
                    <th>Prix</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) && data.map((c: any) => (
                    <tr className="border-t" key={c.id}>
                      <td className="p-2">{c.client_name}</td>
                      <td className="p-2">{c.quantity}</td>
                      <td className="p-2">{c.unit_price}</td>
                      <td className="p-2">{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <VenteClientModal isOpen={openNew} onClose={() => setOpenNew(false)} onSaved={() => {}} />
      </div>
    </DashboardLayout>
  );
};

export default ListeVentesPage;
