// Utilitaires zootechniques : calculs TCQ (taux de croissance quotidien moyen) et ICA (indice de conversion alimentaire)

export function calculateTCQ(initialWeightKg: number, finalWeightKg: number, days: number): number {
  if (days <= 0) throw new Error('days must be > 0');
  if (initialWeightKg <= 0) throw new Error('initialWeightKg must be > 0');
  const tcq = Math.pow(finalWeightKg / initialWeightKg, 1 / days) - 1;
  return tcq;
}

export function calculateICA(feedKg: number, biomassGainKg: number): number {
  if (biomassGainKg <= 0) throw new Error('biomassGainKg must be > 0');
  return feedKg / biomassGainKg;
}

// helper: format as percentage (e.g., TCQ * 100)
export function formatPercentage(value: number, decimals = 2): string {
  return (value * 100).toFixed(decimals) + '%';
}

export default {
  calculateTCQ,
  calculateICA,
  formatPercentage
};
// Utilitaires zootechniques : calculs TCQ (taux de croissance quotidien) et ICA

export function dailyGrowthRate(previousKg: number, currentKg: number, days: number): number {
  if (days <= 0) throw new Error('days must be > 0');
  if (previousKg <= 0) return 0;
  // taux de croissance moyen quotidien (TCQ) approximatif
  return Math.pow(currentKg / previousKg, 1 / days) - 1;
}

export function feedConversionRatio(feedKg: number, biomassGainKg: number): number {
  if (biomassGainKg <= 0) return Infinity;
  return feedKg / biomassGainKg;
}

export function costPerKg(totalCost: number, biomassKg: number): number {
  if (biomassKg <= 0) return Infinity;
  return totalCost / biomassKg;
}

export default {
  dailyGrowthRate,
  feedConversionRatio,
  costPerKg
};
import { Cohort } from '../types/aquaculture';

/**
 * Calcul du taux de croissance quotidien moyen (TCQ) en pourcentage.
 * Formule simplifiée : ((current - initial) / initial) / days * 100
 */
export function calculateTCQ(cohort: Cohort): number {
  if (!cohort.currentBiomassKg || cohort.initialBiomassKg <= 0) return 0;
  const start = new Date(cohort.startDate);
  const now = new Date();
  const days = Math.max(1, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const growth = (cohort.currentBiomassKg - cohort.initialBiomassKg) / cohort.initialBiomassKg;
  return Number(((growth / days) * 100).toFixed(4));
}

/**
 * Indice de Conversion Alimentaire (ICA) basique.
 * ICA = aliment consommé (kg) / gain de poids (kg)
 * Si gain de poids <= 0, retourne Infinity
 */
export function calculateICA(feedConsumedKg: number, weightGainKg: number): number {
  if (weightGainKg <= 0) return Infinity;
  return Number((feedConsumedKg / weightGainKg).toFixed(4));
}

export default { calculateTCQ, calculateICA };
