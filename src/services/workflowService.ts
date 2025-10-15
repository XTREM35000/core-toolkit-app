// services/workflowService.ts - SERVICE DE VÉRIFICATION WORKFLOW
import { supabase } from '@/integrations/supabase/client';

export const workflowService = {
  // Vérifier si un plan est sélectionné
  async checkPlanSelection(userId: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('selected_plan')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return profile?.selected_plan ? { exists: true, data: profile } : { exists: false };
  },

  // Vérifier si un tenant admin existe
  async checkTenantAdmin(userId: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, first_name, last_name, email, phone')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return profile?.role === 'tenant_admin' ? { exists: true, data: profile } : { exists: false };
  },

  // Vérifier si un paiement existe et est réussi
  async checkPayment(userId: string) {
    const { data: payment, error } = await supabase
      .from('payments')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'succeeded')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return payment ? { exists: true, data: payment } : { exists: false };
  },

  // Vérifier si la validation SMS est complète
  async checkSMSValidation(userId: string) {
    const { data: validation, error } = await supabase
      .from('sms_validations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_used', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return validation ? { exists: true, data: validation } : { exists: false };
  },

  // Vérifier si une organisation existe
  async checkOrganization(userId: string) {
    const { data: userOrg, error } = await supabase
      .from('user_organization')
      .select(`
        *,
        organizations (*)
      `)
      .eq('user_id', userId)
      .eq('role', 'tenant_admin')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return userOrg ? { exists: true, data: userOrg } : { exists: false };
  },

  // Vérifier si un garage existe pour l'organisation
  async checkGarage(organizationId: string) {
    const { data: garage, error } = await supabase
      .from('garages')
      .select('*')
      .eq('organization_id', organizationId)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return garage ? { exists: true, data: garage } : { exists: false };
  },

  // Vérifier si des membres d'équipe existent
  async checkTeamMembers(organizationId: string) {
    const { data: members, error } = await supabase
      .from('user_organization')
      .select(`
        *,
        profiles (first_name, last_name, email, role)
      `)
      .eq('organization_id', organizationId)
      .neq('role', 'tenant_admin');

    if (error) throw error;
    return members && members.length > 0 ? { exists: true, data: members } : { exists: false };
  },

  // Déterminer l'étape actuelle du workflow
  async getCurrentWorkflowStep(userId: string) {
    try {
      console.log('🔍 Début vérification workflow pour user:', userId);

      // Étape 1: Plan sélectionné
      const planCheck = await this.checkPlanSelection(userId);
      console.log('📋 Plan check:', planCheck);
      if (!planCheck.exists) {
        console.log('➡️ Retour étape 1: Plan non sélectionné');
        return { step: 1, data: null };
      }

      // Étape 2: Tenant admin créé
      const tenantCheck = await this.checkTenantAdmin(userId);
      console.log('👤 Tenant check:', tenantCheck);
      if (!tenantCheck.exists) {
        console.log('➡️ Retour étape 2: Tenant admin non créé');
        return { step: 2, data: planCheck.data };
      }

      // Étape 3: Paiement réussi
      const paymentCheck = await this.checkPayment(userId);
      console.log('💳 Payment check:', paymentCheck);
      if (!paymentCheck.exists) {
        console.log('➡️ Retour étape 3: Paiement non effectué');
        return { step: 3, data: { plan: planCheck.data, tenant: tenantCheck.data } };
      }

      // Étape 4: SMS validé
      const smsCheck = await this.checkSMSValidation(userId);
      console.log('📱 SMS check:', smsCheck);
      if (!smsCheck.exists) {
        console.log('➡️ Retour étape 4: SMS non validé');
        return { step: 4, data: { plan: planCheck.data, tenant: tenantCheck.data, payment: paymentCheck.data } };
      }

      // Étape 5: Organisation créée
      const orgCheck = await this.checkOrganization(userId);
      console.log('🏢 Organization check:', orgCheck);
      if (!orgCheck.exists) {
        console.log('➡️ Retour étape 5: Organisation non créée');
        return { step: 5, data: { plan: planCheck.data, tenant: tenantCheck.data, payment: paymentCheck.data, sms: smsCheck.data } };
      }

      // Étape 6: Garage créé
      const garageCheck = await this.checkGarage(orgCheck.data.organization_id);
      console.log('🔧 Garage check:', garageCheck);
      if (!garageCheck.exists) {
        console.log('➡️ Retour étape 6: Garage non créé');
        return { step: 6, data: { plan: planCheck.data, tenant: tenantCheck.data, payment: paymentCheck.data, sms: smsCheck.data, organization: orgCheck.data } };
      }

      // Étape 7: Équipe configurée
      const teamCheck = await this.checkTeamMembers(orgCheck.data.organization_id);
      console.log('👥 Team check:', teamCheck);
      if (!teamCheck.exists) {
        console.log('➡️ Retour étape 7: Équipe non configurée');
        return { step: 7, data: { plan: planCheck.data, tenant: tenantCheck.data, payment: paymentCheck.data, sms: smsCheck.data, organization: orgCheck.data, garage: garageCheck.data } };
      }

      // Étape 8: Workflow terminé
      console.log('✅ Workflow terminé - étape 8');
      return { step: 8, data: { plan: planCheck.data, tenant: tenantCheck.data, payment: paymentCheck.data, sms: smsCheck.data, organization: orgCheck.data, garage: garageCheck.data, team: teamCheck.data } };

    } catch (error) {
      console.error('❌ Erreur vérification workflow:', error);
      return { step: 1, data: null, error };
    }
  }
};
