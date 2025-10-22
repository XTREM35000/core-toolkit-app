import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function ModulesConfig() {
  const [modules, setModules] = useState({
    heliciculture: true,
    pisciculture: true,
    commercialisation: false,
    comptabilite: false,
    analytics: false,
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Modules Métier</h3>
      <div className="space-y-3">
        {Object.entries(modules).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between p-3 border rounded-md">
            <div className="capitalize">{k.replace(/_/g, ' ')}</div>
            <Switch checked={v} onCheckedChange={(val) => setModules((m) => ({ ...m, [k]: !!val }))} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button className="btn">Appliquer</button>
      </div>
    </Card>
  );
}
