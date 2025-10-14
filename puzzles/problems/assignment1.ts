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

// check the array
// hold a previous value that starts off as undefined
// hold a value for streak counter, starts off as 0
// for each number in the array, 
// check if the value is equal to 1 + previous value
// if so, then increment the streak counter by 1
// if not, reset the streak counter to 0
// set the current value to the previous value


type ComparisonValue = number | undefined

export function longestStreak(nums: number[]): number {
  
  let comparisonValue: ComparisonValue = undefined
  let streakCounter: number = 1
  let streakArray: number[] = []
  let longestStreakValue: number = 0

  // if nums.length === 0 then push 0

  for (let i = 0; i < nums.length; i++) {
    let currentValue = nums[i]
    
    if (!comparisonValue) {
        console.log('No comparison value')
        streakArray.push(streakCounter)
        comparisonValue = currentValue
    } else if (currentValue === comparisonValue + 1) {
      streakCounter += 1
      comparisonValue = currentValue
      console.log(`Streak is now ${streakCounter} at position index ${i} (value: ${currentValue}, comparison value ${comparisonValue}`)
    } else if (currentValue !== comparisonValue + 1) {
        streakArray.push(streakCounter)
        comparisonValue = currentValue
        streakCounter = 1
        console.log(`Streak reset at position index ${i} (value: ${currentValue}, comparison value ${comparisonValue}`)
    // } else if (currentValue !== comparisonValue + 1 && streakCounter <= 1) {
    //   streakCounter = 1  
    //   break
    }
  }

  streakArray.push(streakCounter)


  for (let j = 0; j < streakArray.length; j++) {
    if (streakArray[j] >= longestStreakValue) {
      longestStreakValue = streakArray[j]
      console.log('Longest Streak:', longestStreakValue)
    } 
  }
  return longestStreakValue
}