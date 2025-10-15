// services/stripeService.ts
import { supabase } from '@/integrations/supabase/client';

export const stripeService = {
  async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string, metadata: any = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-create-session', {
        body: {
          priceId,
          successUrl,
          cancelUrl,
          metadata
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  },

  async getPriceId(planType: string): string | null {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.warn('Stripe not configured');
      return null;
    }

    switch (planType) {
      case 'premium':
        return import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID;
      case 'pro':
        return import.meta.env.VITE_STRIPE_PRO_PRICE_ID;
      default:
        return null;
    }
  },

  isStripeConfigured(): boolean {
    return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  }
};

