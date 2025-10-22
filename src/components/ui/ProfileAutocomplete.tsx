import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileShort {
  id: string;
  full_name: string;
  email?: string;
}

interface Props {
  roleFilter?: string | string[]; // role or roles to filter by
  placeholder?: string;
  onSelect: (p: ProfileShort | null) => void;
  value?: string;
  onCreateSuggestion?: (name: string) => void; // called when user wants to create the typed name
  tenantId?: string | null;
}

const ProfileAutocomplete = ({ roleFilter, placeholder = 'Rechercher...', onSelect, value = '', onCreateSuggestion, tenantId }: Props) => {
  const [q, setQ] = useState(value);
  const [list, setList] = useState<ProfileShort[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQ(value);
  }, [value]);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      if (!q || q.length < 1) {
        setList([]);
        return;
      }
      try {
        let query = (supabase as any).from('profiles').select('id,full_name,email').ilike('full_name', `%${q}%`).limit(10);
        if (roleFilter) {
          if (Array.isArray(roleFilter)) {
            query = query.in('role', roleFilter);
          } else {
            query = query.eq('role', roleFilter);
          }
        }
        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }
        const { data } = await query;
        if (!mounted) return;
          setList(Array.isArray(data) ? data : []);
          setOpen(true);
      } catch (err) {
        console.error('ProfileAutocomplete fetch error', err);
      }
    };

    const t = setTimeout(fetch, 200);
    return () => { mounted = false; clearTimeout(t); };
  }, [q, roleFilter]);

  return (
    <div className="relative">
      <input
        className="w-full border rounded px-2 py-1"
        placeholder={placeholder}
        value={q}
        onChange={(e) => { setQ(e.target.value); onSelect(null); }}
        onFocus={() => { if (list.length) setOpen(true); }}
      />
      {open && (
        <ul className="absolute z-50 left-0 right-0 bg-white border rounded mt-1 max-h-48 overflow-auto">
          {list.length > 0 ? list.map((p) => (
            <li key={p.id} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { onSelect(p); setQ(p.full_name); setOpen(false); }}>
              <div className="text-sm font-medium">{p.full_name}</div>
              <div className="text-xs text-muted-foreground">{p.email}</div>
            </li>
          )) : (
            <li className="px-3 py-2 text-sm text-muted-foreground flex justify-between items-center">
              <span>Aucun résultat pour « {q} »</span>
              {typeof onCreateSuggestion === 'function' ? (
                <button type="button" className="ml-2 text-sm text-primary underline" onClick={() => { onSelect(null); setOpen(false); onCreateSuggestion(q); }}>
                  Créer
                </button>
              ) : null}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProfileAutocomplete;
