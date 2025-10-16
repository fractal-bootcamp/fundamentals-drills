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

// store completed
// store partial?
// store total runtime
// when a task finishes look for tasks with no dependencies lefts and process
//

//helper to get all next tasks
//
//all dependencies are completed
type Task = { id: string; duration: number; dependencies: string[] };

function getNextTasks(incompleted: Task[]): Task[] {
	let nextTasks: Task[] = [];
	//if an incomplete task include a dependency of an incomplete task
	for (const task of incompleted) {
		let notDependent = true;
		for (const incomplete of incompleted) {
			if (task.dependencies.includes(incomplete.id)) {
				notDependent = false;
			}
		}
		if (notDependent) nextTasks.push(task);
	}
	return nextTasks;
}

export function scheduleTime(tasks: Task[]): number {
	// problem: tasks can finish at different times. And nextTasks can have shorter duration than current tasks in queue

	// ALGO
	// getNextTasks
	// sort into queue by duration.
	// shift from queue, mark as completed, decrease entire queue duration, update totalDuration
	// find nextTasks add to queue and resort
	let totalDuration = 0;
	let taskQueue: Task[] = [];
	let incomplete = structuredClone(tasks);
	while (incomplete.length > 0) {
		const nextTasks = getNextTasks(incomplete).filter(
			(t) => !taskQueue.includes(t)
		);
		//console.log("nextTasks:", nextTasks);
		//incomplete = incomplete.filter((t) => !nextTasks.includes(t))
		taskQueue.push(...nextTasks);
		taskQueue = taskQueue.sort((a, b) => a.duration - b.duration);
		const next = taskQueue.shift();
		//console.log(next);
		incomplete = incomplete.filter((t) => t !== next);
		//console.log("incomplete", incomplete);
		totalDuration += next!.duration;
		for (const task of taskQueue) {
			task.duration -= next!.duration;
		}
		//console.log("taskQueue", taskQueue);
		//console.log("totalDuration", totalDuration);
	}

	return totalDuration;
}

const tasks = [
	{ id: "A", duration: 3, dependencies: [] },
	{ id: "B", duration: 2, dependencies: ["A"] },
	{ id: "C", duration: 4, dependencies: ["A"] },
	{ id: "D", duration: 1, dependencies: ["B", "C"] },
];
const incompleted = [
	{ id: "B", duration: 2, dependencies: ["A"] },
	{ id: "C", duration: 4, dependencies: ["A"] },
	{ id: "D", duration: 1, dependencies: ["B", "C"] },
];

const input = [
	{ id: "A", duration: 4, dependencies: [] },
	{ id: "B", duration: 2, dependencies: [] },
	{ id: "C", duration: 5, dependencies: [] },
];
//console.log(getNextTasks(incompleted));
//console.log(getNextTasks(tasks));
//scheduleTime(input);
