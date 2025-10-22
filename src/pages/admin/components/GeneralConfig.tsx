import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function GeneralConfig() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Paramètres Généraux</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label>
          <div className="text-sm mb-1">Devise par défaut</div>
          <select className="input w-full">
            <option>€</option>
            <option>$</option>
            <option>XOF</option>
          </select>
        </label>

        <label>
          <div className="text-sm mb-1">Unités</div>
          <select className="input w-full">
            <option>kg</option>
            <option>g</option>
            <option>litres</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <Button>Appliquer</Button>
      </div>
    </Card>
  );
}
