import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EncaissementModal from '@/components/workflow/EncaissementModal';
import { useQueryClient } from '@tanstack/react-query';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';

const Encaissements = () => {
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['encaissements'],
    queryFn: async () => {
      const { data } = await (supabase as any).from('encaissements').select('*').order('created_at', { ascending: false });
      return data;
    }
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-gradient-to-r from-indigo-50 to-white rounded-2xl overflow-hidden shadow-lg">
          <ModalHeader
            title="Encaissements"
            subtitle="Enregistrer et suivre les paiements clients"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-indigo-300" />}
            onClose={() => { }}
          />

          <div className="p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Encaissements</h2>
              <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg">Ajout Encaissement Client</Button>
            </div>

            <Card className="p-4 border-0 shadow-lg">
              {isLoading ? <div>Chargement...</div> : (
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full text-sm divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-3 text-gray-600">Client</th>
                        <th className="text-left py-3 px-3 text-gray-600">Vente ID</th>
                        <th className="text-left py-3 px-3 text-gray-600">Montant</th>
                        <th className="text-left py-3 px-3 text-gray-600">Méthode</th>
                        <th className="text-left py-3 px-3 text-gray-600">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(data) && data.map((e: any) => (
                        <tr key={e.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-3">{e.client_name ?? e.client}</td>
                          <td className="p-3">{e.vente_id}</td>
                          <td className="p-3">{typeof e.amount === 'number' ? `${e.amount.toFixed(2)} €` : e.amount}</td>
                          <td className="p-3">{e.method}</td>
                          <td className="p-3">{e.created_at ? new Date(e.created_at).toLocaleString() : e.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <EncaissementModal open={open} onOpenChange={setOpen} onSaved={() => qc.invalidateQueries({ queryKey: ['encaissements'] })} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Encaissements;
