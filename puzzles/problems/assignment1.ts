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
  let newArray: number[] = []
  let count = 0

  for (let i = 0; i < nums.length; i++) {
    if (nums.length === 0) {
      count = 0
    } else if (nums[i + 1] - nums[i] === 1) {
      newArray.push(nums[i])
      count = newArray.length
      if (i === nums.length) {
        count = count + 1
      }
      //  {
      //   newArray.push(nums[i])
      //   count = newArray.length
      // } else {
      //  newArray.push(nums[i])
      // count = newArray.length + 1
      // }
    }  else if (nums.length === 1) {
      count = 1
    } else if (nums[i + 1] - nums[i] !== 1) {
      count = 1
    }
  }
  console.log(count, newArray)
  return count
}

// (nums[i + 1] - nums[i] === 0)