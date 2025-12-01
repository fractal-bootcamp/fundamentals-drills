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
function isConsecutive(number1, number2) {
  if (number1 + 1 == number2) {
    return true
  }
}

export function longestStreak(nums: number[]): number {
  let consecutiveSumStreak = 0;
  let streaksArray = []
  // 1. Handle edge cases.
  if (nums.length === 0) {
    return 0
  }

  if (nums.length === 1) {
    return 1
  }

  for (let i = 0; i <= nums.length; i++) {
    // const previousNumber = i - 1 >= 0 ? nums[i - 1] : 0
    const currentNumber = nums[i]
    // zero is making previous number 
    if (nums[i - 1] !== 0 && !nums[i - 1]) {
      consecutiveSumStreak++
    } else if (currentNumber - 1 === nums[i - 1]) {
      console.log(`adding ${currentNumber} to streak`)
      consecutiveSumStreak++
    } else {
      console.log('made it to else')
      console.log(consecutiveSumStreak)
      streaksArray.push(consecutiveSumStreak)
      consecutiveSumStreak = 1
    }
  }

  return Math.max(...streaksArray)
}