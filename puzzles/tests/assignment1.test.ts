import { describe, it, expect } from "vitest";
import { countInRange } from "../problems/assignment1";

describe("countInRange", () => {
  it("counts numbers within a simple range", () => {
    expect(countInRange([1, 2, 3, 4, 5], 2, 4)).toBe(3);
  });

  it("includes numbers equal to the boundaries", () => {
    expect(countInRange([5, 10, 15, 20], 10, 15)).toBe(2);
  });

  it("returns 0 if no numbers are within range", () => {
    expect(countInRange([1, 2, 3], 10, 20)).toBe(0);
  });

  it("handles reversed ranges (start > end) gracefully", () => {
    expect(countInRange([1, 2, 3, 4, 5], 4, 2)).toBe(0);
  });

  it("handles single-element arrays", () => {
    expect(countInRange([3], 3, 3)).toBe(1);
    expect(countInRange([3], 2, 2)).toBe(0);
  });

  it("handles negative numbers and mixed ranges", () => {
    expect(countInRange([-5, -1, 0, 3, 5], -1, 3)).toBe(3);
  });

  it("handles empty arrays", () => {
    expect(countInRange([], 0, 10)).toBe(0);
  });
});
