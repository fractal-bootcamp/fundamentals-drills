// puzzles/problems/assignment1.ts

/**
 * Peaks in an Elevation Profile
 *
 * You are given a discrete elevation profile as an array of integers. An index `i` is a *peak*
 * if its value is strictly greater than each adjacent neighbor that exists. For index 0, only
 * compare the right neighbor; for the last index, only compare the left neighbor. A single-element
 * array counts as having a peak at index 0.
 *
 * Input: `heights: number[]` (finite array of integers; may be empty; values may repeat)
 * Output: `number[]` — the indices of all peaks in strictly increasing order.
 *
 * Examples:
 *   findPeaks([1,2,1,9,4,6,4]) -> [1,3,5]
 *   findPeaks([5]) -> [0]
 */

// Time to Complete 10 min, but spent extra 30 playing around with conditionals cause it was kinda fun

export function findPeaks(heights: number[]): number[] {
  let peaks: number[] = [];

  if (heights.length === 1) return [0];

  for (let i = 0; i < heights.length; i++) {
    const hasLeft = i > 0 ? true : false;
    const hasRight = i < heights.length - 1 ? true : false;
    const initialPeak = !hasLeft && hasRight && heights[i + 1] < heights[i];
    const lastPeak = !hasRight && hasLeft && heights[i - 1] < heights[i];
    const peak =
      hasLeft &&
      heights[i - 1] < heights[i] &&
      hasRight &&
      heights[i + 1] < heights[i];

    if (peak) peaks.push(i);
    if (lastPeak) peaks.push(i);
    if (initialPeak) peaks.push(i);
  }

  return peaks;
}
