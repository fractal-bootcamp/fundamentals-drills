import { describe, it, expect } from 'vitest';
import { countGreaterThan } from '../problems/assignment1';

describe('countGreaterThan', () => {
  it('handles empty array', () => {
    expect(countGreaterThan([], 0)).toBe(0);
  });

  it('counts strictly greater than threshold', () => {
    expect(countGreaterThan([1, 5, 5, 7], 5)).toBe(1);
    expect(countGreaterThan([6, 7, 8], 5)).toBe(3);
    expect(countGreaterThan([5, 5, 5], 5)).toBe(0);
  });

  it('works with negatives and mixed values', () => {
    expect(countGreaterThan([-3, -2, -1], -2)).toBe(1); // only -1
    expect(countGreaterThan([-1, 0, 1], 0)).toBe(1); // only 1
  });

  it('handles duplicates and zeros', () => {
    expect(countGreaterThan([0, 0, 1, 2, 2], 1)).toBe(2);
    expect(countGreaterThan([0, 0, 0], -1)).toBe(3);
  });

  it('property-like: reversing input does not change the answer', () => {
    const cases: Array<{ arr: number[]; t: number; expected: number }> = [
      { arr: [1, 2, 3], t: 1, expected: 2 },
      { arr: [5, 5, 5], t: 5, expected: 0 },
      { arr: [-2, -1, 0], t: -2, expected: 2 },
      { arr: [], t: 10, expected: 0 },
    ];
    for (const { arr, t, expected } of cases) {
      expect(countGreaterThan(arr, t)).toBe(expected);
      expect(countGreaterThan([...arr].reverse(), t)).toBe(expected);
    }
  });

  it('property-like: increasing threshold never increases the count', () => {
    const arr = [1, 2, 2, 3, 5];
    const low = countGreaterThan(arr, 1);
    const mid = countGreaterThan(arr, 2);
    const high = countGreaterThan(arr, 10);
    expect(low).toBeGreaterThanOrEqual(mid);
    expect(mid).toBeGreaterThanOrEqual(high);
  });
});
