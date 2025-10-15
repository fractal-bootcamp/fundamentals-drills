// puzzles/tests/assignment1.test.ts
import { describe, it, expect } from "vitest";
import { findPeaks } from "../problems/assignment1";

describe("findPeaks", () => {
  it("returns empty for empty input", () => {
    expect(findPeaks([])).toEqual([]);
  });

  it("single element is a peak", () => {
    expect(findPeaks([7])).toEqual([0]);
  });

  it("finds interior peaks", () => {
    expect(findPeaks([1, 2, 1, 9, 4, 6, 4])).toEqual([1, 3, 5]);
  });

  it("handles edges as potential peaks", () => {
    expect(findPeaks([5, 1, 1])).toEqual([0]);
    expect(findPeaks([1, 1, 5])).toEqual([2]);
  });

  it("no peaks when plateaus or non-strict", () => {
    expect(findPeaks([2, 2, 2])).toEqual([]);
    expect(findPeaks([1, 2, 2, 1])).toEqual([]);
  });

  it("monotonic arrays", () => {
    expect(findPeaks([1, 2, 3, 4])).toEqual([3]); // last is greater than left
    expect(findPeaks([4, 3, 2, 1])).toEqual([0]); // first is greater than right
  });

  it("table-driven small cases (property-like: peaks strictly greater than neighbors)", () => {
    const cases: Array<{ in: number[]; out: number[] }> = [
      { in: [0, 1, 0], out: [1] },
      { in: [1, 0, 1], out: [0, 2] },
      { in: [3, 1, 2, 1], out: [0, 2] },
      { in: [1, 3, 2, 4, 3], out: [1, 3] },
    ];
    for (const { in: arr, out } of cases) {
      expect(findPeaks(arr)).toEqual(out);
    }
  });
});
