import { describe, it, expect } from "vitest";
import {
  formatNames,
  findPeaks,
  countCharacterTypes,
  type User,
} from "../problems/assignment1";

describe("Problem 1: formatNames", () => {
  it("should filter out users under 18", () => {
    const users: User[] = [
      { first: "A", last: "A", age: 17 },
      { first: "B", last: "B", age: 18 },
      { first: "C", last: "C", age: 10 },
    ];
    expect(formatNames(users)).toEqual(["B, B"]);
  });

  it('should format as "Last, First"', () => {
    const users: User[] = [{ first: "John", last: "Doe", age: 20 }];
    expect(formatNames(users)).toEqual(["Doe, John"]);
  });

  it("should sort by last name then first name", () => {
    const users: User[] = [
      { first: "Zack", last: "Adams", age: 30 },
      { first: "Alice", last: "Doe", age: 25 },
      { first: "Bob", last: "Adams", age: 40 },
    ];
    // Adams, Bob comes before Adams, Zack alphabetically?
    // Usually B comes before Z.
    // Wait, Adams, Bob vs Adams, Zack.
    expect(formatNames(users)).toEqual(["Adams, Bob", "Adams, Zack", "Doe, Alice"]);
  });

  it("should handle empty input", () => {
    expect(formatNames([])).toEqual([]);
  });

  it("should handle all users filtered out", () => {
    const users: User[] = [
      { first: "Kid", last: "One", age: 5 },
      { first: "Kid", last: "Two", age: 15 },
    ];
    expect(formatNames(users)).toEqual([]);
  });
});

describe("Problem 2: findPeaks", () => {
  it("should find peaks in the middle", () => {
    expect(findPeaks([1, 5, 1, 6, 4])).toEqual([1, 3]);
  });

  it("should handle peak at the start", () => {
    expect(findPeaks([10, 5, 6])).toEqual([0]);
  });

  it("should handle peak at the end", () => {
    expect(findPeaks([1, 2, 3, 50])).toEqual([3]);
  });

  it("should handle single element", () => {
    // A single element is strictly greater than its non-existent neighbors?
    // Usually defined as yes or no depending on problem.
    // Let's stick to the prompt implication: "For the first element... if greater than second".
    // If there is no second, it's trivial?
    // Let's decide: Single element is a peak.
    expect(findPeaks([5])).toEqual([0]);
  });

  it("should handle empty array", () => {
    expect(findPeaks([])).toEqual([]);
  });

  it("should handle two elements ascending", () => {
    expect(findPeaks([1, 5])).toEqual([1]);
  });

  it("should handle two elements descending", () => {
    expect(findPeaks([5, 1])).toEqual([0]);
  });

  it("should handle plateau (no strict peak)", () => {
    expect(findPeaks([2, 2, 2])).toEqual([]);
  });

  it("should handle zigzag", () => {
    expect(findPeaks([1, 10, 1, 10, 1])).toEqual([1, 3]);
  });
});

describe("Problem 3: countCharacterTypes", () => {
  it("should count correctly for simple mixed string", () => {
    // H: cons, e: vow, l: cons, l: cons, o: vow -> 2 vow, 3 cons
    expect(countCharacterTypes("Hello")).toEqual({
      vowels: 2,
      consonants: 3,
      numbers: 0,
      others: 0,
    });
  });

  it("should handle numbers and others", () => {
    expect(countCharacterTypes("123 !?")).toEqual({
      vowels: 0,
      consonants: 0,
      numbers: 3,
      others: 3, // space, !, ?
    });
  });

  it("should be case insensitive for letters", () => {
    expect(countCharacterTypes("AaEe")).toEqual({
      vowels: 4,
      consonants: 0,
      numbers: 0,
      others: 0,
    });
  });

  it("should handle empty string", () => {
    expect(countCharacterTypes("")).toEqual({
      vowels: 0,
      consonants: 0,
      numbers: 0,
      others: 0,
    });
  });

  it("should handle all types together", () => {
    // "Testing 1, 2, 3!"
    // Vowels: e, i (2)
    // Consonants: T, s, t, n, g (5)
    // Numbers: 1, 2, 3 (3)
    // Others: space, comma, space, comma, space, ! (6)
    expect(countCharacterTypes("Testing 1, 2, 3!")).toEqual({
      vowels: 2,
      consonants: 5,
      numbers: 3,
      others: 6,
    });
  });
});
