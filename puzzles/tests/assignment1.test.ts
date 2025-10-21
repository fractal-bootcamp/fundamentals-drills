import { describe, it, expect } from "vitest";
import { topVoters } from "../problems/assignment1";

describe("topVoters", () => {
  it("returns empty array for empty input", () => {
    expect(topVoters([])).toEqual([]);
  });

  it("returns single winner for simple input", () => {
    const votes = ["alice", "bob", "alice"];
    expect(topVoters(votes)).toEqual(["alice"]);
  });

  it("returns all tied winners sorted alphabetically", () => {
    const votes = ["b", "a", "b", "a"];
    // both 'a' and 'b' have 2 votes -> sorted order
    expect(topVoters(votes)).toEqual(["a", "b"]);
  });

  it("is case-sensitive when counting names", () => {
    const votes = ["A", "a", "A"];
    // 'A' has 2 votes, 'a' has 1
    expect(topVoters(votes)).toEqual(["A"]);
  });

  it("handles all votes for the same candidate", () => {
    const votes = Array.from({ length: 10 }, () => "same");
    expect(topVoters(votes)).toEqual(["same"]);
  });

  it("works for multiple candidates with varying counts", () => {
    const votes = [
      "x", "y", "z", "x", "y", "x", // x:3, y:2, z:1
      "w", "w",                      // w:2
    ];
    expect(topVoters(votes)).toEqual(["x"]);
  });

  it("table-driven examples (several representative cases)", () => {
    const cases: { input: string[]; expected: string[] }[] = [
      { input: ["one"], expected: ["one"] },
      { input: ["a", "b", "c", "b"], expected: ["b"] },
      { input: ["tie1", "tie2"], expected: ["tie1", "tie2"] }, // both 1 vote, sorted
      { input: ["n", "n", "m", "m"], expected: ["m", "n"] }, // tie 2 votes each -> alphabetical
    ];

    for (const c of cases) {
      expect(topVoters(c.input)).toEqual(c.expected);
    }
  });
});