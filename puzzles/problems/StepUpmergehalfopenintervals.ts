// puzzles/problems/intermediate1.ts

/**
 * Problem (Intermediate): Merge Half-Open Intervals
 *
 * Context:
 * You are given a list of time blocks as half-open intervals [start, end).
 * Intervals may be unsorted and may overlap. Merge only overlapping intervals.
 * Touching intervals (e.g., [1,3) and [3,5)) DO NOT merge because endpoints do not overlap.
 *
 * Input:
 * - intervals: Array<{ start: number; end: number }>
 *   - Invariant: 0 <= start <= end, integers.
 *
 * Output:
 * - Array<{ start: number; end: number }>
 *   - The merged, non-overlapping intervals, sorted by start ascending.
 *
 * Examples:
 * - [{1,3},{2,4}] -> [{1,4}]
 * - [{1,3},{3,5}] -> [{1,3},{3,5}]  (touching, not merged)
 */
export function mergeHalfOpenIntervals(
    intervals: Array<{ start: number; end: number }>
): Array<{ start: number; end: number }> {
    throw new Error("Not implemented");
}
