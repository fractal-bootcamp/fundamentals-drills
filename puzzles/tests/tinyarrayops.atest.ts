// puzzles/tests/assignment1.test.ts
import { describe, it, expect } from "vitest";
import { arrayMini } from "../problems/tinyarrayops";

describe("Assignment 0.5 — arrayMini", () => {
    it("sumPositives: sums only numbers > 0", () => {
        expect(arrayMini([1, -2, 3, 0, 2], "sumPositives")).toEqual(6);
    });

    it("sumPositives: empty array -> 0", () => {
        expect(arrayMini([], "sumPositives")).toEqual(0);
    });

    it("sumPositives: all non-positives -> 0", () => {
        expect(arrayMini([-1, 0, -5], "sumPositives")).toEqual(0);
    });

    it("countZeros: counts exact zeros", () => {
        expect(arrayMini([0, 1, 0, 2, 0], "countZeros")).toEqual(3);
    });

    it("countZeros: no zeros -> 0", () => {
        expect(arrayMini([1, 2, 3], "countZeros")).toEqual(0);
    });

    it("property-like table: sumPositives never less than 0", () => {
        const cases = [
            [],
            [-1, -2, -3],
            [0, 0, 0],
            [5],
            [-2, 3, -4, 10],
        ];
        for (const nums of cases) {
            const result = arrayMini(nums, "sumPositives");
            expect(result).toBeGreaterThanOrEqual(0);
        }
    });
});
