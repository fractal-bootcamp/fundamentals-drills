/**
 * Assignment 1 — Consecutive Sum Streak
 *
 * Context:
 * In analytics or signal processing, we sometimes want to detect “streaks” of rising data. Given an array of integers,
 * return the length of the longest consecutive increasing run (where each next number is exactly 1 greater).
 * For example, [1,2,3,5,6,7,8,10] has a longest streak [5,6,7,8] of length 4.
 *
 * Input:
 *   - nums: number[] — may be empty or contain duplicates.
 * Output:
 *   - number — length of the longest strictly consecutive +1 run.
 *
 * Examples:
 *   longestStreak([1,2,3,5,6,7,8,10]) -> 4
 *   longestStreak([5,5,5]) -> 1
 *   longestStreak([]) -> 0
 */
export function longestStreak(nums: number[]): number {
  //hold a temp counting variable
  //at the end of a streak, update longest streak variable
  //one pass- as you iterate through the array, reset the counter when the next number is more than 1 greater than the previous value
  let longest = 0;
  if (nums.length > 0) {
    if (nums.length == 1) { return 1 } //one element array

    let tempStreak = 1;

    for (let i = 1; i < nums.length; i++) {

      if (nums[i] - nums[i - 1] == 1) { //increment tempStreak if current val is 1 greater than prev val
        tempStreak += 1;
        if (tempStreak >= longest) { longest = tempStreak; }
      }
      else {

        tempStreak = 1;
        if (longest < tempStreak) { longest += 1 }

      }


    }
    return longest;

  }

  return 0 //empty array
}