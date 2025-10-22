import React from 'react';
import { Button } from '@/components/ui/button';
import TankForm from './TankForm';

const mock: Array<{ id: string; name: string; capacity: number; type: string }> = [
  { id: '1', name: 'Bac A', capacity: 1200, type: 'poisson' },
  { id: '2', name: 'Bac B', capacity: 800, type: 'escargot' },
];

const TankList: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState(mock);
  const createBtnRef = React.useRef<HTMLButtonElement | null>(null);

  const handleSaved = (tank: { id: string; name: string; capacity: number; type: string }) => {
    setItems((prev) => [tank, ...prev]);
    // restore focus to create button for accessibility
    setTimeout(() => createBtnRef.current?.focus(), 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Bacs</h2>
        <Button ref={createBtnRef as any} onClick={() => setOpen(true)}>Créer un bac</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] table-auto">
          <thead>
            <tr className="text-left">
              <th className="py-2">Nom</th>
              <th className="py-2">Capacité (L)</th>
              <th className="py-2">Type</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="py-2">{t.name}</td>
                <td className="py-2">{t.capacity}</td>
                <td className="py-2">{t.type}</td>
                <td className="py-2">
                  <Button size="sm" variant="ghost" onClick={() => alert('Edit not implemented')}>Éditer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TankForm open={open} onOpenChange={setOpen} onSaved={handleSaved} />
    </div>
  );
};

export default TankList;
