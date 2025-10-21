export type ResolvedTheme = 'whatsapp' | 'apple';

export const themeTokens: Record<ResolvedTheme, {
  primaryStart: string;
  primaryEnd: string;
  primaryText: string;
  cardBg: string;
  mutedForeground: string;
  overlay: string;
}> = {
  whatsapp: {
    primaryStart: '#128C7E',
    primaryEnd: '#075E54',
    primaryText: '#ffffff',
    cardBg: '#0f1720', // darker card for whatsapp/dark
    mutedForeground: 'rgba(255,255,255,0.85)',
    overlay: 'rgba(0,0,0,0.4)'
  },
  apple: {
    primaryStart: '#0ea5a4',
    primaryEnd: '#0284c7',
    primaryText: '#0f1720',
    cardBg: '#ffffff',
    mutedForeground: '#6b7280',
    overlay: 'rgba(0,0,0,0.35)'
  }
};

export function applyThemeTokens(resolved: ResolvedTheme) {
  try {
    const root = document.documentElement;
    const tokens = themeTokens[resolved];
    root.style.setProperty('--primary-start', tokens.primaryStart);
    root.style.setProperty('--primary-end', tokens.primaryEnd);
    root.style.setProperty('--primary-text', tokens.primaryText);
    root.style.setProperty('--card-bg', tokens.cardBg);
    root.style.setProperty('--muted-foreground', tokens.mutedForeground);
    root.style.setProperty('--overlay-color', tokens.overlay);
  } catch (e) {
    // noop on server
  }
}
