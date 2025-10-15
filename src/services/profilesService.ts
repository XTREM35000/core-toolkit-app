import { supabase } from './supabaseClient';

export async function listMechanicsByOrganization(organizationId: string) {
  return await supabase
    .from('profiles')
    .select(`id, first_name, last_name, phone, user_organization!inner(role, organization_id)`)
    .eq('user_organization.role', 'mechanic')
    .eq('user_organization.organization_id', organizationId);
}

export async function listProfiles() {
  return await supabase.from('profiles').select('*');
}


