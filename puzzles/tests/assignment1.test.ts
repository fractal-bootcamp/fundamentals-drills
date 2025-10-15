// puzzles/tests/assignment1.test.ts

import { describe, it, expect } from "vitest";
import { longestHeatStreak } from "../problems/assignment1";

describe("longestHeatStreak", () => {
  it("finds a simple streak in the middle of the array", () => {
    expect(longestHeatStreak([20, 25, 30, 18, 22, 24, 26], 22)).toBe(3);
  });

  it("finds a streak at the end of the array", () => {
    expect(longestHeatStreak([15, 14, 13, 20, 21, 22], 20)).toBe(3);
  });

  it("returns 0 when no temperatures meet the threshold", () => {
    expect(longestHeatStreak([10, 15, 18, 12], 25)).toBe(0);
  });

  it("handles the entire array being one long streak", () => {
    expect(longestHeatStreak([30, 32, 35, 31, 33], 30)).toBe(5);
  });

  it("handles multiple streaks and returns the longest", () => {
    expect(longestHeatStreak([25, 26, 20, 30, 31, 32, 33, 18, 27, 28], 25)).toBe(4);
  });

  it("handles empty array", () => {
    expect(longestHeatStreak([], 20)).toBe(0);
  });

  it("handles single element that meets threshold", () => {
    expect(longestHeatStreak([25], 20)).toBe(1);
  });

  it("handles single element that doesn't meet threshold", () => {
    expect(longestHeatStreak([15], 20)).toBe(0);
  });

  it("handles negative temperatures and negative threshold", () => {
    expect(longestHeatStreak([-5, -3, -2, -10, -1, 0, 1], -3)).toBe(3);
  });

  it("includes temperatures exactly equal to threshold", () => {
    expect(longestHeatStreak([20, 20, 20, 19, 20], 20)).toBe(3);
  });
});