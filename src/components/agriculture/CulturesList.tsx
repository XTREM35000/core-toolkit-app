import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type Culture = { id: string; name: string };

const CulturesList: React.FC = () => {
  const [items, setItems] = useState<Culture[]>([{ id: 'cu-1', name: 'Maïs' }]);
  const add = () => {
    const name = window.prompt('Nom de la culture');
    if (!name) return;
    setItems((s) => [{ id: `cu-${Date.now()}`, name }, ...s]);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Cultures</h3>
        <Button onClick={add}>Ajouter</Button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        {items.map((it) => <div key={it.id} className="py-2 border-b last:border-b-0">{it.name}</div>)}
      </div>
    </div>
  );
};

export default CulturesList;
