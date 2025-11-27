import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CommandeFournisseurModal from '@/components/workflow/CommandeFournisseurModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';

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
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-gradient-to-r from-yellow-50 to-white rounded-2xl overflow-hidden shadow-lg">
          <ModalHeader
            title="Commandes — Fournisseurs"
            subtitle="Historique des commandes"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-yellow-300" />}
            onClose={() => { }}
          />

          <div className="p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Commandes Fournisseurs</h2>
              <div>
                <Button onClick={() => setOpenNew(true)} className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg">Nouvelle Commande</Button>
              </div>
            </div>

            <Card className="p-4 border-0 shadow-lg">
              {isLoading ? <div>Chargement...</div> : (
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full text-sm divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-3 text-gray-600">Fournisseur</th>
                        <th className="text-left py-3 px-3 text-gray-600">Quantité</th>
                        <th className="text-left py-3 px-3 text-gray-600">Prix</th>
                        <th className="text-left py-3 px-3 text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(data) && data.map((c: any) => (
                        <tr className="border-t hover:bg-gray-50 dark:hover:bg-gray-800" key={c.id}>
                          <td className="p-3">{c.supplier_name}</td>
                          <td className="p-3">{c.quantity}</td>
                          <td className="p-3">{c.unit_price}</td>
                          <td className="p-3">{c.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <CommandeFournisseurModal isOpen={openNew} onClose={() => setOpenNew(false)} onSaved={() => { }} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ListeCommandesPage;
