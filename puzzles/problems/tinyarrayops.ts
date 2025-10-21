// puzzles/problems/assignment1.ts

/**
 * Assignment 0.5 — Tiny Array Ops (two micro-tasks via a mode flag)
 *
 * Context:
 * Practice basic array and number syntax. Implement a single function
 * that performs one of two tiny operations based on the provided `mode`.
 *
 * Input/Output:
 * - Input:
 *   - nums: number[] (may be empty; may contain negatives, zeros, positives)
 *   - mode: "sumPositives" | "countZeros"
 * - Output:
 *   - number
 *     - "sumPositives": sum of all numbers > 0
 *     - "countZeros": how many elements equal 0
 *
 * Invariants:
 * - Do not mutate the input array.
 * - Treat non-positive numbers (<= 0) as not positive.
 *
 * Examples:
 * - arrayMini([1, -2, 3, 0, 2], "sumPositives") -> 6
 * - arrayMini([0, 1, 0, 2, 0], "countZeros") -> 3
 */
export function arrayMini(
    nums: number[],
    mode: "sumPositives" | "countZeros"
): number {
    let answer = 0;
    if (mode == "sumPositives") {
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] > 0) { answer = answer + nums[i] }
        }
    }
    else {
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] === 0) (answer = answer + 1)
        }
    }
    return answer
}

// sketch
// need to check each array for which mode, split function on a conditional
// sumPositives mode: check each number. if positive, add to total. return total
// countZeros mode: check each number. if zero, add to count. return count

// pseudo
// if (arr[i].mode == "sumPositives"){
//  let sum = 0;
//  for (let i = 0; i < arr.length; i++){
//      if (arr[i] > 0){ sum = sum + arr[i]}
//   }
// }
// else{
// let count = 0
// for (let i = 0; i < arr.length; i++){
//  if (arr[i] === 0)(count = count + arr[i])
// }
//  }
