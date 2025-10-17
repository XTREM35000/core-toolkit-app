import { calculateTCQ, calculateICA } from '../utils/zootech';

describe('zootech utils', () => {
  it('calculates TCQ for growth', () => {
    const tcq = calculateTCQ(1, 2, 10); // doubling in 10 days
    expect(tcq).toBeGreaterThan(0);
  });

  it('calculates ICA correctly', () => {
    const ica = calculateICA(10, 5); // 10kg feed for 5kg gain => ICA 2
    expect(ica).toBeCloseTo(2);
  });
});
import { describe, it, expect } from 'vitest';
import { dailyGrowthRate, feedConversionRatio, costPerKg } from '../utils/zootech';

describe('zootech utils', () => {
  it('calculates daily growth rate', () => {
    const rate = dailyGrowthRate(100, 200, 10);
    // growth from 100 to 200 in 10 days ~ 7.177% per day
    expect(rate).toBeGreaterThan(0.07);
  });

  it('calculates feed conversion ratio', () => {
    expect(feedConversionRatio(200, 100)).toBe(2);
    expect(feedConversionRatio(50, 0)).toBe(Number.POSITIVE_INFINITY);
  });

  it('calculates cost per kg', () => {
    expect(costPerKg(500, 100)).toBe(5);
    expect(costPerKg(100, 0)).toBe(Number.POSITIVE_INFINITY);
  });
});
