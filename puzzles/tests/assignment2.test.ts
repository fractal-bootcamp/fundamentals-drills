// puzzles/tests/assignment2.test.ts
import { describe, it, expect } from "vitest";
import { evaluateDroneRoutes } from "../problems/assignment2";

describe("evaluateDroneRoutes", () => {
	it("handles all drones successful", () => {
		const result = evaluateDroneRoutes(10, {
			A: [3, 2, 4],
			B: [5],
			C: [],
		});
		expect(result).toEqual({
			successful: { A: { used: 9 }, B: { used: 5 }, C: { used: 0 } },
			failed: {},
		});
	});

	it("detects a failure mid-route", () => {
		const result = evaluateDroneRoutes(10, {
			A: [3, 4, 2],
			B: [5, 7, 1],
		});
		expect(result.successful).toEqual({ A: { used: 9 } });
		expect(result.failed).toEqual({ B: { failedAt: 1, remaining: 5 } });
	});

	it("ignores invalid routes", () => {
		const result = evaluateDroneRoutes(5, {
			X: [2, -1, 3], // skip -1
			Y: [0, 1, 2], // skip 0
			Z: null as any, // ignore invalid
		});
		expect(result.successful).toEqual({ X: { used: 5 }, Y: { used: 3 } });
		expect(result.failed).toEqual({});
	});

	it("fails correctly at first segment", () => {
		const result = evaluateDroneRoutes(3, {
			A: [5, 1, 1],
		});
		expect(result.failed).toEqual({ A: { failedAt: 0, remaining: 3 } });
	});

	it("handles empty input", () => {
		const result = evaluateDroneRoutes(10, {});
		expect(result).toEqual({ successful: {}, failed: {} });
	});

	it("handles zero-distance and edge distances gracefully", () => {
		const result = evaluateDroneRoutes(4, {
			A: [0, 1, 3, 0],
			B: [2, 2, 2],
		});
		expect(result.successful).toEqual({ A: { used: 4 } });
		expect(result.failed).toEqual({ B: { failedAt: 2, remaining: 0 } });
	});
});
