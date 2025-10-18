/**
 * Assignment 1 — Count Greater Than
 *
 * Context:
 * A common primitive in analytics is counting how many values exceed a
 * threshold. Given a list of integers and a threshold, return how many items
 * are strictly greater than the threshold.
 *
 * Input:
 *  - nums: number[] — may be empty; may include negatives and duplicates.
 *  - threshold: number — an integer to compare against.
 * Output:
 *  - number — the count of elements x in nums where x > threshold.
 *
 * Examples:
 *  - countGreaterThan([1, 5, 5, 7], 5) -> 1
 *  - countGreaterThan([], 0) -> 0
 */
export function countGreaterThan(nums: number[], threshold: number): number {
  let count = 0;
  for (let number of nums) {
    if (number > threshold) {
      count++;
    } else {
      count;
    }
  }

  return count;
}

