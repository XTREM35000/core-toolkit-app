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
