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
  let prevInteger = nums[0];
  let oldCount = 0;
  let newCount = 0;

  for (let i = 0; i < nums.length; i++) {
    let currentInteger = i;

    if (currentInteger > prevInteger && currentInteger < prevInteger + 2) {
      newCount += 1

    }
    else oldCount = newCount;
    newCount = 0;
  }

  return (oldCount)
}

//pseudo
// let prevInteger = 0
// let oldCount = 0

// for each integer in array
// currentInteger = i
// newCount = 0
// if currentInteger > prevInteger && currentInteger < prevInteger + 2,
// then newCount += 1
// else oldCount = newCount
//  newCount = 0
// return oldCount

// sketch
// each time the consecutive int is +1, counter up 1
// if next int is >+1 or <+1, store count and restart counter
// if newCount > oldCount, oldCount = newCount, newCount = 0
// return newCount
// i think i need to actually start the comparison backwards? store first int,
// then move to second int and compare second to first. how to represent that the value is
// greater by exactly 1? greater than first int && less than second int+2

