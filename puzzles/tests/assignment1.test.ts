// puzzles/tests/assignment1.test.ts

import { describe, it, expect } from "vitest";
import { wordLadder } from "../problems/assignment1";

describe("wordLadder", () => {
	it("returns null when no path exists", () => {
		expect(wordLadder("hit", "zzz", ["hot", "dot", "dog"])).toBeNull();
	});

	it("returns minimum transformation count", () => {
		expect(
			wordLadder("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"])
		).toBe(5);
	});

	it("returns 1 when words differ by one letter", () => {
		expect(wordLadder("cat", "cot", ["cot"])).toBe(1);
	});

	it("returns null when dictionary is empty", () => {
		expect(wordLadder("a", "b", [])).toBeNull();
	});

	it("handles start equals end", () => {
		expect(wordLadder("same", "same", ["same"])).toBe(0);
	});
});
