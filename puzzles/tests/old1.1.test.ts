// puzzles/tests/assignment1.test.ts

import { describe, it, expect } from "vitest";
import { frequentElement } from "../problems/assignment1";

describe("frequentElement", () => {
	it("returns null for empty array", () => {
		expect(frequentElement([])).toBeNull();
	});

	it("finds most frequent element", () => {
		expect(frequentElement([1, 2, 2, 3, 3, 3, 2])).toBe(2);
		expect(frequentElement([4, 4, 1, 1, 1, 4])).toBe(1);
	});

	it("breaks ties by returning smallest element", () => {
		expect(frequentElement([5, 5, 3, 3])).toBe(3);
		expect(frequentElement([10, 20, 10, 20])).toBe(10);
	});

	it("works with single element", () => {
		expect(frequentElement([42])).toBe(42);
	});

	it("handles negative numbers", () => {
		expect(frequentElement([-1, -1, -2])).toBe(-1);
	});
});
