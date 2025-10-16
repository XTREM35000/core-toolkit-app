import { calculateTCQ, calculateICA } from './zootech';

describe('zootech utils', () => {
  test('calculateTCQ returns 0 for invalid data', () => {
    const cohort: any = { startDate: new Date().toISOString(), initialBiomassKg: 0 };
    expect(calculateTCQ(cohort)).toBe(0);
  });

  test('calculateICA computes ratio', () => {
    expect(calculateICA(10, 2)).toBeCloseTo(5);
    expect(calculateICA(0, 1)).toBe(0);
    expect(calculateICA(5, 0)).toBe(Infinity);
  });
});
