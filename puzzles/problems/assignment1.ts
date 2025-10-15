/**
 * Assignment 1 — Consecutive Sum Streak
 *
 * Context:
 * In analytics or signal processing, we sometimes want to detect “streaks” of rising data. Given an array of integers,
 * return the length of the longest consecutive increasing run (where each next number is exactly 1 greater).
 * For example, [1,2,3,5,6,7,8,10] has a longest streak [5,6,7,8] of length 4.
 * 
 *
 * Input:
 *   - nums: number[] — may be empty or contain duplicates.
 * Output:
 *   - number — length of the longest strictly consecutive +1 run.
 *
 * Examples:
 *   longestStreak([1,2,3,5,6,7,8,10]) -> 4
 *   longestStreak([5,5,5]) -> 1
 */

// example: [4,5,6,7,0,91,22] -> 4
// [1,5,8,9,10,11,12] -> 5

export function longestStreak(nums: number[]): number {
  if (nums.length == 0) {
    return 0;
  }

  let streak = 1;
  let longestStreakSoFar = 1;
  // [1,2,5,6,7,10,11]
  for (let i = 0; i < nums.length - 1; i++) {
    let previousNum = nums[i];
    let currentNum = nums[i + 1];

    if (currentNum - previousNum == 1) {
      streak++;
    } else {
      streak = 1;
    }

    if (streak > longestStreakSoFar) {
      longestStreakSoFar = streak;
    }
  }
  return longestStreakSoFar;
}