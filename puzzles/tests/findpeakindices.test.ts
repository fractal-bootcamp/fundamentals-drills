import { describe, it, expect } from "vitest";
import { findPeaks } from "../problems/findpeakindices";

describe("findPeaks", () => {
    it("returns indices of all strict local maxima (starter example)", () => {
        const nums = [1, 2, 1, 9, 4, 6, 4];
        expect(findPeaks(nums)).toEqual([1, 3, 5]);
    });

    it("handles empty and very small inputs", () => {
        expect(findPeaks([])).toEqual([]);
        expect(findPeaks([42])).toEqual([]);
        expect(findPeaks([1, 2])).toEqual([]);
    });

    it("no peaks in monotonic sequences", () => {
        expect(findPeaks([1, 2, 3, 4, 5])).toEqual([]);
        expect(findPeaks([5, 4, 3, 2, 1])).toEqual([]);
        expect(findPeaks([7, 7, 7, 7])).toEqual([]);
    });

    it("ignores plateaus (not strict) e.g., 2 next to 2 is not a peak", () => {
        expect(findPeaks([1, 2, 2, 1])).toEqual([]);
        expect(findPeaks([0, 3, 3, 2, 1])).toEqual([]);
    });

    it("finds multiple separated peaks", () => {
        expect(findPeaks([0, 3, 1, 4, 1, 5, 1])).toEqual([1, 3, 5]);
        expect(findPeaks([2, 5, 2, 5, 2])).toEqual([1, 3]);
    });

    it("property-like check: every reported index is a strict local maximum", () => {
        const cases: number[][] = [
            [1, 2, 1, 9, 4, 6, 4],
            [0, 3, 1, 4, 1, 5, 1],
            [10, 1, 10, 1, 10, 1, 10],
            [1, 1, 2, 1, 1],
        ];

        for (const arr of cases) {
            const peaks = findPeaks(arr);
            // indices are ascending and unique
            const sorted = [...peaks].sort((a, b) => a - b);
            expect(peaks).toEqual(sorted);
            for (const i of peaks) {
                expect(i).toBeGreaterThan(0);
                expect(i).toBeLessThan(arr.length - 1);
                expect(arr[i]).toBeGreaterThan(arr[i - 1]);
                expect(arr[i]).toBeGreaterThan(arr[i + 1]);
            }
        }
    });

    it("does not consider endpoints as peaks even if they are larger than one neighbor", () => {
        expect(findPeaks([9, 1, 2, 3])).toEqual([]);
        expect(findPeaks([1, 2, 3, 9])).toEqual([]);
    });
});
