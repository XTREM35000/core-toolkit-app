import { ALERT_SYSTEM, type AlertDefinition } from '../types/aquaculture';

export type Channel = 'inapp' | 'email' | 'sms';

export interface AlertPayload {
  level: AlertDefinition['level'];
  message: string;
  code?: string;
  unitId?: string;
  cohortId?: string;
}

export class AlertService {
  // Mock send: in real world bind Twilio/SendGrid here
  async send(payload: AlertPayload, channels: Channel[] = ['inapp']): Promise<void> {
    channels.forEach((c) => console.log(`[AlertService] ${c.toUpperCase()}: ${payload.level} - ${payload.message}`));
    return Promise.resolve();
  }

  getDefinitions(level: AlertDefinition['level']) {
    return ALERT_SYSTEM[level] ?? [];
  }
}

export const alertService = new AlertService();
export default alertService;
