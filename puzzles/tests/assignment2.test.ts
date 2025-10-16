// puzzles/tests/assignment2.test.ts

import { describe, it, expect } from "vitest";
import { scheduleTime } from "../problems/assignment2";

describe("scheduleTime", () => {
	it("returns 0 for empty input", () => {
		expect(scheduleTime([])).toBe(0);
	});

	it("handles single independent task", () => {
		expect(scheduleTime([{ id: "A", duration: 5, dependencies: [] }])).toBe(
			5
		);
	});

	it("handles simple dependency chain", () => {
		const input = [
			{ id: "A", duration: 3, dependencies: [] },
			{ id: "B", duration: 2, dependencies: ["A"] },
			{ id: "C", duration: 1, dependencies: ["B"] },
		];
		expect(scheduleTime(input)).toBe(6);
	});

	it("handles parallel branches correctly", () => {
		const input = [
			{ id: "A", duration: 3, dependencies: [] },
			{ id: "B", duration: 2, dependencies: ["A"] },
			{ id: "C", duration: 4, dependencies: ["A"] },
			{ id: "D", duration: 1, dependencies: ["B", "C"] },
		];
		expect(scheduleTime(input)).toBe(8);
	});

	it("handles independent tasks running in parallel", () => {
		const input = [
			{ id: "A", duration: 4, dependencies: [] },
			{ id: "B", duration: 2, dependencies: [] },
			{ id: "C", duration: 5, dependencies: [] },
		];
		expect(scheduleTime(input)).toBe(5);
	});
});
