// services/whatsappService.ts
import { supabase } from '@/integrations/supabase/client';

export const whatsappService = {
  async sendOTP(userId: string, phoneNumber: string, planType: string = "free") {
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-otp', {
        body: {
          userId,
          phoneNumber,
          planType
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('WhatsApp OTP error:', error);
      throw error;
    }
  },

  async verifyOTP(userId: string, otpCode: string, email?: string) {
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: {
          userId,
          otpCode,
          email
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }
};

