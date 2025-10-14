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
  let maxStreak = 0
  let streak = 1
  console.log('maxStreak count at start:', maxStreak)

  console.log('starting array:', nums)

  if (nums.length === 1) return 1

  for (let i = 0; i < nums.length - 1; i++) {
    let difference = nums[i + 1] - nums[i]

    console.log(`difference b/t ${nums[i + 1]} - ${nums[i]}:`, difference)

    if (difference === 1) {
      streak++
      console.log(`streak if difference of ${nums[i + 1]} - ${nums[i]} === 1:`, streak) // increment count by 1 if num 1 greater
    } else {  // decrement count by 1 if num not 1 greater
      streak = 1
      console.log(`streak if difference of ${nums[i + 1]} - ${nums[i]} !== 1:`, streak)
    }
    if (streak > maxStreak) maxStreak = streak
  }
  console.log('maxStreak count at end:', maxStreak)
  return maxStreak
}
