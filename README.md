# AquaHelix SaaS

AquaHelix SaaS is a management front-end for aquaculture and heliciculture operations.

## Project info

Run locally with Node.js and npm installed.

Quick start:

```powershell
npm install
npm run dev
```

### Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

Use your normal Git workflow to push and deploy; adjust hosting settings to point to the `dist` produced by `vite build`.


---

## AquaManager Pro (init)

Ce dépôt contient maintenant des artefacts initiaux pour transformer le projet en "AquaManager Pro" — un SaaS professionnel pour la gestion d'élevages aquacoles.

Fichiers ajoutés:

- `docs/AquaManagerPro_Cursor_Prompt.md` — prompt optimisé pour guider un agent dans la génération de composants et logique métier.
- `src/types/aquaculture.ts` — types métier (rôles, alertes, UPA, cohortes).
- `src/lib/aquaTheme.ts` — thème aquacole corporate (tokens couleurs).
- `docs/ROADMAP_AquaManagerPro.md` — roadmap initiale pour les phases de développement.

Consultez ces fichiers pour démarrer la migration vers une solution SaaS complète pour l'aquaculture.

### Try it — lancer les tests et le dev server

1. Installer les dépendances si ce n'est pas déjà fait:

```powershell
npm install
```

2. Lancer les tests unitaires (Vitest):

```powershell
npm test
```

3. Démarrer le serveur de développement:

```powershell
npm run dev
```

Extras: éditez `.env` à partir de `.env.example` pour configurer Supabase / Twilio / SendGrid.
