// Utilitaires zootechniques pour calculs aquacoles et hélicicoles
// TCQ (taux de croissance quotidien) et ICA (indice de conversion alimentaire)

/**
 * Calcul du taux de croissance quotidien moyen (TCQ)
 * Formule: ((poids final / poids initial) ^ (1/jours)) - 1
 */
export function calculateTCQ(initialWeightKg: number, finalWeightKg: number, days: number): number {
  if (days <= 0) throw new Error('Le nombre de jours doit être > 0');
  if (initialWeightKg <= 0) throw new Error('Le poids initial doit être > 0');
  const tcq = Math.pow(finalWeightKg / initialWeightKg, 1 / days) - 1;
  return Number((tcq * 100).toFixed(4)); // Retourne en pourcentage
}

/**
 * Indice de Conversion Alimentaire (ICA)
 * ICA = aliment consommé (kg) / gain de poids (kg)
 */
export function calculateICA(feedKg: number, biomassGainKg: number): number {
  if (biomassGainKg <= 0) return Infinity;
  return Number((feedKg / biomassGainKg).toFixed(4));
}

/**
 * Calcul du coût par kilogramme produit
 */
export function costPerKg(totalCost: number, biomassKg: number): number {
  if (biomassKg <= 0) return Infinity;
  return Number((totalCost / biomassKg).toFixed(2));
}

/**
 * Formatage en pourcentage
 */
export function formatPercentage(value: number, decimals = 2): string {
  return (value * 100).toFixed(decimals) + '%';
}

export default {
  calculateTCQ,
  calculateICA,
  costPerKg,
  formatPercentage
};
