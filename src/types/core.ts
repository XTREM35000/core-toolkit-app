export interface Tenant {
  id: string;
  name: string;
  slug?: string;
}

export interface Profile {
  id: string;
  user_id?: string;
  display_name?: string;
  email?: string;
  phone?: string;
  tenant_id?: string;
}

export interface Organisation {
  id: string;
  name: string;
  slug?: string;
  address?: any;
  plan_type?: string;
  status?: string;
  created_by?: string;
}

export interface Animal {
  id: string;
  species?: string;
  cohort_id?: string;
}
