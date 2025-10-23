import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogoPoisson from '@/components/AnimatedLogoPoisson';
import { getTenantId } from '@/services/tenantService';
import { Card } from '@/components/ui/card';

const EscargotiereModal = ({ open, onOpenChange, parc, onSaved }: any) => {
  const [form, setForm] = useState<any>({ nom: '', type: 'Reproduction', dimensions: 0, substrat: '', date_installation: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (parc) setForm({ nom: parc.nom ?? '', type: parc.type ?? 'Reproduction', dimensions: parc.dimensions ?? '', substrat: parc.substrat ?? '', date_installation: parc.date_installation ?? '' });
    else setForm({ nom: '', type: 'Reproduction', dimensions: '', substrat: '', date_installation: '' });
  }, [parc, open]);

  useEffect(() => { if (firstRef.current) setTimeout(() => firstRef.current?.focus(), 50); }, []);

  const save = async () => {
    if (!form.nom) { setError('Le nom est requis'); return; }
    setLoading(true);
    try {
      const tenantId = await getTenantId();
      const payload: any = { ...form, dimensions: Number(form.dimensions) || 0, updated_at: new Date().toISOString() };
      if (tenantId) payload.tenant_id = tenantId;
      if (parc?.id) {
        await (supabase as any).from('escargoteres').update(payload).eq('id', parc.id);
      } else {
        if (!payload.created_at) payload.created_at = new Date().toISOString();
        await (supabase as any).from('escargoteres').insert(payload);
      }
      onSaved && onSaved();
      onOpenChange(false);
    } catch (e: any) {
      console.error('Save escargotiere', e);
      setError(e?.message || 'Erreur');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!parc?.id) return;
    if (!window.confirm('Supprimer cette escargotière ?')) return;
    try { await (supabase as any).from('escargoteres').delete().eq('id', parc.id); onSaved && onSaved(); onOpenChange(false);} catch(e){console.error(e);} 
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-50 overflow-hidden">
  <ModalHeader title={parc ? 'Éditer Escargotière' : 'Nouvelle Escargotière'} subtitle="Détails de l'escargotière" headerLogo={<AnimatedLogoPoisson size={36} />} onClose={() => onOpenChange(false)} />
        <div className="p-6">
          <Card className="p-4">
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Nom</label>
                <Input ref={firstRef} value={form.nom} onChange={(e:any) => setForm({ ...form, nom: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm">Type</label>
                <select className="w-full border rounded px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option>Reproduction</option>
                  <option>Elevage</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm">Dimensions</label>
              <Input value={form.dimensions} onChange={(e:any) => setForm({ ...form, dimensions: e.target.value })} />
            </div>

            <div className="mt-4">
              <label className="block text-sm">Substrat</label>
              <Input value={form.substrat} onChange={(e:any) => setForm({ ...form, substrat: e.target.value })} />
            </div>

            <div className="mt-4">
              <label className="block text-sm">Date d'installation</label>
              <Input type="date" value={form.date_installation} onChange={(e:any) => setForm({ ...form, date_installation: e.target.value })} />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              {parc?.id && <Button variant="ghost" className="text-red-600" onClick={handleDelete}>Supprimer</Button>}
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={save} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EscargotiereModal;
