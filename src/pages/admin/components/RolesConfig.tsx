import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Role = { id: string; name: string; permissions: string[] };

export default function RolesConfig() {
  const { profile: me } = useAuth();
  const toast = useToast();

  const [roles, setRoles] = useState<Role[]>([
    { id: 'admin', name: 'Admin', permissions: ['all'] },
    { id: 'editor', name: 'Editor', permissions: ['edit', 'view'] },
  ]);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingSettings, setExistingSettings] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (!me?.tenant_id) return;
      try {
        const { data: tenantData, error } = await supabase.from('tenants').select('settings').eq('id', me.tenant_id).single();
        if (error) throw error;
        const settings = (tenantData as any)?.settings ?? null;
        setExistingSettings(settings);
        if (settings?.roles) {
          setRoles(settings.roles as Role[]);
        }
      } catch (err) {
        console.warn('Failed to load tenant roles', err);
      }
    })();
  }, []);

  function addRole() {
    if (!newRole.trim()) return;
    setRoles((r) => [...r, { id: newRole.toLowerCase().replace(/\s+/g, '-'), name: newRole, permissions: [] }]);
    setNewRole('');
  }

  function removeRole(id: string) {
    setRoles((r) => r.filter((x) => x.id !== id));
  }

  async function handleSave() {
    if (!me?.tenant_id) {
      toast.toast({ title: 'Non autorisé', description: 'Impossible de sauvegarder sans tenant.' });
      return;
    }

    setLoading(true);
    try {
      const newSettings = {
        ...(existingSettings ?? {}),
        roles,
      };

      const payload: any = { id: me.tenant_id, settings: newSettings };
      const { error } = await supabase.from('tenants').upsert(payload);
      if (error) throw error;

      setExistingSettings(newSettings);
      toast.toast({ title: 'Enregistré', description: 'Rôles sauvegardés.' });
    } catch (err: any) {
      console.error('Failed to save roles', err);
      toast.toast({ title: 'Erreur', description: err?.message ?? 'Impossible de sauvegarder.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Rôles & Permissions</h3>

      <div className="mb-4">
        <div className="flex gap-2">
          <Input placeholder="Nom du rôle" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
          <Button onClick={addRole}>Ajouter</Button>
        </div>
      </div>

      <div className="space-y-3">
        {roles.map((r) => (
          <div key={r.id} className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-sm text-muted-foreground">Permissions: {r.permissions.join(', ') || 'Aucune'}</div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => removeRole(r.id)}>Supprimer</Button>
              <Switch defaultChecked={r.id === 'admin'} disabled={r.id === 'admin'} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={loading}>{loading ? 'Enregistrement...' : 'Appliquer'}</Button>
      </div>
    </Card>
  );
}
