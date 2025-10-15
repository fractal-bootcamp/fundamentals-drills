/**
 * Temperature Threshold Counter
 * 
 * You are analyzing temperature readings from a weather station. Given an array
 * of temperature readings (in Celsius) and a threshold temperature, count how many
 * consecutive days the temperature stayed at or above the threshold. Return the
 * length of the longest such streak.
 * 
 * Input:
 *  - temperatures: number[] - Array of temperature readings (can be negative, zero, or positive)
 *  - threshold: number - The minimum temperature for a day to count toward the streak
 * 
 * Output:
 *  - number - The length of the longest consecutive streak at or above threshold
 * 
 * Examples:
 *  - longestHeatStreak([20, 25, 30, 18, 22, 24, 26], 22) → 2 (days with 22, 24, 26)
 *  - longestHeatStreak([15, 14, 13, 20, 21, 22], 20) → 3 (days with 20, 21, 22)
 */

export function longestHeatStreak(temperatures: number[], threshold: number): number {
  let longestStreak = 0
  let streak = 0

  for (let i = 0; i < temperatures.length; i++) {
    const currentTemp = temperatures[i]

    if (currentTemp >= threshold) {
      streak++
    } else {
      streak = 0
    }

    if (streak > longestStreak) longestStreak = streak
  }

  // return longestStreak
  return longestStreak;
}