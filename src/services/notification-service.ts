// services/notification-service.ts
import { CallMeBotService } from '@/services/callmebot-service';

export type NotificationProvider = 'callmebot' | 'log' | 'email';

export interface NotificationOptions {
  provider?: NotificationProvider;
  priority?: 'low' | 'normal' | 'high';
  template?: string;
  data?: any;
}

export class NotificationService {
  private callMeBot: CallMeBotService;

  constructor() {
    this.callMeBot = new CallMeBotService(
      (import.meta as any)?.env?.VITE_CALLMEBOT_API_KEY || ''
    );
  }

  async sendSMS(phone: string, message: string, options: NotificationOptions = {}) {
    const provider = options.provider || (import.meta as any)?.env?.VITE_WHATSAPP_PROVIDER || 'log';

    console.log(`📱 Envoi notification via ${provider} vers ${phone}`);

    switch (provider) {
      case 'callmebot':
        if (options.template) {
          return this.callMeBot.sendTemplateMessage(phone, options.template, options.data || {});
        }
        return this.callMeBot.sendMessage(phone, message);

      case 'log':
      default:
        console.log(`📱 [NOTIFICATION SIMULÉE] ${phone}: ${message}`);
        if (options.template) {
          console.log('📋 Template:', options.template, 'Data:', options.data);
        }
        return { success: true, provider: 'log' } as any;
    }
  }

  async sendWelcome(phone: string, userData: { email: string; password: string; firstName: string }) {
    return this.sendSMS(phone, '', {
      template: 'welcome',
      data: userData,
      provider: 'callmebot'
    });
  }

  async sendAppointmentReminder(phone: string, appointmentData: any) {
    return this.sendSMS(phone, '', {
      template: 'reminder',
      data: appointmentData,
      provider: 'callmebot'
    });
  }

  async sendSecurityAlert(phone: string, alertData: any) {
    return this.sendSMS(phone, '', {
      template: 'alert',
      data: alertData,
      provider: 'callmebot',
      priority: 'high'
    });
  }
}
