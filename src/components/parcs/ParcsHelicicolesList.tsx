

import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';
import ConfirmModal from '@/components/ui/ConfirmModal';

type Parc = any;

type ParcHelicicoleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parc: Parc | null;
  onSaved?: () => void;
};

// using shared ConfirmModal from ui

const ParcHelicicoleModal = ({ open, onOpenChange, parc, onSaved }: ParcHelicicoleModalProps) => {
  const [form, setForm] = useState<any>({ nom: '', superficie_m2: '', statut: 'actif' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (parc) setForm({ nom: parc.nom ?? '', superficie_m2: parc.superficie_m2 ?? '', statut: parc.statut ?? 'actif' });
    else setForm({ nom: '', superficie_m2: '', statut: 'actif' });
  }, [parc, open]);

  const handleSave = async () => {
    if (!form.nom) { setError('Le nom est requis'); return; }
    setLoading(true);
    try {
      const payload = { nom: form.nom, superficie_m2: form.superficie_m2, statut: form.statut, updated_at: new Date().toISOString() } as any;
      if (parc?.id) await (supabase as any).from('parcs_helicicoles').update(payload).eq('id', parc.id);
      else await (supabase as any).from('parcs_helicicoles').insert(payload);
      onSaved && onSaved();
      onOpenChange(false);
    } catch (e: any) {
      console.error('Save parc error', e);
      setError(e?.message || 'Erreur lors de la sauvegarde');
    } finally { setLoading(false); }
  };

  const handleDeleteConfirmed = async () => {
    if (!parc?.id) return;
    try {
      await (supabase as any).from('parcs_helicicoles').delete().eq('id', parc.id);
      onSaved && onSaved();
      onOpenChange(false);
    } catch (e) { console.error(e); }
  };

  if (!open) return null;

  return (
    <>
      <WhatsAppModal isOpen={open} onClose={() => onOpenChange(false)} hideHeader className="max-w-3xl">
        <div className="bg-white rounded-t-3xl shadow-2xl w-full mx-auto overflow-visible">
          <ModalHeader
            title={parc ? 'Modifier Parc' : 'Créer Parc'}
            subtitle="Informations du parc"
            headerGradient="from-purple-500 to-purple-600"
            headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-purple-300" />}
            onClose={() => onOpenChange(false)}
          />

          <div className="p-6 bg-white">
            <Card className="p-4">
              {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm">Nom</label>
                  <input ref={firstRef} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm">Superficie (m²)</label>
                  <input value={form.superficie_m2} onChange={(e) => setForm({ ...form, superficie_m2: e.target.value })} className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                {parc?.id && <Button variant="ghost" className="mr-auto text-red-600 hover:bg-red-50" onClick={() => setConfirmOpen(true)}>Supprimer</Button>}
                <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
                <Button onClick={handleSave} disabled={loading}>{loading ? 'Enregistrement...' : parc ? 'Enregistrer' : 'Créer'}</Button>
              </div>
            </Card>
          </div>
        </div>
      </WhatsAppModal>

      <ConfirmModal
        open={confirmOpen}
        title={parc ? `Supprimer le parc de ${parc.nom}` : 'Supprimer le parc'}
        description={parc ? `Supprimer le parc « ${parc.nom || parc.id} » ?` : 'Supprimer cet élément ?'}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => { await handleDeleteConfirmed(); }}
      />
    </>
  );
};

const ParcsHelicicolesList = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await (supabase as any).from('parcs_helicicoles').select('*').order('created_at', { ascending: false }) as any;
      setItems(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => { setSelected(null); setOpen(true); }}>➕ Parc</Button></div>
      <div className="bg-white rounded shadow p-4">{loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Superficie</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className="border-t">
                  <td>{i.nom}</td>
                  <td>{i.superficie_m2}</td>
                  <td>{i.statut}</td>
                  <td className="text-right flex justify-end gap-2">
                    <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={async () => { setPendingDelete(i); setConfirmOpen(true); }}>Supprimer</Button>
                    <Button variant="ghost" onClick={() => { setSelected(i); setOpen(true); }}>Éditer</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}</div>

      <ParcHelicicoleModal open={open} onOpenChange={setOpen} parc={selected} onSaved={() => { setOpen(false); load(); }} />

      <ConfirmModal
        open={confirmOpen}
        title={`Supprimer l'escargotière de ${pendingDelete?.nom || "cet utilisateur"}`}
        description={pendingDelete ? `Supprimer le parc « ${pendingDelete.name || pendingDelete.nom || pendingDelete.title || pendingDelete.id} » ?` : 'Supprimer cet élément ?'}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onClose={() => { setConfirmOpen(false); setPendingDelete(null); }}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await (supabase as any).from('parcs_helicicoles').delete().eq('id', pendingDelete.id);
            await load();
          } catch (e) { console.error(e); }
          setPendingDelete(null);
        }}
      />
    </div>
  );
};

export default ParcsHelicicolesList;
