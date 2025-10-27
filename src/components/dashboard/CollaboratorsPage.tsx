import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import { Card } from '@/components/ui/card';
import CollaboratorModal from './CollaboratorModal';
import AnimatedLogo from '@/components/AnimatedLogo';
import { motion } from 'framer-motion';

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
  const [editing, setEditing] = useState<MiniProfile | null>(null);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Card className="bg-gradient-to-r from-blue-50 to-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <ModalHeader
          title="Collaborateurs"
          subtitle="Gérer les membres de l'équipe"
          headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-blue-300" />}
          onClose={() => { }}
        />

        <div className="p-6 bg-white space-y-4">
          <Card className="p-4 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow rounded-xl">
            <div>
              <div className="text-lg font-semibold text-gray-800">Membres</div>
              <div className="text-sm text-gray-500">Gérer les comptes de l'équipe</div>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all"
              onClick={() => { setEditing(null); setModalOpen(true); }}
            >
              Ajouter
            </button>
          </Card>

          <Card className="p-0 rounded-2xl overflow-hidden shadow-inner">
            <ul className="divide-y">
              {isLoading && <li className="p-4 text-center text-gray-500">Chargement...</li>}

              {Array.isArray(data) && data.map((p: MiniProfile) => (
                <motion.li
                  key={p.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors rounded-lg mx-2 my-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center hover:scale-105 transition-transform">
                    {p.avatar_url ? (
                      <img src={p.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400">A</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-sm font-medium text-gray-800">{p.full_name || '—'}</span>
                    <span className="text-xs text-gray-500">{p.email}</span>
                  </div>
                  <div className="text-sm text-gray-600">{p.role || 'Utilisateur'}</div>
                  <button
                    className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                    onClick={() => { setEditing(p); setModalOpen(true); }}
                  >
                    Modifier
                  </button>
                </motion.li>
              ))}
            </ul>
          </Card>
        </div>
      </Card>

      <CollaboratorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        existing={editing}
        onSaved={() => { qc.invalidateQueries({ queryKey: ['collabs'] }); }}
      />
    </div>
  );
};

export default CollaboratorsPage;
