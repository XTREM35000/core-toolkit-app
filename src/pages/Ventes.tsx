import React, { useState, useEffect } from 'react';
import { getHelpForPath } from '@/lib/helpMessages';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import VenteClientModal from '@/components/workflow/VenteClientModal';
import EncaissementModal from '@/components/workflow/EncaissementModal';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { supabase } from '@/integrations/supabase/client';

const Ventes = () => {
  const [openNew, setOpenNew] = useState(false);
  const [openEncaisse, setOpenEncaisse] = useState<{ open: boolean; id?: string | null }>({ open: false });
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['ventes_clients'],
    queryFn: async () => {
      const { data } = await (supabase as any).from('ventes_clients').select('*').order('created_at', { ascending: false });
      return data;
    }
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.pageHelp = getHelpForPath('/ventes');
    }
    return () => {
      if (typeof document !== 'undefined') delete document.body.dataset.pageHelp;
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-6 space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-white rounded-2xl overflow-hidden shadow-lg">

          <ModalHeader
            title="Ventes"
            subtitle="Gérer vos ventes et encaissements"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-green-300" />}
            onClose={() => { }}
            showClose={false}
          />

          <div className="p-6 bg-white space-y-6">
            <div className="flex justify-between items-center">
              <div />
              <Button onClick={() => setOpenNew(true)}>Nouvelle vente</Button>
            </div>

            <Card className="p-4">
              {isLoading ? <div>Chargement...</div> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(data) && data.map((v: any) => (
                        <tr className="border-t" key={v.id}>
                          <td className="p-2">{v.client_name}</td>
                          <td className="p-2">{v.quantity}</td>
                          <td className="p-2">{v.unit_price}</td>
                          <td className="p-2">{v.status}</td>
                          <td className="p-2 text-right">
                            <Button variant="ghost" onClick={() => setOpenEncaisse({ open: true, id: v.id })}>Encaisser</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <VenteClientModal isOpen={openNew} onClose={() => { setOpenNew(false); qc.invalidateQueries({ queryKey: ['ventes_clients'] }); }} onSaved={() => qc.invalidateQueries({ queryKey: ['ventes_clients'] })} />
            <EncaissementModal isOpen={openEncaisse.open} onClose={() => { setOpenEncaisse({ open: false }); qc.invalidateQueries({ queryKey: ['ventes_clients'] }); }} venteId={openEncaisse.id} onSaved={() => qc.invalidateQueries({ queryKey: ['ventes_clients'] })} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};


export default Ventes;
