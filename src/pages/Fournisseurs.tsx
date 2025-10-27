import React, { useState, useEffect } from 'react';
import { getHelpForPath } from '@/lib/helpMessages';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import CommandeFournisseurModal from '@/components/workflow/CommandeFournisseurModal';
import ReceptionCommandeModal from '@/components/workflow/ReceptionCommandeModal';
import PaiementFournisseurModal from '@/components/workflow/PaiementFournisseurModal';
import CreateProfileModal from '@/components/workflow/CreateProfileModal';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';

const Fournisseurs = () => {
  const [openNew, setOpenNew] = useState(false);
  const [openSupplierModal, setOpenSupplierModal] = useState(false);
  const [openReception, setOpenReception] = useState<{ open: boolean; id?: string | null }>({ open: false });
  const [openPaiement, setOpenPaiement] = useState<{ open: boolean; id?: string | null }>({ open: false });
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['commande_fournisseurs'],
    queryFn: async () => {
      const { data } = await (supabase as any).from('commande_fournisseurs').select('*').order('created_at', { ascending: false });
      return data;
    }
  });

  useEffect(() => { }, []);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.pageHelp = getHelpForPath('/fournisseurs');
    }
    return () => {
      if (typeof document !== 'undefined') delete document.body.dataset.pageHelp;
    };
  }, []);

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Fournisseurs</h2>
          <div>
            <div className="flex gap-2">
              <Button onClick={() => setOpenSupplierModal(true)}>Nouveau fournisseur</Button>
              <Button onClick={() => setOpenNew(true)}>Nouvelle commande</Button>
            </div>
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
                    <th>Prix unitaire</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) && data.map((c: any) => (
                    <tr className="border-t" key={c.id}>
                      <td className="p-2">{c.supplier_name}</td>
                      <td className="p-2">{c.quantity}</td>
                      <td className="p-2">{c.unit_price}</td>
                      <td className="p-2">{c.status}</td>
                      <td className="p-2 text-right">
                        <Button variant="ghost" onClick={() => setOpenReception({ open: true, id: c.id })}>Réception</Button>
                        <Button variant="ghost" onClick={() => setOpenPaiement({ open: true, id: c.id })}>Paiement</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <CommandeFournisseurModal isOpen={openNew} onClose={() => { setOpenNew(false); qc.invalidateQueries({ queryKey: ['commande_fournisseurs'] }); }} onSaved={() => qc.invalidateQueries({ queryKey: ['commande_fournisseurs'] })} />
        <ReceptionCommandeModal isOpen={openReception.open} onClose={() => { setOpenReception({ open: false }); qc.invalidateQueries({ queryKey: ['commande_fournisseurs'] }); }} commandeId={openReception.id} onSaved={() => qc.invalidateQueries({ queryKey: ['commande_fournisseurs'] })} />
        <PaiementFournisseurModal isOpen={openPaiement.open} onClose={() => { setOpenPaiement({ open: false }); qc.invalidateQueries({ queryKey: ['commande_fournisseurs'] }); }} commandeId={openPaiement.id} onSaved={() => qc.invalidateQueries({ queryKey: ['commande_fournisseurs'] })} />
        <CreateProfileModal isOpen={openSupplierModal} onClose={() => { setOpenSupplierModal(false); qc.invalidateQueries({ queryKey: ['profiles', 'suppliers'] }); }} role="supplier" onCreated={() => qc.invalidateQueries({ queryKey: ['profiles', 'suppliers'] })} />
      </div>
    </DashboardLayout>
  );
};

export default Fournisseurs;
