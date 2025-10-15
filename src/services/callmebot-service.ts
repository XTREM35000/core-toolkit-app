interface CallMeBotResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class CallMeBotService {
  private apiKey: string;
  private baseUrl = 'https://api.callmebot.com/whatsapp.php';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(phone: string, message: string): Promise<CallMeBotResponse> {
    try {
      const formattedPhone = phone.replace(/\s+/g, '').replace('+', '');

      const params = new URLSearchParams({
        phone: formattedPhone,
        text: message,
        apikey: this.apiKey
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();

      if (text.includes('Message sent')) {
        return { success: true, message: 'Message WhatsApp envoyé avec succès' };
      } else {
        return { success: false, error: `Erreur CallMeBot: ${text}` };
      }
    } catch (error: any) {
      console.error('❌ Erreur CallMeBot:', error);
      return { success: false, error: error.message || 'Erreur inconnue' };
    }
  }

  async sendTemplateMessage(phone: string, template: string, data: any) {
    const messages: Record<string, string> = {
      welcome: `👋 Bienvenue sur AutoCare!\n\nVotre compte a été créé avec succès.\n\nEmail: ${data.email}\nMot de passe: ${data.password}\n\nConnectez-vous dès maintenant!`,
      appointment: `📅 Nouveau rendez-vous!\n\nClient: ${data.clientName}\nVéhicule: ${data.vehicle}\nDate: ${data.date}\nHeure: ${data.time}\n\nMerci de confirmer.`,
      reminder: `⏰ Rappel rendez-vous!\n\nRendez-vous demain à ${data.time}\nPour: ${data.service}\nVéhicule: ${data.vehicle}\n\nCordialement, AutoCare`,
      alert: `🚨 Alerte sécurité!\n\nConnexion détectée depuis un nouvel appareil:\n- Date: ${data.date}\n- Appareil: ${data.device}\n- Localisation: ${data.location}\n\nSi ce n'est pas vous, changez votre mot de passe.`
    };

    const message = messages[template] || template;
    return this.sendMessage(phone, message);
  }
}


