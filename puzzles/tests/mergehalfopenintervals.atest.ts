// puzzles/tests/intermediate1.test.ts
import { describe, it, expect } from "vitest";
import { mergeHalfOpenIntervals } from "../problems/StepUpmergehalfopenintervals";

describe("mergeHalfOpenIntervals", () => {
    it("returns empty for empty input", () => {
        expect(mergeHalfOpenIntervals([])).toEqual([]);
    });

    it("returns single interval unchanged", () => {
        expect(mergeHalfOpenIntervals([{ start: 5, end: 10 }])).toEqual([
            { start: 5, end: 10 },
        ]);
    });

    it("merges overlapping intervals", () => {
        expect(
            mergeHalfOpenIntervals([
                { start: 1, end: 3 },
                { start: 2, end: 4 },
            ])
        ).toEqual([{ start: 1, end: 4 }]);
    });

    it("does not merge touching intervals", () => {
        expect(
            mergeHalfOpenIntervals([
                { start: 1, end: 3 },
                { start: 3, end: 5 },
            ])
        ).toEqual([
            { start: 1, end: 3 },
            { start: 3, end: 5 },
        ]);
    });

    it("handles unsorted input and multiple merges", () => {
        expect(
            mergeHalfOpenIntervals([
                { start: 8, end: 9 },
                { start: 1, end: 4 },
                { start: 2, end: 6 },
                { start: 10, end: 12 },
                { start: 6, end: 7 },
            ])
        ).toEqual([
            { start: 1, end: 7 },
            { start: 8, end: 9 },
            { start: 10, end: 12 },
        ]);
    });

    it("property-like check: result is sorted and non-overlapping", () => {
        const out = mergeHalfOpenIntervals([
            { start: 5, end: 6 },
            { start: 1, end: 3 },
            { start: 2, end: 4 },
            { start: 6, end: 8 },
        ]);
        for (let i = 1; i < out.length; i++) {
            expect(out[i - 1].start <= out[i].start).toBe(true);
            // ensure non-overlapping (touching allowed in output only if input produced it)
            expect(out[i - 1].end <= out[i].start || out[i - 1].start === out[i].start).toBe(true);
        }
    });
});
