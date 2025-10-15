// Counts how many numbers in nums are within the range [start, end].
// The range is inclusive — that is, numbers equal to start or end should be counted.
// Example:
// countInRange([1, 2, 3, 4, 5], 2, 4) → 3



/** 
@param nums - Array of integers.
@param start - The inclusive start of the range.
@param end - The inclusive end of the range.
@returns The count of numbers x such that start <= x <= end.*
*/

export function countInRange(nums: number[], start: number, end: number): number {
  // Be careful about off-by-one errors with inclusive bounds!

  let range = 0

  // handles reversed ranges (start > end) gracefully
  if (start > end) range = 0

  for (let i = 0; i < nums.length; i++) {
    const currentNumber = nums[i]

    if (currentNumber >= start && currentNumber <= end) {
      range++
    }
  }

  return range
}
