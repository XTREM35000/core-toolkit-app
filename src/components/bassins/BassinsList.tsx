import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import db from '@/integrations/supabase/db';
import BassinsModal from '@/components/bassins/BassinsModal';

const BassinsList = () => {
  const [bassins, setBassins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
  const { data } = await db.selectAll('bassins_piscicoles', { column: 'created_at', ascending: false });
  setBassins((data as any) || []);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div />
        <div className="flex gap-2">
          <Button onClick={() => { setSelected(null); setOpen(true); }}>Créer un bassin</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Nom</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Volume (m3)</th>
                  <th className="text-left">Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bassins.map(b => (
                  <tr key={b.id} className="border-t">
                    <td className="py-2">{b.nom}</td>
                    <td>{b.type_bassin}</td>
                    <td>{b.volume_m3}</td>
                    <td>{b.statut}</td>
                    <td className="text-right">
                      <Button variant="ghost" onClick={() => { setSelected(b); setOpen(true); }}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

  <BassinsModal open={open} onOpenChange={setOpen} bassin={selected} onSaved={() => { setOpen(false); load(); }} />
    </div>
  );
};

export default BassinsList;
