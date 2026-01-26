import { describe, it, expect } from "vitest";
import { findPeaks, summarizeSpending } from "../problems/assignment1";

describe("findPeaks", () => {
  it("should find peaks in the middle of the array", () => {
    expect(findPeaks([1, 2, 1, 3, 5, 2])).toEqual([1, 4]);
  });

  it("should find peaks at the start and end", () => {
    expect(findPeaks([10, 8, 6, 7, 9])).toEqual([0, 4]);
  });

  it("should return empty array for empty input", () => {
    expect(findPeaks([])).toEqual([]);
  });

  it("should handle single element as a peak", () => {
    expect(findPeaks([42])).toEqual([0]);
  });

  it("should return empty array for constant values (no strict peaks)", () => {
    expect(findPeaks([5, 5, 5, 5])).toEqual([]);
  });

  it('should handle "valley" patterns', () => {
    expect(findPeaks([5, 2, 5])).toEqual([0, 2]);
  });

  it("should handle increasing sequences", () => {
    expect(findPeaks([1, 2, 3, 4, 5])).toEqual([4]);
  });

  it("should handle decreasing sequences", () => {
    expect(findPeaks([5, 4, 3, 2, 1])).toEqual([0]);
  });
});

describe("summarizeSpending", () => {
  const data = [
    { dept: "Engineering", amount: 500 },
    { dept: "Sales", amount: 200 },
    { dept: "Engineering", amount: 150 },
    { dept: "HR", amount: 100 },
    { dept: "Sales", amount: 400 },
    { dept: "Marketing", amount: 50 },
  ];

  it("should group, sum, filter, and sort departments", () => {
    const result = summarizeSpending(data, 300);
    expect(result).toEqual([
      { dept: "Engineering", total: 650 },
      { dept: "Sales", total: 600 },
    ]);
  });

  it("should return an empty array if no department exceeds threshold", () => {
    expect(summarizeSpending(data, 1000)).toEqual([]);
  });

  it("should handle threshold being exactly equal (exclusive)", () => {
    const simple = [{ dept: "HR", amount: 150 }];
    expect(summarizeSpending(simple, 150)).toEqual([]);
  });

  it("should handle empty input", () => {
    expect(summarizeSpending([], 100)).toEqual([]);
  });

  it("should return all departments if threshold is 0", () => {
    const simple = [
      { dept: "A", amount: 10 },
      { dept: "B", amount: 20 },
    ];
    const result = summarizeSpending(simple, 0);
    expect(result).toEqual([
      { dept: "B", total: 20 },
      { dept: "A", total: 10 },
    ]);
  });
});
