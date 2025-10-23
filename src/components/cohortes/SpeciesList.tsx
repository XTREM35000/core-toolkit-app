import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const SpeciesList: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // Select distinct species from cohortes_poissons or poissons
      const { data } = await (supabase as any)
        .from('cohortes_poissons')
        .select('espece') as any;
      const list = Array.isArray(data) ? Array.from(new Set(data.map((r: any) => r.espece).filter(Boolean))) : [];
      setItems(list);
    } catch (e) {
      console.error('load species', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Espèces</h3>
        <div>
          <Button onClick={load}>Rafraîchir</Button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.length === 0 ? (
              <div className="text-sm text-gray-500">Aucune espèce trouvée.</div>
            ) : (
              items.map(s => (
                <div key={s} className="p-3 border rounded-md">
                  <div className="font-medium">{s}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeciesList;
