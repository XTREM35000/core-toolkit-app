# Prompt optimisé pour Cursor — AquaManager Pro

## Contexte stratégique
Transformer le projet existant en SaaS enterprise "AquaManager Pro" — solution complète de gestion d'élevages aquacoles (pisciculture & héliciculture) avec analytics, automatisation et gestion multi-sites.

## Objectif du prompt
Fournir à l'agent Cursor une description claire, architecture cible, modules métier, vocabulaire professionnel, rôles, notifications, intégrations et critères de succès pour guider la génération de code, la création d'UI et la configuration backend.

## Architecture cible
```
app/
components/
  analytics/
  workflow/
  notifications/
  reports/
  ui/
lib/
services/
types/
hooks/
contexts/
```

## Transformations métier (résumé)
- Remplacements terminologiques : Garage → Unité de Production Aquacole (UPA), Voiture → Lot d'élevage / Cohorte, etc.
- Rôles enrichis : SUPER_ADMIN, EXPLOITATION_MANAGER, TECHNICIEN_SENIOR, TECHNICIEN, COMMERCIAL, COMPTABLE
- Dashboards : Directeur, Technicien, Commercial
- Notifications : CRITICAL / WARNING / INFO, canaux Twilio / SendGrid / in-app

## Exigences fonctionnelles prioritaires
- Gestion multi-sites avec permissions granulaires
- Analytics temps réel et dashboards configurables
- Système de notifications multi-canaux et relances automatisées
- Modules : Suivi Zootechnique, Qualité Eau, CRM, Ventes, Logistique

## Consignes pour l'agent Cursor
1. Générer des composants React TypeScript prêts pour un design system (aquaTheme).
2. Produire types et interfaces réutilisables dans `src/types`.
3. Favoriser modularité : services métier isolés dans `src/services`.
4. Inclure tests unitaires basiques pour la logique métier critique.
5. Documenter chaque artefact (README + commentaires JSDoc).

## Livrables attendus
- Composants UI : `BiomassChart.tsx`, `WaterQualityGauge.tsx`, `ProductionCalendar.tsx`, `AlertCenter.tsx`, `AnalyticsDashboard.tsx`
- Types : `src/types/aquaculture.ts`
- Thème : `src/lib/aquaTheme.ts`
- Docs : `docs/ROADMAP_AquaManagerPro.md`

---

_Utiliser ce fichier comme base — ajuster selon les besoins métier et les choix technologiques (ex : Supabase, Postgres, Kafka for streaming IoT)._ 
