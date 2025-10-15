// Counts how many numbers in nums are within the range [start, end].*
// The range is inclusive** — that is, numbers equal to start or end should be counted.*
// @param nums - Array of integers.
// @param start - The inclusive start of the range.
// @param end - The inclusive end of the range.
// @returns The count of numbers x such that start <= x <= end.*

// Example:
// countInRange([1, 2, 3, 4, 5], 2, 4) → 3*/

export function countInRange(nums: number[], start: number, end: number): number {
    if (nums.length === 0) {
        return 0;
    }

    // if nums has start and end number in it, count how many in between
    // start match one of the num in nums && end match on of the num in nums && num[i] num[j] i < j 

    let countRange = 2;

    //[-5, -1, 0, 3, 5], -1, 3)
    // ([3], 3, 3)
    for (let i = 0; i < nums.length; i++) {
        if (start !== nums[i] || end !== nums[i]) {
            countRange = 0;
        }

        if (start === nums[i]) { //i = 1, j= 3, 
            console.log(`start number: ${start}`)
            for (let j = 0; j < nums.length; j++) {
                if (end === nums[j] && (i <= j)) {
                    console.log(`end number: ${end}`)
                    console.log(`j: ${j} and i: ${i}`)
                    countRange = j - i + 1;
                    console.log(`count range: ${countRange}`)
                }
            }
            return countRange;
        }
    }

    return countRange;

}
