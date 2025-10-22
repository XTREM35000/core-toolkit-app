import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function BrandingConfig() {
  const { profile: me } = useAuth();
  const toast = useToast();

  const [platformName, setPlatformName] = useState('AquaManager Pro');
  const [primaryColor, setPrimaryColor] = useState('#0ea5a4');
  const [secondaryColor, setSecondaryColor] = useState('#06b6d4');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingSettings, setExistingSettings] = useState<any>(null);

  useEffect(() => {
    // load current branding from tenant settings
    (async () => {
      if (!me?.tenant_id) return;
      try {
        const { data: tenantData, error } = await supabase
          .from('tenants')
          .select('settings, name')
          .eq('id', me.tenant_id)
          .single();

        if (error) throw error;
        const settings = (tenantData as any)?.settings ?? null;
        setExistingSettings(settings);
        if (settings?.branding) {
          setPlatformName(settings.branding.platformName ?? platformName);
          setPrimaryColor(settings.branding.primaryColor ?? primaryColor);
          setSecondaryColor(settings.branding.secondaryColor ?? secondaryColor);
          setLogoPreview(settings.branding.logoUrl ?? null);
          setFaviconPreview(settings.branding.faviconUrl ?? null);
        }
      } catch (err) {
        console.warn('Failed to load tenant settings', err);
      }
    })();
  }, []);

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setLogoPreview(url);
    setLogoFile(f);
  }

  function handleFavicon(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFaviconPreview(url);
    setFaviconFile(f);
  }

  async function handleSave() {
    if (!me?.tenant_id) {
      toast.toast({ title: 'Non autorisé', description: 'Impossible de sauvegarder sans tenant.' });
      return;
    }

    setLoading(true);
    try {
      let logoUrl: string | null = existingSettings?.branding?.logoUrl ?? null;
      let faviconUrl: string | null = existingSettings?.branding?.faviconUrl ?? null;

      // upload logo if changed
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `branding/${me.tenant_id}/logo-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('public').upload(fileName, logoFile as File, { upsert: true } as any);
        if (!uploadError) {
          const { data: publicData } = await supabase.storage.from('public').getPublicUrl(fileName) as any;
          logoUrl = publicData?.publicUrl ?? logoUrl;
        }
      }

      if (faviconFile) {
        const fileExt = faviconFile.name.split('.').pop();
        const fileName = `branding/${me.tenant_id}/favicon-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('public').upload(fileName, faviconFile as File, { upsert: true } as any);
        if (!uploadError) {
          const { data: publicData } = await supabase.storage.from('public').getPublicUrl(fileName) as any;
          faviconUrl = publicData?.publicUrl ?? faviconUrl;
        }
      }

      const newSettings = {
        ...(existingSettings ?? {}),
        branding: {
          platformName,
          primaryColor,
          secondaryColor,
          logoUrl,
          faviconUrl,
        },
      };

      // Upsert tenant row (ensure name present)
      const payload: any = { id: me.tenant_id, name: platformName || (existingSettings?._tenantName ?? 'Tenant'), settings: newSettings };

      const { error: upsertError } = await supabase.from('tenants').upsert(payload);
      if (upsertError) throw upsertError;

      setExistingSettings(newSettings);
      toast.toast({ title: 'Enregistré', description: 'Paramètres de branding sauvegardés.' });
    } catch (err: any) {
      console.error('Failed saving branding', err);
      toast.toast({ title: 'Erreur', description: (err?.message) || 'Impossible de sauvegarder.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Branding & Apparence</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <div className="text-sm mb-1">Nom de la plateforme</div>
          <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
        </label>

        <label className="block">
          <div className="text-sm mb-1">Favicon (upload)</div>
          <input type="file" accept="image/*" className="mt-1" />
        </label>

        <label className="block">
          <div className="text-sm mb-1">Logo personnalisé</div>
          <input type="file" accept="image/*" onChange={handleLogo} />
          {logoPreview && <img src={logoPreview} alt="Logo preview" className="mt-2 h-20" />}
        </label>

        <div className="flex gap-3">
          <div>
            <div className="text-sm mb-1">Couleur primaire</div>
            <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
          </div>
          <div>
            <div className="text-sm mb-1">Couleur secondaire</div>
            <Input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => { /* save branding */ }}>Appliquer</Button>
      </div>
    </Card>
  );
}
