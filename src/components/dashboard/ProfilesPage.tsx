import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const ProfilesPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('id,email,full_name,role,created_at').limit(50);
      return data;
    }
  });

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Profils</h2>
      {isLoading && <div>Chargement...</div>}
      {error && <div className="text-red-500">Erreur: {(error as any).message}</div>}
      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Rôle</th>
              <th className="p-3 text-left">Créé</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.email}</td>
                <td className="p-3">{p.full_name}</td>
                <td className="p-3">{p.role}</td>
                <td className="p-3">{new Date(p.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProfilesPage;
