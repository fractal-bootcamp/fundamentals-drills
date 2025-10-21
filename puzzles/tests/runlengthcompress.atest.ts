// puzzles/tests/assignment1b.test.ts
import { describe, it, expect } from "vitest";
import { compressRuns } from "../problems/runlengthcompress";

describe("compressRuns", () => {
    it("returns empty array for empty input", () => {
        expect(compressRuns([])).toEqual([]);
    });

    it("handles single element", () => {
        expect(compressRuns([42])).toEqual([{ value: 42, count: 1 }]);
    });

    it("compresses multiple runs", () => {
        expect(compressRuns([1, 1, 2, 2, 2, 3])).toEqual([
            { value: 1, count: 2 },
            { value: 2, count: 3 },
            { value: 3, count: 1 },
        ]);
    });

    it("handles alternating values", () => {
        expect(compressRuns([5, 6, 5, 6])).toEqual([
            { value: 5, count: 1 },
            { value: 6, count: 1 },
            { value: 5, count: 1 },
            { value: 6, count: 1 },
        ]);
    });

    it("handles long identical sequences", () => {
        expect(compressRuns([7, 7, 7, 7])).toEqual([{ value: 7, count: 4 }]);
    });
});
