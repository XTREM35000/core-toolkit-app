import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { Card } from '@/components/ui/card';
import CollaboratorModal from './CollaboratorModal';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { Profile } from '@/types';
import AnimatedLogo from '@/components/AnimatedLogo';

type MiniProfile = {
  id: string;
  email?: string;
  full_name?: string | null;
  role?: string | null;
  avatar_url?: string | null;
};

export const CollaboratorsPage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['collabs'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('id,email,full_name,role,avatar_url').limit(200);
      return data;
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Profile | Partial<Profile> | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-sm mb-4">
        <ModalHeader
          title="Collaborateurs"
          subtitle="Gérer les membres de l'équipe"
          headerLogo={<AnimatedLogo size={36} mainColor="text-white" secondaryColor="text-blue-300" />}
          onClose={() => { /* noop in page */ }}
        />
        <div className="p-4 bg-white">
          <Card className="p-3 mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Membres</div>
              <div className="text-xs text-muted-foreground">Gérer les comptes de l'équipe</div>
            </div>
            <div>
              <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>Ajouter</button>
            </div>
          </Card>

          <Card className="p-0">
            <ul className="divide-y">
              {isLoading && <li className="p-3">Chargement...</li>}
              {Array.isArray(data) && data.map((p: MiniProfile) => (
                <li key={p.id} className="p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {p.avatar_url ? <img src={p.avatar_url} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">A</span>}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{p.full_name || '—'}</div>
                    <div className="text-xs text-gray-500">{p.email}</div>
                  </div>
                  <div className="text-sm text-gray-600 mr-2">{p.role}</div>
                  <div>
                    <button className="btn btn-ghost" onClick={() => { setEditing(p); setModalOpen(true); }}>Modifier</button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <CollaboratorModal isOpen={modalOpen} onClose={() => setModalOpen(false)} existing={editing} onSaved={() => { qc.invalidateQueries({ queryKey: ['collabs'] }); }} />
    </div>
  );
};

export default CollaboratorsPage;
