import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

export const CollaboratorsPage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['collabs'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('id,email,full_name,role').limit(100);
      return data;
    }
  });

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  const invite = async () => {
    // Simple invite via signUp (this will trigger profiles creation via trigger)
    await supabase.auth.signUp({ email, password: Math.random().toString(36).slice(2, 10), options: { data: { full_name: fullName } } });
    setEmail(''); setFullName('');
    qc.invalidateQueries({ queryKey: ['collabs'] });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg mb-6">
        <ModalHeader
          title="Collaborateurs"
          subtitle="Gérer les membres de l'équipe"
          headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-blue-300" />}
          onClose={() => { /* noop in page */ }}
        />
        <div className="p-4 bg-white">
          <Card className="p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nom complet" className="input" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input" />
            </div>
            <div className="mt-3">
              <button onClick={invite} className="btn btn-primary">Inviter</button>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Nom</th>
                  <th className="p-3 text-left">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <tr><td colSpan={3} className="p-3">Chargement...</td></tr>}
                {Array.isArray(data) && data.map((p: any) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.email}</td>
                    <td className="p-3">{p.full_name}</td>
                    <td className="p-3">{p.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorsPage;
