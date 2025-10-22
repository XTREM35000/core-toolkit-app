import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function SecurityConfig() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Sécurité & Accès</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>2FA obligatoire</div>
          <Switch defaultChecked={false} />
        </div>
        <div className="flex items-center justify-between">
          <div>Durée de session (minutes)</div>
          <input className="input w-24" defaultValue={60} />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button>Appliquer</Button>
      </div>
    </Card>
  );
}
