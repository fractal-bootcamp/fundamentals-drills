// puzzles/problems/assignment2.ts
// @ts-nocheck
/**
 * Programming Puzzle — Drone Delivery Route Evaluator
 *
 * Context:
 * You are managing autonomous delivery drones that must complete delivery routes.
 * Each drone has limited battery capacity (represented by integer units).
 * Routes consist of segments, each with a distance cost.
 * Drones consume 1 battery unit per distance point traveled.
 *
 * Your task is to process all drones’ routes and determine:
 *   - which drones successfully completed their routes,
 *   - where the failed ones stopped,
 *   - and the total battery used by each successful drone.
 *
 * Input:
 * - capacity: number (maximum battery units each drone starts with)
 * - routes: Record<string, number[]> where keys are drone IDs, and values are arrays of segment distances
 *
 * Rules:
 * 1) Each drone starts with `capacity` battery units.
 * 2) For each segment distance `d`:
 *      - If remaining battery >= d, subtract it and continue.
 *      - If remaining battery < d, the drone fails *before* starting that segment.
 * 3) A drone that finishes all segments is “successful”.
 * 4) If a drone fails, record the index of the segment it failed on (0-based).
 * 5) Distances and capacities are positive integers; invalid routes are ignored.
 *
 * Output:
 * Return an object:
 * {
 *   successful: Record<string, { used: number }>;
 *   failed: Record<string, { failedAt: number; remaining: number }>;
 * }
 *
 * Edge cases:
 * - Empty routes object → both maps empty.
 * - Empty route array for a drone → success with used = 0.
 * - Segment of 0 or negative distance → ignored (skipped, not failure).
 * - Drones share the same capacity independently.
 *
 * Example:
 * capacity = 10
 * routes = {
 *   A: [3, 4, 2],       // uses 9 total → success
 *   B: [5, 7, 1],       // fails at segment index 1 (7 too far)
 *   C: [],              // succeeds with used=0
 * }
 * ⇒
 * successful = { A: { used: 9 }, C: { used: 0 } }
 * failed = { B: { failedAt: 1, remaining: 5 } }
 */

type Successful = Record<string, { used: number }>;
type Failed = Record<string, { failedAt: number; remaining: number }>;

export function evaluateDroneRoutes(
	capacity: number,
	routes: Record<string, number[]>
) {
	let failed: Failed = {};
	let successful: Successful = {};

	for (const drone in routes) {
		let battery = capacity;
		const route = routes[drone];
		if (!route) continue;
		if (route.length === 0) {
			successful = { ...successful, [drone]: { used: 0 } };
		}
		for (let i = 0; i < route.length; i++) {
			if (route[i] < 0) continue;
			if (battery - route[i] < 0) {
				failed = {
					...failed,
					[drone]: { failedAt: i, remaining: battery },
				};
				break;
			} else {
				battery -= route[i];
				if (i === route.length - 1)
					successful = {
						...successful,
						[drone]: { used: capacity - battery },
					};
			}
		}
	}

	return { successful, failed };
}

const capacity = 10;
const routes = {
	A: [3, 4, 2], // uses 9 total → success
	B: [5, 7, 1], // fails at segment index 1 (7 too far)
	C: [], // succeeds with used=0
};

const result = evaluateDroneRoutes(capacity, routes);
//console.log(result);
