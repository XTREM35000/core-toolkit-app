// services/paymentService.ts - SERVICE COMPLET
import { supabase } from '@/integrations/supabase/client';

export const paymentService = {
  async createPayment(plan: any, user: any, organizationId: string = null) {
    // Récupérer l'ID du plan depuis la base
    const { data: subscriptionPlan } = await supabase
      .from('subscription_plans')
      .select('id')
      .eq('type', plan.type)
      .single();

    const paymentData = {
      user_id: user.id,
      organization_id: organizationId,
      subscription_plan_id: subscriptionPlan?.id,
      amount: plan.price,
      currency: 'XOF',
      status: 'pending',
      description: `Abonnement ${plan.name}`,
      metadata: {
        plan_type: plan.type,
        user_email: user.email,
        features: JSON.parse(plan.features)
      },
      payment_intent_id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
    };

    const { data: payment, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (error) throw error;
    return payment;
  },

  async updatePaymentStatus(paymentId: string, status: string, stripeData: any = {}) {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'succeeded') {
      updateData.paid_at = new Date().toISOString();
    }

    if (stripeData.paymentIntentId) {
      updateData.stripe_payment_intent_id = stripeData.paymentIntentId;
    }

    const { error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', paymentId);

    if (error) throw error;
  },

  async getOrganizationPayments(organizationId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        subscription_plans (*),
        profiles (email, first_name, last_name)
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getUserPayments(userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        subscription_plans (*),
        organizations (name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPaymentById(paymentId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        subscription_plans (*),
        profiles (email, first_name, last_name),
        organizations (name)
      `)
      .eq('id', paymentId)
      .single();

    if (error) throw error;
    return data;
  },

  async validatePayment(paymentId: string) {
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error) throw error;

    // Vérifier si le paiement est valide et réussi
    return payment && payment.status === 'succeeded';
  },

  async createStripeWebhook(webhookData: any) {
    const { data, error } = await supabase
      .from('stripe_webhooks')
      .insert({
        event_id: webhookData.id,
        event_type: webhookData.type,
        data: webhookData.data,
        processed: false,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  },

  async processStripeWebhook(webhookId: string) {
    const { data: webhook, error: fetchError } = await supabase
      .from('stripe_webhooks')
      .select('*')
      .eq('id', webhookId)
      .single();

    if (fetchError) throw fetchError;

    if (webhook.processed) {
      return { alreadyProcessed: true };
    }

    // Traiter le webhook selon le type d'événement
    let updateData: any = { processed: true, processed_at: new Date().toISOString() };

    switch (webhook.event_type) {
      case 'payment_intent.succeeded':
        // Mettre à jour le statut du paiement
        if (webhook.data.object?.id) {
          await this.updatePaymentStatus(
            webhook.data.object.metadata?.payment_id,
            'succeeded',
            { paymentIntentId: webhook.data.object.id }
          );
        }
        break;

      case 'payment_intent.payment_failed':
        // Marquer le paiement comme échoué
        if (webhook.data.object?.id) {
          await this.updatePaymentStatus(
            webhook.data.object.metadata?.payment_id,
            'failed',
            { paymentIntentId: webhook.data.object.id }
          );
        }
        break;

      default:
        updateData.notes = `Event type ${webhook.event_type} not handled`;
    }

    // Marquer le webhook comme traité
    const { error: updateError } = await supabase
      .from('stripe_webhooks')
      .update(updateData)
      .eq('id', webhookId);

    if (updateError) throw updateError;

    return { processed: true };
  }
};
