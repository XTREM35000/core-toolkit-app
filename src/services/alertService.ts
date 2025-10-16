import { AlertDefinition } from '../types/aquaculture';

export interface NotificationChannels {
  sms?: boolean;
  email?: boolean;
  inApp?: boolean;
}

export async function sendAlert(alert: AlertDefinition, channels: NotificationChannels = { inApp: true }) {
  // Abstraction simple : log + simulate async envoi
  const payload = { level: alert.level, message: alert.message, code: alert.code };
  if (channels.inApp) {
    // ici on pousserait vers un store websocket / DB
    console.info('[alertService] in-app', payload);
  }
  if (channels.email) {
    // Intégrer SendGrid/Resend
    console.info('[alertService] email (simulated)', payload);
  }
  if (channels.sms) {
    // Intégrer Twilio
    console.info('[alertService] sms (simulated)', payload);
  }
  return Promise.resolve({ ok: true, payload });
}

export default { sendAlert };
