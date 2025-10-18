// puzzles/problems/assignment1d.ts

/**
 * Problem: Meeting Room Conflict (Half-Open)
 *
 * Context:
 * A meeting uses minutes-since-midnight. Each meeting is half-open: [start, end),
 * so a meeting ending at t and another starting at t do not overlap.
 * Determine if any pair of meetings overlaps.
 *
 * Input:
 * - meetings: Array<{ start: number; end: number }>
 *   - Invariant: 0 <= start <= end, integers.
 *
 * Output:
 * - boolean
 *   - true if any overlap exists; false otherwise.
 *
 * Examples:
 * - [{s:0,e:30},{s:30,e:60}] -> false
 * - [{s:0,e:30},{s:29,e:40}] -> true
 */
export function hasMeetingConflict(
    meetings: Array<{ start: number; end: number }>
): boolean {
    throw new Error("Not implemented");
}
