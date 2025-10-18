// puzzles/problems/assignment1b.ts

/**
 * Problem: Run-Length Compress (Consecutive)
 *
 * Context:
 * Given a list of integers, compress it into consecutive runs. Each run
 * is represented by an object { value, count } describing a maximal sequence
 * of the same number repeated contiguously.
 *
 * Input:
 * - nums: number[] (can be empty).
 *
 * Output:
 * - Array<{ value: number; count: number }>
 *   - One entry per consecutive run, in input order.
 *
 * Examples:
 * - [1,1,2,2,2,3] -> [{value:1,count:2},{value:2,count:3},{value:3,count:1}]
 * - [] -> []
 */
export function compressRuns(
    nums: number[]
): Array<{ value: number; count: number }> {
    throw new Error("Not implemented");
}
