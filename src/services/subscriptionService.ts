import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: string;
  price: number;
  duration_days: number;
  features: string;
  is_active: boolean;
  created_at: string;
}

export interface SubscriptionStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  freeSubscriptions: number;
  paidSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  byPlan: Record<string, number>;
}

export interface RevenueData {
  date: string;
  revenue: number;
  subscriptions: number;
}

export interface SubscriptionFilters {
  plan?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

class SubscriptionService {
  /**
   * Récupère tous les plans d'abonnement
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur récupération plans:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques des abonnements
   */
  async getSubscriptionStats(): Promise<SubscriptionStats> {
    try {
      // Récupérer les organisations avec leurs abonnements
      const { data: organizations, error: orgError } = await supabase
        .from('organizations')
        .select('subscription_plan, subscription_status, created_at');

      if (orgError) throw orgError;

      // Récupérer les profils pour les stats par plan
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('selected_plan')
        .neq('role', 'super_admin');

      if (profileError) throw profileError;

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Calculer les statistiques
      const stats: SubscriptionStats = {
        totalRevenue: 0,
        monthlyRevenue: 0,
        activeSubscriptions: 0,
        freeSubscriptions: 0,
        paidSubscriptions: 0,
        churnRate: 0,
        averageRevenuePerUser: 0,
        byPlan: {}
      };

      // Analyser les organisations
      organizations?.forEach(org => {
        if (org.subscription_status === 'active') {
          stats.activeSubscriptions++;

          if (org.subscription_plan === 'free') {
            stats.freeSubscriptions++;
          } else {
            stats.paidSubscriptions++;

            // Calculer le revenue (simulation)
            if (org.subscription_plan === 'monthly') {
              stats.monthlyRevenue += 50000; // 50k FCFA/mois
              stats.totalRevenue += 50000;
            } else if (org.subscription_plan === 'annual') {
              stats.monthlyRevenue += 41667; // 500k FCFA/an = ~42k/mois
              stats.totalRevenue += 500000;
            }
          }
        }
      });

      // Analyser les profils pour les stats par plan
      profiles?.forEach(profile => {
        const plan = profile.selected_plan || 'free';
        stats.byPlan[plan] = (stats.byPlan[plan] || 0) + 1;
      });

      // Calculer l'ARPU
      if (stats.activeSubscriptions > 0) {
        stats.averageRevenuePerUser = stats.totalRevenue / stats.activeSubscriptions;
      }

      return stats;
    } catch (error) {
      console.error('Erreur récupération stats abonnements:', error);
      throw error;
    }
  }

  /**
   * Récupère les données de revenue par période
   */
  async getRevenueData(months: number = 12): Promise<RevenueData[]> {
    try {
      const { data: organizations, error } = await supabase
        .from('organizations')
        .select('subscription_plan, subscription_status, created_at')
        .gte('created_at', new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Grouper par mois
      const monthlyData: Record<string, { revenue: number; subscriptions: number }> = {};

      organizations?.forEach(org => {
        if (org.subscription_status === 'active') {
          const month = new Date(org.created_at).toISOString().substring(0, 7); // YYYY-MM

          if (!monthlyData[month]) {
            monthlyData[month] = { revenue: 0, subscriptions: 0 };
          }

          monthlyData[month].subscriptions++;

          // Calculer le revenue
          if (org.subscription_plan === 'monthly') {
            monthlyData[month].revenue += 50000;
          } else if (org.subscription_plan === 'annual') {
            monthlyData[month].revenue += 500000;
          }
        }
      });

      // Convertir en array et trier
      return Object.entries(monthlyData)
        .map(([date, data]) => ({
          date,
          revenue: data.revenue,
          subscriptions: data.subscriptions
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Erreur récupération données revenue:', error);
      return [];
    }
  }

  /**
   * Récupère les abonnements avec filtres
   */
  async getSubscriptions(filters: SubscriptionFilters = {}): Promise<any[]> {
    try {
      let query = supabase
        .from('organizations')
        .select(`
          id,
          name,
          subscription_plan,
          subscription_status,
          created_at,
          profiles!organizations_owner_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Appliquer les filtres
      if (filters.plan) {
        query = query.eq('subscription_plan', filters.plan);
      }

      if (filters.status) {
        query = query.eq('subscription_status', filters.status);
      }

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
      console.error('Erreur récupération abonnements:', error);
      return [];
    }
  }

  /**
   * Met à jour le plan d'un abonnement
   */
  async updateSubscription(organizationId: string, newPlan: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          subscription_plan: newPlan,
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur mise à jour abonnement:', error);
      return false;
    }
  }

  /**
   * Suspend un abonnement
   */
  async suspendSubscription(organizationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          subscription_status: 'suspended',
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur suspension abonnement:', error);
      return false;
    }
  }

  /**
   * Annule un abonnement
   */
  async cancelSubscription(organizationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur annulation abonnement:', error);
      return false;
    }
  }

  /**
   * Récupère les factures en attente
   */
  async getPendingInvoices(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          organizations!invoices_organization_id_fkey (
            name,
            subscription_plan
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur récupération factures:', error);
      return [];
    }
  }

  /**
   * Marque une facture comme payée
   */
  async markInvoiceAsPaid(invoiceId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', invoiceId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur mise à jour facture:', error);
      return false;
    }
  }

  /**
   * Génère un rapport de revenue
   */
  async generateRevenueReport(months: number = 12): Promise<any> {
    try {
      const [stats, revenueData, subscriptions] = await Promise.all([
        this.getSubscriptionStats(),
        this.getRevenueData(months),
        this.getSubscriptions()
      ]);

      return {
        stats,
        revenueData,
        subscriptions: subscriptions.slice(0, 10), // Derniers 10 abonnements
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();
