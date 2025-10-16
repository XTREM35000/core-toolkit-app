// Types métier pour AquaManager Pro

export type RoleKey =
  | 'SUPER_ADMIN'
  | 'EXPLOITATION_MANAGER'
  | 'TECHNICIEN_SENIOR'
  | 'TECHNICIEN'
  | 'COMMERCIAL'
  | 'COMPTABLE';

export interface RolePermissions {
  key: RoleKey;
  description: string;
  scopes?: string[]; // permissions ou scopes additionnels
}

export const ROLE_PERMISSIONS: RolePermissions[] = [
  { key: 'SUPER_ADMIN', description: 'Gestion multi-sites + Analytics corporate', scopes: ['sites:read', 'sites:write', 'analytics:read', 'users:manage'] },
  { key: 'EXPLOITATION_MANAGER', description: 'Gestion technique + Reporting', scopes: ['units:read', 'units:write', 'reports:read'] },
  { key: 'TECHNICIEN_SENIOR', description: 'Interventions + Suivi sanitaire', scopes: ['interventions:read', 'interventions:write', 'health:read'] },
  { key: 'TECHNICIEN', description: 'Opérations quotidiennes + Saisie données', scopes: ['operations:read', 'operations:write'] },
  { key: 'COMMERCIAL', description: 'Ventes + Relations clients + CRM', scopes: ['crm:read', 'orders:write'] },
  { key: 'COMPTABLE', description: 'Facturation + Analytique financière', scopes: ['invoices:read', 'finance:read'] }
];

export type AlertLevel = 'CRITICAL' | 'WARNING' | 'INFO';

export interface AlertDefinition {
  level: AlertLevel;
  message: string;
  code?: string;
}

export const ALERT_SYSTEM: Record<AlertLevel, AlertDefinition[]> = {
  CRITICAL: [
    { level: 'CRITICAL', message: 'Chute brutale de niveau O² < 4mg/L', code: 'O2_DROP' },
    { level: 'CRITICAL', message: 'Température hors plage critique', code: 'TEMP_CRIT' },
    { level: 'CRITICAL', message: 'Panne système aération', code: 'AERATION_FAIL' },
    { level: 'CRITICAL', message: 'Mortalité anormale détectée', code: 'MORTALITY_SPIKE' }
  ],
  WARNING: [
    { level: 'WARNING', message: 'Nourriture stock faible', code: 'FEED_LOW' },
    { level: 'WARNING', message: 'Traitement préventif à programmer', code: 'TREATMENT_DUE' },
    { level: 'WARNING', message: 'Contrôle sanitaire périodique', code: 'HEALTH_CHECK' },
    { level: 'WARNING', message: 'Relance client en retard', code: 'CLIENT_REMINDER' }
  ],
  INFO: [
    { level: 'INFO', message: 'Récolte programmée dans 7 jours', code: 'HARVEST_7D' },
    { level: 'INFO', message: 'Commande client à préparer', code: 'ORDER_PREP' },
    { level: 'INFO', message: 'Rapport mensuel généré', code: 'MONTHLY_REPORT' }
  ]
};

// Types supplémentaires
export interface Cohort {
  id: string;
  species: string;
  startDate: string; // ISO
  initialBiomassKg: number;
  currentBiomassKg?: number;
  mortalityRate?: number; // %
}

export interface UnitProductionAquacole { // UPA
  id: string;
  name: string;
  location?: string;
  cohorts?: Cohort[];
}

// Calculs utiles (signatures) — implémentation dans src/utils/zootech.ts
export interface GrowthMetrics {
  tcqDailyPercent: number; // taux croissance quotidien moyen en %
  icA: number; // indice de conversion alimentaire (ICA)
  costPerKg?: number; // coût de production par kg
}
