import { describe, it, expect } from 'vitest';
import { longestStreak } from '../problems/assignment1';

describe('longestStreak', () => {
  it('should find longest consecutive streak from example', () => {
    expect(longestStreak([1,2,3,5,6,7,8,10])).toBe(4);
  });

  it('should return 1 for array with all same numbers', () => {
    expect(longestStreak([5,5,5])).toBe(1);
  });

  it('should return 0 for empty array', () => {
    expect(longestStreak([])).toBe(0);
  });

  it('should handle single element array', () => {
    expect(longestStreak([42])).toBe(1);
  });

  it('should handle perfectly consecutive array', () => {
    expect(longestStreak([1,2,3,4,5])).toBe(5);
  });

  it('should handle array with no consecutive elements', () => {
    expect(longestStreak([1,3,5,7,9])).toBe(1);
  });

  it('should handle array with multiple streaks', () => {
    expect(longestStreak([1,2,3,10,11,12,13,14,20,21,22,0,0,0,45,46,47])).toBe(5);
  });

  it('should handle negative consecutive numbers', () => {
    expect(longestStreak([-3,-2,-1,0,1])).toBe(5);
  });

  it('should handle mixed positive and negative with gaps', () => {
    expect(longestStreak([-5,-4,-3,0,1,2,10,11])).toBe(3);
  });

  it('should handle unsorted array', () => {
    expect(longestStreak([3,1,2,4,5])).toBe(2); // 1,2 is the longest consecutive run in array order
  });

  it('should handle duplicates breaking consecutive runs', () => {
    expect(longestStreak([1,2,2,3,4])).toBe(3); // 2,3,4 is the longest consecutive run
  });

  it('should handle large numbers', () => {
    expect(longestStreak([1000,1001,1002,2000,2001])).toBe(3);
  });

  it('should handle array starting with consecutive sequence', () => {
    expect(longestStreak([1,2,3,4,10,15,20])).toBe(4);
  });

  it('should handle array ending with consecutive sequence', () => {
    expect(longestStreak([1,5,10,15,16,17,18,19])).toBe(5); // 15,16,17,18,19 is the longest consecutive run
  });

  it('should handle two element consecutive array', () => {
    expect(longestStreak([5,6])).toBe(2);
  });

  it('should handle two element non-consecutive array', () => {
    expect(longestStreak([5,10])).toBe(1);
  });

  it('should handle reverse sorted array', () => {
    expect(longestStreak([10,9,8,7,6])).toBe(1);
  });

  it('should handle array with zeros', () => {
    expect(longestStreak([0,1,2,0,0,3,4,5])).toBe(3); // 0,1,2 and 3,4,5 are both length 3
  });

  it('should handle very long consecutive sequence', () => {
    const longArray = Array.from({length: 100}, (_, i) => i + 1);
    expect(longestStreak(longArray)).toBe(100);
  });

  it('should handle array with repeated consecutive patterns', () => {
    expect(longestStreak([1,2,5,6,7,10,11])).toBe(3);
  });
});