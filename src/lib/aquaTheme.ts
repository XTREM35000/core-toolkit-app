// Thème fusionné (AquaManager Pro + inspiration WhatsApp / Apple)
// Objectif : préserver l'identité aquatique tout en exploitant
// des tons verts WhatsApp et des accents Apple pour une UI familière.

export const aquaTheme = {
  primary: {
    marine: '#0066CC',      // bleu aquatique (héritage)
    aqua: '#00A896',        // vert aquatique
    deep: '#0047AB',        // bleu marine profond
    whatsapp: '#25D366',    // vert WhatsApp
    appleBlue: '#007AFF'    // accent iOS
  },
  analytics: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6'
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F2F2F5',
    200: '#E5E5EA',
    300: '#D1D1D6',
    400: '#8E8E93', // apple system gray
    500: '#6E6E73'
  }
};

export type AquaTheme = typeof aquaTheme;

export default aquaTheme;
