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

  let numsLen = nums.length

  if (numsLen == 0) { return 0 }
  if (numsLen == 1) { return 1 }

  let currentStreak = 1
  let highestStreak = 1
  let isStreak = false

  let previous = nums[0]
  let current: number;

  for (let i = 1; i < numsLen; i++) { //Go through each index i 

    let current = nums[i]

    if (current == previous + 1) {
      isStreak = true
      currentStreak += 1
    } else {
      // if current is not one greater: if it is a streak, break streak. if not, nothing.
      if (isStreak) {
        isStreak = false
        if (currentStreak > highestStreak) {
          highestStreak = currentStreak
        }
        currentStreak = 1
      }
    }
    console.log(currentStreak, current, previous)

    previous = nums[i]

  }

  if (currentStreak > highestStreak) {
    highestStreak = currentStreak
  }

  return highestStreak

}
