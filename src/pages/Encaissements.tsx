import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EncaissementModal from '@/components/workflow/EncaissementModal';
import { useQueryClient } from '@tanstack/react-query';

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
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Encaissements</h2>
          <Button onClick={() => setOpen(true)}>Ajout Encaissement Client</Button>
        </div>
        <Card className="p-4">
          {isLoading ? <div>Chargement...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Vente ID</th>
                    <th>Montant</th>
                    <th>Méthode</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) && data.map((e: any) => (
                    <tr key={e.id} className="border-t">
                      <td className="p-2">{e.client_name ?? e.client}</td>
                      <td className="p-2">{e.vente_id}</td>
                      <td className="p-2">{typeof e.amount === 'number' ? `${e.amount.toFixed(2)} €` : e.amount}</td>
                      <td className="p-2">{e.method}</td>
                      <td className="p-2">{e.created_at ? new Date(e.created_at).toLocaleString() : e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        <EncaissementModal open={open} onOpenChange={setOpen} onSaved={() => qc.invalidateQueries({ queryKey: ['encaissements'] })} />
      </div>
    </DashboardLayout>
  );
};

export default Encaissements;
