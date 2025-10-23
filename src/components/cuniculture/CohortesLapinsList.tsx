import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type Cohorte = { id: string; name: string };

const CohortesLapinsList: React.FC = () => {
  const [items, setItems] = useState<Cohorte[]>([{ id: 'cl-1', name: 'Cohorte 1' }]);
  const add = () => {
    const name = window.prompt('Nom de la cohorte');
    if (!name) return;
    setItems((s) => [{ id: `cl-${Date.now()}`, name }, ...s]);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Cohortes de lapins</h3>
        <Button onClick={add}>Ajouter</Button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        {items.map((it) => <div key={it.id} className="py-2 border-b last:border-b-0">{it.name}</div>)}
      </div>
    </div>
  );
};

export default CohortesLapinsList;
