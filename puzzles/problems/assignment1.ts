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
  // start count @ 0
  let streak = 0
  console.log('count at start:', streak)

  for (let i = 0; i < nums.length; i++) {
    let difference = nums[i + 1] - nums[i]
    console.log('difference:', difference)

    if (difference === 1) {
      streak++
      console.log(`streak if difference of ${nums[i + 1]} - ${nums[i]} === 1:`, streak) // increment count by 1 if num 1 greater
    } else {  // decrement count by 1 if num not 1 greater
      streak = 0
      console.log(`streak if difference of ${nums[i + 1]} - ${nums[i]} !== 1:`, streak)
    }
  }
  console.log('count at end:', streak)
  return streak
}



// take first element in array

// compare last element to current element -- is it 1 greater?

// reduce might not work here =( 
// const streak = nums.reduce((prev, curr) => curr - prev)
// console.log('streak is:', streak)
// how to find if these 2 nums are 1 greater than each other?
// subtract the curr from prev is it === 1?
// if yes then add to count  -- this needs to iterate over all elements in array

//return count 