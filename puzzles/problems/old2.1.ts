// puzzles/problems/assignment2.ts

/**
 * Problem: Conveyor Belt Package Sorter
 *
 * You are simulating a conveyor belt system in a warehouse.
 * Packages arrive in order with a type (string) and weight (number).
 * The belt operator can remove packages from the front and place them on separate sorting lanes.
 * Return the final contents of each lane by type.
 *
 * Rules:
 *   - Packages of the same type go to the same lane.
 *   - Lanes are created lazily when the first package of that type arrives.
 *   - Maintain original arrival order within each lane.
 *
 * Input:
 *   - Array of { type: string, weight: number } objects
 * Output:
 *   - Record<string, { type: string, weight: number }[]> mapping lane type to packages
 *
 * Examples:
 *   conveyorSort([{type:"A",weight:2},{type:"B",weight:1},{type:"A",weight:3}])
 *     => { A: [{type:"A",weight:2},{type:"A",weight:3}], B: [{type:"B",weight:1}] }
 *   conveyorSort([]) => {}
 */
type Package = { type: string; weight: number };

type Record = {
	[type: string]: Package[];
};
export function conveyorSort(
	packages: { type: string; weight: number }[]
): Record {
	let output: Record = {};

	for (const pack of packages) {
		if (pack.type in output) {
			output[pack.type].push(pack);
		} else {
			output = {
				...output,
				[pack.type]: [pack],
			};
		}
	}

	return output;
}

const input = [
	{ type: "A", weight: 2 },
	{ type: "B", weight: 1 },
	{ type: "A", weight: 3 },
];
//console.log(conveyorSort(input));
