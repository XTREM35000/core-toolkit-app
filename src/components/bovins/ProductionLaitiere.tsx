import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type Prod = { id: string; name: string };

const ProductionLaitiere: React.FC = () => {
  const [items, setItems] = useState<Prod[]>([{ id: 'pl-1', name: 'Lait - 2025-10-01' }]);
  const add = () => {
    const name = window.prompt('Désignation');
    if (!name) return;
    setItems((s) => [{ id: `pl-${Date.now()}`, name }, ...s]);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Production laitière</h3>
        <Button onClick={add}>Ajouter</Button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        {items.map((it) => <div key={it.id} className="py-2 border-b last:border-b-0">{it.name}</div>)}
      </div>
    </div>
  );
};

export default ProductionLaitiere;
