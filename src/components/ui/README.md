This folder exposes UI components and theme utilities used across the application.

Quick notes
- Theme: Use `ThemeProvider` (from `src/contexts/ThemeContext.tsx`) to wrap the app. It exposes `useTheme()` with:
  - `theme` (requested theme: 'whatsapp'|'apple'|'system')
  - `resolvedTheme` (concrete theme: 'whatsapp'|'apple')
  - `setTheme(theme)` and `toggleTheme()`.
- CSS variables are defined in `src/index.css` under `.theme-whatsapp` and `.theme-apple`.
- Import components from `@/components/ui` (barrel). Example:
  - `import { Button, Input, ThematicLogo } from '@/components/ui'`

Planned next steps for the primitives refactor:
- Standardize component props: `variant`, `size`, `asChild` where appropriate.
- Ensure all components consume CSS variables (colors, border, radius) via classes and `cn`.
- Add basic unit tests for Button and Input.

`README.md` is temporary and intended to guide the incremental refactor.
