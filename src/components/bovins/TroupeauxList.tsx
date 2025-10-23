import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type Troupeau = { id: string; name: string };

const TroupeauxList: React.FC = () => {
  const [items, setItems] = useState<Troupeau[]>([{ id: 'tr-1', name: 'Troupeau A' }]);
  const add = () => {
    const name = window.prompt('Nom du troupeau');
    if (!name) return;
    setItems((s) => [{ id: `tr-${Date.now()}`, name }, ...s]);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Troupeaux</h3>
        <Button onClick={add}>Ajouter</Button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        {items.map((it) => <div key={it.id} className="py-2 border-b last:border-b-0">{it.name}</div>)}
      </div>
    </div>
  );
};

export default TroupeauxList;
