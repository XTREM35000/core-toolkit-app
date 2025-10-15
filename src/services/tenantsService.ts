import { supabase } from '@/integrations/supabase/client';

export interface Tenant {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  selected_plan?: string;
  created_at: string;
  last_sign_in?: string;
  is_active: boolean;
  avatar_url?: string;
}

export interface TenantStats {
  total: number;
  active: number;
  inactive: number;
  thisMonth: number;
  byRole: Record<string, number>;
  byPlan: Record<string, number>;
}

export interface TenantFilters {
  search?: string;
  role?: string;
  plan?: string;
  status?: 'active' | 'inactive' | 'all';
  dateFrom?: string;
  dateTo?: string;
}

class TenantsService {
  /**
   * Récupère tous les tenants avec filtres
   */
  async getTenants(filters: TenantFilters = {}): Promise<Tenant[]> {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('role', 'super_admin')
        .order('created_at', { ascending: false });

      // Filtre par recherche
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      // Filtre par rôle
      if (filters.role) {
        query = query.eq('role', filters.role);
      }

      // Filtre par plan
      if (filters.plan) {
        query = query.eq('selected_plan', filters.plan);
      }

      // Filtre par statut
      if (filters.status && filters.status !== 'all') {
        query = query.eq('is_active', filters.status === 'active');
      }

      // Filtre par date
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur récupération tenants:', error);
      throw error;
    }
  }

  /**
   * Récupère un tenant par ID
   */
  async getTenantById(id: string): Promise<Tenant | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .neq('role', 'super_admin')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur récupération tenant:', error);
      return null;
    }
  }

  /**
   * Met à jour un tenant
   */
  async updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur mise à jour tenant:', error);
      throw error;
    }
  }

  /**
   * Active/désactive un tenant
   */
  async toggleTenantStatus(id: string, isActive: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur changement statut tenant:', error);
      return false;
    }
  }

  /**
   * Supprime un tenant (soft delete)
   */
  async deleteTenant(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false, deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur suppression tenant:', error);
      return false;
    }
  }

  /**
   * Récupère les statistiques des tenants
   */
  async getTenantStats(): Promise<TenantStats> {
    try {
      const { data: tenants, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'super_admin');

      if (error) throw error;

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats: TenantStats = {
        total: tenants?.length || 0,
        active: tenants?.filter(t => t.is_active).length || 0,
        inactive: tenants?.filter(t => !t.is_active).length || 0,
        thisMonth: tenants?.filter(t => new Date(t.created_at) >= thisMonth).length || 0,
        byRole: {},
        byPlan: {}
      };

      // Statistiques par rôle
      tenants?.forEach(tenant => {
        stats.byRole[tenant.role] = (stats.byRole[tenant.role] || 0) + 1;
        const plan = tenant.selected_plan || 'free';
        stats.byPlan[plan] = (stats.byPlan[plan] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Erreur récupération stats tenants:', error);
      throw error;
    }
  }

  /**
   * Récupère l'activité récente des tenants
   */
  async getRecentActivity(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, created_at, last_sign_in')
        .neq('role', 'super_admin')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur récupération activité récente:', error);
      return [];
    }
  }

  /**
   * Recherche des tenants
   */
  async searchTenants(query: string): Promise<Tenant[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'super_admin')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur recherche tenants:', error);
      return [];
    }
  }

  /**
   * Exporte les données des tenants
   */
  async exportTenants(filters: TenantFilters = {}): Promise<Tenant[]> {
    try {
      const tenants = await this.getTenants(filters);

      // Formater les données pour l'export
      return tenants.map(tenant => ({
        ...tenant,
        created_at: new Date(tenant.created_at).toLocaleDateString('fr-FR'),
        last_sign_in: tenant.last_sign_in ? new Date(tenant.last_sign_in).toLocaleDateString('fr-FR') : 'Jamais'
      }));
    } catch (error) {
      console.error('Erreur export tenants:', error);
      throw error;
    }
  }

  /**
   * Actions en lot sur les tenants
   */
  async bulkAction(tenantIds: string[], action: 'activate' | 'deactivate' | 'delete'): Promise<boolean> {
    try {
      let updateData: any = {};

      switch (action) {
        case 'activate':
          updateData = { is_active: true };
          break;
        case 'deactivate':
          updateData = { is_active: false };
          break;
        case 'delete':
          updateData = { is_active: false, deleted_at: new Date().toISOString() };
          break;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .in('id', tenantIds);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur action en lot:', error);
      return false;
    }
  }
}

export const tenantsService = new TenantsService();
