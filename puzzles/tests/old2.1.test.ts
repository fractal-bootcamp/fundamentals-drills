// puzzles/tests/assignment2.test.ts

import { describe, it, expect } from "vitest";
import { conveyorSort } from "../problems/assignment2";

describe("conveyorSort", () => {
	it("returns empty object for empty input", () => {
		expect(conveyorSort([])).toEqual({});
	});

	it("sorts packages into lanes by type", () => {
		const input = [
			{ type: "A", weight: 2 },
			{ type: "B", weight: 1 },
			{ type: "A", weight: 3 },
			{ type: "C", weight: 4 },
			{ type: "B", weight: 2 },
		];
		const expected = {
			A: [{ type: "A", weight: 2 }, { type: "A", weight: 3 }],
			B: [{ type: "B", weight: 1 }, { type: "B", weight: 2 }],
			C: [{ type: "C", weight: 4 }],
		};
		expect(conveyorSort(input)).toEqual(expected);
	});

	it("maintains original order within lanes", () => {
		const input = [
			{ type: "X", weight: 10 },
			{ type: "X", weight: 5 },
			{ type: "Y", weight: 1 },
			{ type: "X", weight: 7 },
		];
		const output = conveyorSort(input);
		expect(output.X.map(p => p.weight)).toEqual([10, 5, 7]);
		expect(output.Y.map(p => p.weight)).toEqual([1]);
	});

	it("handles single package", () => {
		const input = [{ type: "Z", weight: 99 }];
		expect(conveyorSort(input)).toEqual({ Z: [{ type: "Z", weight: 99 }] });
	});
});
