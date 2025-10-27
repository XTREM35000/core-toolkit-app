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
  // structured address: keep as a typed object rather than `any`
  address?: {
    street?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    [key: string]: unknown;
  };
  plan_type?: string;
  status?: string;
  created_by?: string;
}

export interface Animal {
  id: string;
  species?: string;
  cohort_id?: string;
}
