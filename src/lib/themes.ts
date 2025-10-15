// Theme definitions and helpers
export type ThemeKey = 'whatsapp' | 'apple' | 'system';

export const THEMES: Record<Exclude<ThemeKey, 'system'>, { name: string; description?: string }> = {
  whatsapp: { name: 'WhatsApp-like', description: 'Palette verte inspirée WhatsApp (contraste élevé pour dark)' },
  apple: { name: 'Light (Apple-like)', description: 'Palette claire et neutre' }
};

export function preferDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveTheme(requested: ThemeKey): Exclude<ThemeKey, 'system'> {
  if (requested === 'system') {
    return preferDarkMode() ? 'whatsapp' : 'apple';
  }
  return requested as Exclude<ThemeKey, 'system'>;
}
