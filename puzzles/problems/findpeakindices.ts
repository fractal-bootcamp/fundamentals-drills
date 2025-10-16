// puzzles/problems/assignment1.ts

/**
 * Find Peak Indices
 *
 * Context:
 * In a one-dimensional elevation profile represented by integers, a "peak" is a point that is
 * strictly higher than its immediate neighbors. This function scans the profile and returns
 * the zero-based indices of all such peaks in ascending order. Endpoints cannot be peaks because
 * each peak must have both a left and a right neighbor.
 *
 * Input:
 * - nums: ReadonlyArray<number> — any finite-length array of integers (can be empty).
 *   Invariants: `nums[i]` is a finite integer for all valid indices.
 *
 * Output:
 * - number[] — a new array containing indices `i` such that
 *   `nums[i] > nums[i - 1]` and `nums[i] > nums[i + 1]`. Sorted ascending. May be empty.
 *
 * Examples:
 * - [1, 2, 1, 9, 4, 6, 4] -> [1, 3, 5]
 * - [5, 4, 3, 2, 1] -> []
 */

export function findPeaks(nums: ReadonlyArray<number>): number[] {
    let peaks = []

    for (let i = 0; i < nums.length - 1; i++) {
        const prevNeighbor = nums[i - 1];
        const nextNeighbor = nums[i + 1];
        if (nums[i] > prevNeighbor && nums[i] > nextNeighbor) {
            peaks.push(i)
        }
    }
    const result = peaks.sort()
    return result

}

// sketch
// i want to loop over the array and check each non-endpoint digit for whether it is
//  greater than both neighbors and return the indices in ascending order
// 354397 -> 59

// pseudo
// catch = []
// for (i = 0; i < nums.length - 2) {
//  prevNeighbor = nums[i-1]
//  nextNeighbor = nums[i+1]
//  if (nums[i] > prevNeighbor && nums > nextNeighbor) {
//      catch.push(i)
//  }
// }
// result = catch.sort()
// return result
