import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CommandeFournisseurModal from '@/components/workflow/CommandeFournisseurModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

const ListeCommandesPage = () => {
  const [openNew, setOpenNew] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['commande_fournisseurs'],
    queryFn: async () => {
      const { data } = await (supabase as any).from('commande_fournisseurs').select('*').order('created_at', { ascending: false });
      return data;
    }
  });

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Commandes Fournisseurs</h2>
          <div>
            <Button onClick={() => setOpenNew(true)}>Nouvelle Commande</Button>
          </div>
        </div>

        <Card className="p-4">
          {isLoading ? <div>Chargement...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Fournisseur</th>
                    <th>Quantité</th>
                    <th>Prix</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) && data.map((c: any) => (
                    <tr className="border-t" key={c.id}>
                      <td className="p-2">{c.supplier_name}</td>
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

        <CommandeFournisseurModal isOpen={openNew} onClose={() => setOpenNew(false)} onSaved={() => {}} />
      </div>
    </DashboardLayout>
  );
};

export default ListeCommandesPage;
