// puzzles/tests/assignment1c.test.ts
import { describe, it, expect } from "vitest";
import { findPeaks } from "../problems/findpeakindices";

describe("findPeaks", () => {
    it("returns empty for arrays shorter than 3", () => {
        expect(findPeaks([])).toEqual([]);
        expect(findPeaks([1])).toEqual([]);
        expect(findPeaks([1, 2])).toEqual([]);
    });

    it("finds multiple peaks", () => {
        expect(findPeaks([1, 2, 1, 9, 4, 6, 4])).toEqual([1, 3, 5]);
    });

    it("excludes edges", () => {
        expect(findPeaks([9, 1, 2, 1, 9])).toEqual([2]);
    });

    it("excludes plateaus", () => {
        expect(findPeaks([1, 2, 2, 1])).toEqual([]);
        expect(findPeaks([3, 3, 3])).toEqual([]);
    });

    it("works with decreasing/increasing sequences", () => {
        expect(findPeaks([1, 2, 3, 4])).toEqual([]);
        expect(findPeaks([4, 3, 2, 1])).toEqual([]);
    });
});
