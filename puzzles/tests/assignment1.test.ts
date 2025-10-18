import { describe, it, expect } from 'vitest';
import { mostFrequent } from '../problems/assignment1';

describe('mostFrequent', () => {
  it('returns null for empty input', () => {
    expect(mostFrequent([])).toBeNull();
  });

  it('returns the only item for single-element input', () => {
    expect(mostFrequent(['x'])).toBe('x');
  });

  it('returns the correct most frequent item', () => {
    expect(mostFrequent(['a', 'b', 'a', 'c', 'b', 'a'])).toBe('a');
  });

  it('breaks ties by lexicographic order', () => {
    expect(mostFrequent(['b', 'a'])).toBe('a');
    expect(mostFrequent(['b', 'c', 'a', 'a', 'b', 'c'])).toBe('a');
  });

  it('is case-sensitive and uses standard string order', () => {
    // 'A' and 'a' with equal counts should return 'A' (since 'A' < 'a')
    expect(mostFrequent(['A', 'a', 'a', 'A'])).toBe('A');
  });

  it('property-like: order of input does not change the result', () => {
    const cases: Array<{ arr: string[]; expected: string | null }> = [
      { arr: ['x', 'y', 'x', 'z'], expected: 'x' },
      { arr: ['z', 'x', 'y', 'x'], expected: 'x' },
      { arr: [], expected: null },
    ];
    for (const { arr, expected } of cases) {
      expect(mostFrequent(arr)).toBe(expected);
      expect(mostFrequent([...arr].reverse())).toBe(expected);
    }
  });

  it('property-like: adding more of the winner keeps the same winner', () => {
    const base = ['x', 'y', 'x', 'z'];
    const withExtra = ['x', ...base];
    expect(mostFrequent(base)).toBe('x');
    expect(mostFrequent(withExtra)).toBe('x');
  });
});
