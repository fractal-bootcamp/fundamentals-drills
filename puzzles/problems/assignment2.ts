// puzzles/problems/assignment2.ts

/**
 * Problem: Task Scheduler Simulation
 *
 * You are building a simple task scheduler.
 * Each task has:
 *   - id: string
 *   - duration: number (positive integer)
 *   - dependencies: string[] (list of other task ids that must complete first)
 *
 * The scheduler runs tasks as soon as all their dependencies are finished.
 * Tasks run *in parallel* whenever possible.
 *
 * Compute how many time units it takes to finish all tasks.
 *
 * Input:
 *   - Array<{ id: string; duration: number; dependencies: string[] }>
 *     - dependencies always refer to other ids in the list
 *     - input may be empty
 * Output:
 *   - number — total time to complete all tasks
 *
 * Examples:
 *   scheduleTime([
 *     { id: "A", duration: 3, dependencies: [] },
 *     { id: "B", duration: 2, dependencies: ["A"] },
 *     { id: "C", duration: 4, dependencies: ["A"] },
 *     { id: "D", duration: 1, dependencies: ["B","C"] },
 *   ]) => 8
 *   (A:0–3, B/C:3–5/3–7, D:7–8)
 *
 *   scheduleTime([]) => 0
 */
export function scheduleTime(
	tasks: { id: string; duration: number; dependencies: string[] }[]
) {
	throw new Error("Not implemented");
}
